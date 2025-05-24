function calculateTrustScore(dev1, dev3) {
  // --- Dev 1 scoring ---
  const ageScore = Math.min(dev1.ageInDays / 10, 20); // Max 20
  const txScore = Math.min(dev1.txVolume * 5, 30); // Max 30
  const riskPenalty = Math.min(dev1.riskyContractsInteractedWith * 10, 30); // Max 30

  // --- Contract Profile Scoring ---
  const verificationBonus = dev1.contractVerified ? 15 : 0; // Max 15
  const mintingPenalty = dev1.canMintTokens ? -10 : 0; // Max -10
  const ownerControlPenalty = dev1.ownerControlsMinting ? -5 : 0; // Max -5
  const pauseContractPenalty = dev1.ownerCanPauseContract ? -5 : 0; // Max -5

  // --- Token Profile Scoring ---
  const tokenMintPenalty = Math.min(dev1.tokenMinted / 100000, 20); // Max 20
  const rugPoolPenalty = dev1.interactedWithKnownRugPools ? -15 : 0; // Max -15

  // --- Dev 3 scoring ---
  const riskyDeployedPenalty = Math.min(
    dev3.unverifiedContracts.length * 5,
    10
  ); // Max 10
  const subnetBonus =
    Object.values(dev3.subnetActivity).filter(Boolean).length * 5; // Max 15

  const rawScore =
    ageScore +
    txScore -
    riskPenalty -
    riskyDeployedPenalty +
    subnetBonus +
    verificationBonus +
    mintingPenalty +
    ownerControlPenalty +
    pauseContractPenalty -
    tokenMintPenalty +
    rugPoolPenalty;

  const finalScore = Math.max(0, Math.min(100, rawScore));

  return {
    score: Math.round(finalScore),
    factors: {
      ageScore: Math.round(ageScore),
      txScore: Math.round(txScore),
      riskPenalty: Math.round(riskPenalty),
      riskyDeployedPenalty: Math.round(riskyDeployedPenalty),
      subnetBonus: Math.round(subnetBonus),
      verificationBonus: Math.round(verificationBonus),
      mintingPenalty: Math.round(mintingPenalty),
      ownerControlPenalty: Math.round(ownerControlPenalty),
      pauseContractPenalty: Math.round(pauseContractPenalty),
      tokenMintPenalty: Math.round(tokenMintPenalty),
      rugPoolPenalty: Math.round(rugPoolPenalty),
    },
  };
}

module.exports = { calculateTrustScore };
