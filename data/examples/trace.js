import { AvaCloudSDK } from "@avalabs/avacloud-sdk";
import fs from 'fs/promises';
import readline from 'readline';

const avaCloudSDK = new AvaCloudSDK({
  apiKey: process.env.GLACIER_API_KEY,
  chainId: "43114",
  network: "mainnet",
});

// readline interface user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// prompt for input
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// validated address format
function isValidAddress(address) {
  const addressPattern = /^0x[a-fA-F0-9]{40}$/;
  return addressPattern.test(address);
}

// Get valid address from user
async function getValidAddress() {
  let address;
  while (true) {
    address = await askQuestion("Enter the wallet address (0x...): ");
    if (isValidAddress(address)) {
      return address;
    } else {
      console.log("❌ Invalid address format. Please enter a valid Ethereum address starting with 0x");
    }
  }
}

// Feature 1: Fetch Transaction History
async function fetchTransactionHistory() {
  try {
    console.log("\n=== Transaction History Fetcher ===");
    
    const address = await getValidAddress();
    
    console.log(`\n🔍 Fetching transactions for address: ${address}`);
    console.log("⏳ This may take a moment...\n");
    
    const result = await avaCloudSDK.data.evm.transactions.listTransactions({
      pageSize: 100,
      address: address,
      sortOrder: "asc",
    });
    
    // Create filename with address and timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `transactions_${address}_${timestamp}.json`;
    
    await fs.writeFile(filename, JSON.stringify(result, null, 2));
    
    console.log(`✅ Success! Transaction data saved to: ${filename}`);
    console.log(`📊 Found ${result.result?.transactions?.length || 0} transactions`);
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

// Feature 2: Find First Activity - Quick Search
async function findFirstActivity(address) {
  try {
    console.log(`🔍 Searching for first activity for: ${address}`);
    
    // Get transactions with ascending order (oldest first)
    const result = await avaCloudSDK.data.evm.transactions.listTransactions({
      pageSize: 1, // We only need the first one
      address: address,
      sortOrder: "asc", // Ascending = oldest first
    });

    if (result.result?.transactions?.length > 0) {
      const firstTx = result.result.transactions[0];
      
      // Debug: Log the raw transaction data
      console.log("🔍 Debug - Raw transaction data:", JSON.stringify(firstTx, null, 2));
      
      // Handle different timestamp formats and validate
      let timestamp = firstTx.blockTimestamp || firstTx.timestamp || firstTx.block?.timestamp;
      
      if (!timestamp) {
        console.log("⚠️  No timestamp found in transaction data");
        console.log("Available fields:", Object.keys(firstTx));
        return { error: "No timestamp available", transaction: firstTx };
      }
      
      // Ensure timestamp is a number
      timestamp = Number(timestamp);
      
      if (isNaN(timestamp)) {
        console.log("⚠️  Invalid timestamp format:", firstTx.blockTimestamp);
        return { error: "Invalid timestamp format", transaction: firstTx };
      }
      
      // Handle both seconds and milliseconds timestamps
      const timestampMs = timestamp > 1e12 ? timestamp : timestamp * 1000;
      const firstActivityDate = new Date(timestampMs);
      
      if (isNaN(firstActivityDate.getTime())) {
        console.log("⚠️  Could not create valid date from timestamp:", timestamp);
        return { error: "Invalid date", transaction: firstTx };
      }
      
      console.log("\n🎉 FIRST ON-CHAIN ACTIVITY FOUND:");
      console.log("================================");
      console.log(`📅 Date: ${firstActivityDate.toISOString()}`);
      console.log(`📅 Human readable: ${firstActivityDate.toLocaleString()}`);
      console.log(`🔗 Transaction Hash: ${firstTx.hash}`);
      console.log(`📦 Block Number: ${firstTx.blockNumber}`);
      console.log(`👤 From: ${firstTx.from}`);
      console.log(`👤 To: ${firstTx.to || 'Contract Creation'}`);
      console.log(`💰 Value: ${firstTx.value} wei`);
      console.log(`⛽ Gas Used: ${firstTx.gasUsed}`);
      
      return {
        firstActivity: firstActivityDate.toISOString(),
        transaction: firstTx,
        daysAgo: Math.floor((Date.now() - firstActivityDate.getTime()) / (1000 * 60 * 60 * 24))
      };
    } else {
      console.log("❌ No transactions found for this address");
      return null;
    }
  } catch (error) {
    console.error("❌ Error finding first activity:", error.message);
    return null;
  }
}

// Feature 2: Find First Activity - Comprehensive Search
async function getAllTransactionsToFindFirst(address) {
  try {
    console.log(`🔍 Fetching ALL transactions to find absolute first activity...`);
    
    let allTransactions = [];
    let pageToken = undefined;
    let pageCount = 0;
    
    do {
      pageCount++;
      console.log(`📄 Fetching page ${pageCount}...`);
      
      const result = await avaCloudSDK.data.evm.transactions.listTransactions({
        pageSize: 100,
        address: address,
        sortOrder: "asc",
        pageToken: pageToken
      });
      
      if (result.result?.transactions) {
        allTransactions.push(...result.result.transactions);
      }
      
      pageToken = result.result?.nextPageToken;
      
    } while (pageToken);
    
    if (allTransactions.length > 0) {
      // Sort by block timestamp to ensure we have the absolute first
      // Handle different timestamp field names and validate
      allTransactions.sort((a, b) => {
        const timestampA = Number(a.blockTimestamp || a.timestamp || 0);
        const timestampB = Number(b.blockTimestamp || b.timestamp || 0);
        return timestampA - timestampB;
      });
      
      const firstTx = allTransactions[0];
      let timestamp = Number(firstTx.blockTimestamp || firstTx.timestamp);
      
      if (isNaN(timestamp)) {
        console.log("⚠️  Invalid timestamp in comprehensive search");
        return null;
      }
      
      const timestampMs = timestamp > 1e12 ? timestamp : timestamp * 1000;
      const firstActivityDate = new Date(timestampMs);
      
      console.log("\n🎉 ABSOLUTE FIRST ON-CHAIN ACTIVITY:");
      console.log("===================================");
      console.log(`📅 Date: ${firstActivityDate.toISOString()}`);
      console.log(`📅 Human readable: ${firstActivityDate.toLocaleString()}`);
      console.log(`🔗 Transaction Hash: ${firstTx.hash}`);
      console.log(`📦 Block Number: ${firstTx.blockNumber}`);
      console.log(`📊 Total transactions found: ${allTransactions.length}`);
      console.log(`⏰ Days since first activity: ${Math.floor((Date.now() - firstActivityDate.getTime()) / (1000 * 60 * 60 * 24))}`);
      
      return {
        firstActivity: firstActivityDate.toISOString(),
        transaction: firstTx,
        totalTransactions: allTransactions.length,
        allTransactions: allTransactions
      };
    }
    
  } catch (error) {
    console.error("❌ Error in comprehensive search:", error.message);
    return null;
  }
}

// Feature 2: First Activity Menu
async function firstActivityFinder() {
  try {
    console.log("\n=== First On-Chain Activity Finder ===");
    
    const address = await getValidAddress();
    
    // Ask user which method they prefer
    console.log("\nChoose search method:");
    console.log("1. Quick search (first transaction only)");
    console.log("2. Comprehensive search (all transactions - more accurate but slower)");
    
    const method = await askQuestion("Enter choice (1 or 2): ");
    
    let result;
    if (method === "2") {
      result = await getAllTransactionsToFindFirst(address);
    } else {
      result = await findFirstActivity(address);
    }
    
    if (result) {
      // Save results to file
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `first_activity_${address}_${timestamp}.json`;
      await fs.writeFile(filename, JSON.stringify(result, null, 2));
      console.log(`\n💾 Results saved to: ${filename}`);
    }
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

// Main Menu
async function showMainMenu() {
  console.log("\n" + "=".repeat(50));
  console.log("🔗 AVALANCHE WALLET ANALYZER");
  console.log("=".repeat(50));
  console.log("1. 📊 Fetch Transaction History");
  console.log("2. 🎯 Find First On-Chain Activity");
  console.log("3. ❌ Exit");
  console.log("=".repeat(50));
  
  const choice = await askQuestion("Select an option (1-3): ");
  return choice;
}

// Main function
async function main() {
  try {
    console.log("🚀 Welcome to Avalanche Wallet Analyzer!");
    
    while (true) {
      const choice = await showMainMenu();
      
      switch (choice) {
        case "1":
          await fetchTransactionHistory();
          break;
        case "2":
          await firstActivityFinder();
          break;
        case "3":
          console.log("👋 Goodbye!");
          return;
        default:
          console.log("❌ Invalid choice. Please select 1, 2, or 3.");
      }
      
      // Ask if user wants to continue
      const continueChoice = await askQuestion("\nWould you like to continue? (y/n): ");
      if (continueChoice.toLowerCase() !== 'y' && continueChoice.toLowerCase() !== 'yes') {
        console.log("👋 Goodbye!");
        break;
      }
    }
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    rl.close();
  }
}

// Run the main function
main();