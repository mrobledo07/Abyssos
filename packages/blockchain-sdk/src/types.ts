export interface ContractAnalysis {
  ageInDays: number;
  txVolume: number;
  deployedContracts: number;
  contractVerified: boolean;
  deployerAddress: string;
}

export interface AnalysisData {
  address: string;
  score: number;
  risk_level: string;
  risk_tags: string[];
  wallet_profile: {
    wallet_age_days: number;
    tx_count: number;
    contract_deploys: number;
    token_mints: number;
    interacted_with_known_rug: boolean;
  };
  contract_profile: {
    has_mint_function: boolean;
    is_verified: boolean;
    owner_controls_minting: boolean;
    can_pause_contract: boolean;
  };
  social_sentiment: string;
  timestamp: string;
}
