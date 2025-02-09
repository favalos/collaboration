const definitions = {
  types: [
    {
      // on all versions
      minmax: [0, undefined],
      types: {
        BurnTxDetails: {
          approvals: "u32",
          approvers: "Vec<AccountId>",
        },
        OrmlVestingSchedule: {
          start: "BlockNumber",
          period: "BlockNumber",
          periodCount: "u32",
          perPeriod: "Compact<Balance>",
        },
        VestingScheduleOf: "OrmlVestingSchedule",
      },
    },
  ],
};

const polkadexOptions = {
  typesBundle: {
    spec: {
      "node-polkadex": definitions,
    },
  },
  types: definitions.types[0].types,
};

module.exports = {
  polkadexOptions,
};
