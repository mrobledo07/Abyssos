export const AVALANCHE_CONFIG = {
  // Main C-Chain RPC
  C_CHAIN_RPC: 'https://api.avax.network/ext/bc/C/rpc',
  
  // Subnet RPCs
  SUBNET_RPCS: {
    DEXALOT: 'https://subnets.avax.network/dexalot/rpc',
    DEFI_KINGDOMS: 'https://subnets.avax.network/defi-kingdoms/rpc'
  },
  
  // Network IDs
  NETWORK_IDS: {
    MAINNET: 1,
    FUJI: 5
  },
  
  // Contract verification endpoints
  SNOWTRACE_API: 'https://api.snowtrace.io/api',
  
  // Default settings
  DEFAULT_SETTINGS: {
    BLOCK_CONFIRMATIONS: 3,
    MAX_RETRIES: 3,
    TIMEOUT_MS: 30000
  }
} as const;

export type SubnetType = keyof typeof AVALANCHE_CONFIG.SUBNET_RPCS; 