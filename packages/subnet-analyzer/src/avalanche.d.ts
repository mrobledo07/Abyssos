declare module 'avalanche' {
  export class Avalanche {
    constructor(rpc: string, networkID: number, chainID: string, timeout: number);
    CChain(): any;
  }
  export class BinTools {
    static getInstance(): BinTools;
  }
  export class BN {
    // Add any methods or properties you need
  }
} 