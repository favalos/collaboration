const chains = {
  polkadot: "polkadot",
  kusama: "kusama",
  karura: "karura",
  khala: "khala",
  statemine: "statemine",
  bifrost: "bifrost",
  kintsugi: "kintsugi",
  interlay: "interlay",
};

const oneSecond = 1000;
const sixSecond = 6 * oneSecond;
const twelveSecond = 12 * oneSecond;

const evmChains = Object.freeze({
  moonriver: "moonriver",
  moonbeam: "moonbeam",
});

const chainBlockTime = {
  polkadot: sixSecond,
  kusama: sixSecond,
  karura: twelveSecond,
  khala: twelveSecond,
  statemine: twelveSecond,
  bifrost: twelveSecond,
  kintsugi: twelveSecond,
  polkadex: twelveSecond,
  interlay: twelveSecond,
  [evmChains.moonriver]: twelveSecond,
  [evmChains.moonbeam]: twelveSecond,
};

const symbols = {
  RMRK: "RMRK",
  KSM: "KSM",
  ARIS: "ARIS",
  KINT: "KINT",
};

const nodeTimeoutSeconds = 20;

module.exports = {
  chains,
  evmChains,
  symbols,
  nodeTimeoutSeconds,
  chainBlockTime,
};
