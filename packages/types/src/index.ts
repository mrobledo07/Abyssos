export interface WalletAnalysis {
  address: string;
  riskScore: number;
  createdAt: string;
  updatedAt: string;
  metrics: {
    age: number;
    transactionCount: number;
    suspiciousInteractions: number;
    knownScamInteractions: number;
  };
  summary: string;
  details: {
    onChain: {
      transactionHistory: string[];
      contractInteractions: string[];
      tokenHoldings: string[];
    };
    offChain: {
      socialPresence: string[];
      communityReputation: string[];
    };
  };
}

export interface TokenAnalysis {
  address: string;
  riskScore: number;
  createdAt: string;
  updatedAt: string;
  metrics: {
    liquidity: number;
    holderCount: number;
    contractRisk: number;
    socialPresence: number;
  };
  summary: string;
  details: {
    onChain: {
      contractCode: string;
      liquidityPools: string[];
      holderDistribution: string[];
    };
    offChain: {
      socialPresence: string[];
      communityReputation: string[];
    };
  };
}

export interface AnalysisReport {
  id: string;
  type: "wallet" | "token";
  address: string;
  riskScore: number;
  createdAt: string;
  updatedAt: string;
  data: WalletAnalysis | TokenAnalysis;
  nftMetadata?: {
    tokenId: string;
    contractAddress: string;
  };
}
