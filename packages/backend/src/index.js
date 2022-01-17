const dotenv = require('dotenv');
dotenv.config();

const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const logger = require("koa-logger");
const helmet = require("koa-helmet");
const cors = require("@koa/cors");
const { startUpdateHeight } = require("./services/chain.service");
const { reloadSpaces } = require("./spaces");

const app = new Koa();

app.use(cors());
app.use(logger());
app.use(bodyParser());
app.use(helmet());

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = {
      message: err.message,
      data: err.data,
    };
  }
});

require("./routes")(app);

reloadSpaces().then(() => startUpdateHeight());

app.listen(process.env.PORT || 3000, (err) => {
  if (err) throw err;
  console.log(`> Ready on http://127.0.0.1:${process.env.PORT}`);
});
