import { Avalanche, BinTools, BN } from 'avalanche';
import { AVALANCHE_CONFIG } from './config';

export class AvalancheClient {
  private avalanche: Avalanche;
  private bintools: BinTools;

  constructor() {
    this.avalanche = new Avalanche(
      AVALANCHE_CONFIG.C_CHAIN_RPC,
      AVALANCHE_CONFIG.NETWORK_IDS.MAINNET,
      'X',
      AVALANCHE_CONFIG.DEFAULT_SETTINGS.TIMEOUT_MS
    );
    this.bintools = BinTools.getInstance();
  }

  /**
   * Get the C-Chain API instance
   */
  getCChain() {
    return this.avalanche.CChain();
  }

  /**
   * Get contract verification status from Snowtrace
   * @param contractAddress The contract address to check
   */
  async getContractVerificationStatus(contractAddress: string): Promise<boolean> {
    try {
      const response = await fetch(
        `${AVALANCHE_CONFIG.SNOWTRACE_API}?module=contract&action=getabi&address=${contractAddress}`
      );
      const data = await response.json();
      return data.status === '1' && data.result !== 'Contract source code not verified';
    } catch (error) {
      console.error('Error checking contract verification:', error);
      return false;
    }
  }

  /**
   * Get contract creation transaction
   * @param contractAddress The contract address to check
   */
  async getContractCreationTx(contractAddress: string): Promise<string | null> {
    try {
      const response = await fetch(
        `${AVALANCHE_CONFIG.SNOWTRACE_API}?module=contract&action=getcontractcreation&contractaddresses=${contractAddress}`
      );
      const data = await response.json();
      return data.status === '1' ? data.result[0].txHash : null;
    } catch (error) {
      console.error('Error getting contract creation tx:', error);
      return null;
    }
  }

  /**
   * Get contract creator address
   * @param contractAddress The contract address to check
   */
  async getContractCreator(contractAddress: string): Promise<string | null> {
    try {
      const creationTx = await this.getContractCreationTx(contractAddress);
      if (!creationTx) return null;

      const tx = await this.getCChain().getTx(creationTx);
      return tx.getFrom().toString();
    } catch (error) {
      console.error('Error getting contract creator:', error);
      return null;
    }
  }
} 