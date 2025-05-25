import { AvaCloudSDK } from "@avalabs/avacloud-sdk";
import { AnalysisData, ContractAnalysis } from "./types";
import { generateMockData } from "./mock";

// Initialize AvaCloud SDK
const avaCloudSDK = new AvaCloudSDK({
  serverURL: "https://glacier-api.avax.network",
  chainId: "43114",
  network: "mainnet",
});

export async function analyzeContract(
  contractAddress: string
): Promise<AnalysisData> {
  try {
    // Get real contract data
    const contractData = await getContractData(contractAddress);

    // Get mock data for additional analysis
    const mockData = generateMockData(contractAddress);

    // Combine real and mock data
    return combineAnalysisData(contractData, mockData);
  } catch (error) {
    console.error("Error analyzing contract:", error);
    throw error;
  }
}

async function getContractData(
  contractAddress: string
): Promise<ContractAnalysis> {
  // Step 1: Get contract metadata
  const metadata = await avaCloudSDK.data.evm.contracts.getContractMetadata({
    chainId: "43114",
    address: contractAddress,
  });

  const deployerAddress = metadata.deploymentDetails.deployerAddress;
  const contractVerified = metadata.ercType !== "UNKNOWN";

  // Step 2: Count transactions involving the contract
  const txResponse = await avaCloudSDK.data.evm.transactions.listTransactions({
    address: deployerAddress,
    pageSize: 100,
    sortOrder: "asc",
  });

  const txVolume = txResponse.result.transactions.length;

  // Step 3: Get wallet creation date
  const initialTxResponse =
    await avaCloudSDK.data.evm.transactions.listTransactions({
      address: deployerAddress,
      pageSize: 1,
      sortOrder: "asc",
    });

  const walletCreationDate = new Date(
    initialTxResponse.result.transactions[0].nativeTransaction.blockTimestamp ||
      Date.now()
  );
  const currentDate = new Date();
  const ageInDays = Math.floor(
    (currentDate.getTime() - walletCreationDate.getTime()) /
      (1000 * 60 * 60 * 24)
  );

  // Step 4: Count number of contracts deployed by wallet
  const contractDeployments =
    await avaCloudSDK.data.evm.transactions.listContractDeployments({
      address: deployerAddress,
      chainId: "43114",
    });

  const deployedContracts = contractDeployments.result.contracts.length;

  return {
    ageInDays,
    txVolume,
    deployedContracts,
    contractVerified,
    deployerAddress,
  };
}

function combineAnalysisData(
  contractData: ContractAnalysis,
  mockData: any
): AnalysisData {
  const score = calculateRiskScore(contractData, mockData);
  const riskLevel = calculateRiskLevel(score);
  const riskTags = generateRiskTags(contractData, mockData);

  return {
    address: contractData.deployerAddress,
    score,
    risk_level: riskLevel,
    risk_tags: riskTags,
    wallet_profile: {
      wallet_age_days: contractData.ageInDays,
      tx_count: contractData.txVolume,
      contract_deploys: contractData.deployedContracts,
      token_mints: mockData.tokenMinted || 0,
      interacted_with_known_rug: mockData.interactedWithKnownRugPools || false,
    },
    contract_profile: {
      has_mint_function: mockData.canMintTokens || false,
      is_verified: contractData.contractVerified,
      owner_controls_minting: mockData.ownerControlsMinting || false,
      can_pause_contract: mockData.ownerCanPauseContract || false,
    },
    social_sentiment: "neutral",
    timestamp: new Date().toISOString(),
  };
}

function calculateRiskScore(
  contractData: ContractAnalysis,
  mockData: any
): number {
  let score = 100;

  // Penalty for wallet age
  if (contractData.ageInDays < 30) score -= 20;
  else if (contractData.ageInDays < 90) score -= 10;

  // Penalty for transaction volume
  if (contractData.txVolume < 10) score -= 15;
  else if (contractData.txVolume < 50) score -= 5;

  // Penalty for number of deployed contracts
  if (contractData.deployedContracts > 5) score -= 10;
  else if (contractData.deployedContracts > 2) score -= 5;

  // Bonus for contract verification
  if (contractData.contractVerified) score += 15;

  // Additional penalties from mockData
  if (mockData.canMintTokens) score -= 10;
  if (mockData.ownerControlsMinting) score -= 5;
  if (mockData.ownerCanPauseContract) score -= 5;
  if (mockData.interactedWithKnownRugPools) score -= 15;

  return Math.max(0, Math.min(100, score));
}

function calculateRiskLevel(score: number): string {
  if (score <= 33) return "high";
  if (score <= 66) return "medium";
  return "low";
}

function generateRiskTags(
  contractData: ContractAnalysis,
  mockData: any
): string[] {
  const tags: string[] = [];

  if (contractData.ageInDays < 30) tags.push("new_wallet");
  if (contractData.txVolume < 10) tags.push("low_activity");
  if (contractData.deployedContracts > 5) tags.push("multiple_deploys");
  if (!contractData.contractVerified) tags.push("unverified_contract");
  if (mockData.canMintTokens) tags.push("can_mint_tokens");
  if (mockData.ownerControlsMinting) tags.push("owner_controls_minting");
  if (mockData.ownerCanPauseContract) tags.push("can_pause_contract");
  if (mockData.interactedWithKnownRugPools) tags.push("rug_pool_interaction");

  return tags;
}
