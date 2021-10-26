const { getLatestHeight } = require("../../services/chain.service");
const spaceServices = require("../../spaces");
const { getTotalBalanceByHeight } = require("../../utils/polkadotApi");

async function getSpaceAccountBalance(ctx) {
  const { space, address } = ctx.params;
  const { snapshot } = ctx.query;

  const spaceService = spaceServices[space];
  const api = await spaceService.getApi();
  const blockHeight = snapshot ? parseInt(snapshot) : getLatestHeight(space);
  // FIXME: 1. check snapshot value, like 'abc'
  // FIXME: 2. maybe we should check the address format?
  const totalBalance = await getTotalBalanceByHeight(api, blockHeight, address)

  ctx.body = {
    balance: totalBalance
  };
}

module.exports = {
  getSpaceAccountBalance,
}
