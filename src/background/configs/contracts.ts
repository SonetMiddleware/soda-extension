const TestnetContracts = {
  MockRPC: '0x75AD3a3D1a30af7Adf9D0ee8691F58D8B1f279b9',
  RPCRouter: '0x387077894f15070133177faD92Fb836fc5B52D1C',
  PlatwinMEME: '0xadDCa5C98b0fB6F8F9b4324D9f97F9Da55cbc3B2',
  PlatwinMEME2: '0x917be393EeF337f280eF2000430F16c1340CAcAd',
  PlatwinBatchMeme: '0x7c19f2eb9e4524D5Ef5114Eb646583bB0Bb6C8F8',
  Market: '0x0F81a06bc1d22F6807501E78808E26eF6B9bd7Bc',
  MarketProxy: '0x0b9fE698176eE725CcaD7d2dbD9F71d977284476',
  TestERC20: '0x132Eb6C9d49ACaB9cb7B364Ea79FdC169Ef90e59',
  DealRouter: '0xd79Ffe5F296D547f0CB066b3c91dE0361e7e522b',
  MarketWithoutRPC: '0x0E992194Cc939beE333e8d35c25BfCe7C2f99a6a',
  MarketProxyWithoutRPC: '0xc7225694A6Fe8793eEf5B171559Cbd245E73b987',
  PlatwinMEME2WithoutRPC: '0x0daB724e3deC31e5EB0a000Aa8FfC42F1EC917C5',
  DAORegistry: '0x9a7e176576abb82496e6b3791E15Bea08ecc723e',
};
const RinkebyContracts = {
  PlatwinMEMEWithMeta: '0x4b2b1f6f2accf4bcdd53fc65e1e4a4ef2b289399',
  TestERC20: '0x37e8a25c96c05243007b1f3124c7bb65cf48852c',
  DealRouter: '0xf7C44f215F85453D888A069a1c543D7c488606B6',
  MarketWithoutRPC: '0x1443D92E71eFADE956Aa0198F7EC5eeb6d5f2E0F',
  MarketProxyWithoutRPC: '0x7eBADFBe8679f63313080f36460369714106F834',
  PlatwinMEME2WithoutRPC: '0x12DafDC77B0c754481395783Fa2e59024e92C2eF',
  DAORegistry: '0x6CEc4160f0Bf0Be55b9AB4Ba48fe019019Df9C48',
};
type ContractConfigs = {
  [key: string]: {
    [key: number]: string;
  };
};
const configs: ContractConfigs = {
  MockRPC: {
    137: '',
    80001: TestnetContracts.MockRPC,
    4: '',
  },

  RPCRouter: {
    80001: TestnetContracts.RPCRouter,
    137: '',
  },
  PlatwinMEME: {
    80001: TestnetContracts.PlatwinMEME,
    137: '',
  },
  PlatwinMEME2: {
    80001: TestnetContracts.PlatwinMEME2,
    137: '',
  },
  PlatwinMEME2WithoutRPC: {
    80001: TestnetContracts.PlatwinMEME2WithoutRPC,
    137: '',
    4: RinkebyContracts.PlatwinMEME2WithoutRPC,
  },
  PlatwinBatchMeme: {
    80001: TestnetContracts.PlatwinBatchMeme,
    137: '',
  },
  Market: {
    80001: TestnetContracts.Market,
    137: '',
  },
  MarketWithoutRPC: {
    80001: TestnetContracts.MarketWithoutRPC,
    137: '',
    4: RinkebyContracts.MarketWithoutRPC,
  },
  MarketProxy: {
    80001: TestnetContracts.MarketProxy,
    137: '',
    4: '',
  },
  MarketProxyWithoutRPC: {
    80001: TestnetContracts.MarketProxyWithoutRPC,
    137: '',
    4: RinkebyContracts.MarketProxyWithoutRPC,
  },
  DaoRegistery: {
    80001: TestnetContracts.DAORegistry,
    137: '',
    4: RinkebyContracts.DAORegistry,
  },
};
export default configs;
