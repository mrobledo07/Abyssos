export function generateMockData(contractAddress: string) {
  // Generate random mock data based on the contract address
  let seed = contractAddress
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const random = (min: number, max: number) => {
    const x = Math.sin(seed++) * 10000;
    return Math.floor((x - Math.floor(x)) * (max - min + 1)) + min;
  };

  return {
    tokenMinted: random(0, 1000),
    canMintTokens: 0,
    ownerControlsMinting: 0,
    ownerCanPauseContract: 0,
    interactedWithKnownRugPools: 0,
  };
}
