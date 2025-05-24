function calculateTrustScore(dev1, dev3) {
    // --- Dev 1 scoring ---
    const ageScore = Math.min(dev1.ageInDays / 10, 20);       // Max 20
    const txScore = Math.min(dev1.txVolume * 5, 30);           // Max 30
    const riskPenalty = Math.min(dev1.riskyContractsInteractedWith * 10, 30); // Max 30
  
    // --- Dev 3 scoring ---
    const riskyDeployedPenalty = Math.min(dev3.unverifiedContracts.length * 5, 10); // Max 10
    const subnetBonus = Object.values(dev3.subnetActivity).filter(Boolean).length * 5; // Max 15
  
    const rawScore = ageScore + txScore - riskPenalty - riskyDeployedPenalty + subnetBonus;
  
    const finalScore = Math.max(0, Math.min(100, rawScore));
  
    return {
      score: Math.round(finalScore),
      factors: {
        ageScore: Math.round(ageScore),
        txScore: Math.round(txScore),
        riskPenalty: Math.round(riskPenalty),
        riskyDeployedPenalty: Math.round(riskyDeployedPenalty),
        subnetBonus: Math.round(subnetBonus)
      }
    };
  }
  
  module.exports = { calculateTrustScore };
  