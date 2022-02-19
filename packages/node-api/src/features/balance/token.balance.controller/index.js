const { queryRmrkBalanceOnBifrost } = require("./bifrost.rmrk");
const { queryRmrkBalanceOnKarura } = require("./karura.rmrk");
const { chains, symbols, } = require("../../../constants");

const supportedChainSymbols = {
  [chains.karura]: [
    symbols.RMRK,
  ],
  [chains.bifrost]: [
    symbols.RMRK,
  ],
}

const emptyBalance = {
  free: 0,
  reserved: 0,
}

class TokenBalanceController {
  async getTokenBalance(ctx) {
    const { chain, symbol, account, blockHashOrHeight } = ctx.params;

    if (
      !Object.keys(supportedChainSymbols).includes(chain) ||
      !(supportedChainSymbols[chain] || []).includes(symbol)
    ) {
      ctx.body = emptyBalance;
      return
    }

    if (chain === chains.karura && symbol === symbols.RMRK) {
      ctx.body = await queryRmrkBalanceOnKarura(account, blockHashOrHeight);
      return
    } else if (chain === chains.bifrost && symbol === symbols.RMRK) {
      ctx.body = await queryRmrkBalanceOnBifrost(account, blockHashOrHeight);
      return
    }

    ctx.body = emptyBalance;
  }
}

module.exports = new TokenBalanceController();
