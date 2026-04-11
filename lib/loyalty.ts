import type { LoyaltyTier } from "@prisma/client";

/** 100 MAD dépensés = 10 points */
export const POINTS_PER_100_MAD = 10;

export const TIER_THRESHOLDS: Record<LoyaltyTier, number> = {
  bronze: 0,
  silver: 300,
  gold:   600,
};

/** Calcule les points gagnés sur un montant en MAD */
export function calculateEarnedPoints(totalMAD: number): number {
  return Math.floor(totalMAD / 100) * POINTS_PER_100_MAD;
}

/** Détermine le tier en fonction du total de points */
export function getTierFromPoints(points: number): LoyaltyTier {
  if (points >= TIER_THRESHOLDS.gold)   return "gold";
  if (points >= TIER_THRESHOLDS.silver) return "silver";
  return "bronze";
}

/** Points restants avant le prochain palier */
export function getPointsToNextTier(points: number): {
  nextTier: LoyaltyTier | null;
  pointsNeeded: number;
  progressPct: number;
} {
  if (points >= TIER_THRESHOLDS.gold) {
    return { nextTier: null, pointsNeeded: 0, progressPct: 100 };
  }
  if (points >= TIER_THRESHOLDS.silver) {
    const needed = TIER_THRESHOLDS.gold - points;
    const pct = Math.round(
      ((points - TIER_THRESHOLDS.silver) / (TIER_THRESHOLDS.gold - TIER_THRESHOLDS.silver)) * 100
    );
    return { nextTier: "gold", pointsNeeded: needed, progressPct: pct };
  }
  const needed = TIER_THRESHOLDS.silver - points;
  const pct = Math.round((points / TIER_THRESHOLDS.silver) * 100);
  return { nextTier: "silver", pointsNeeded: needed, progressPct: pct };
}

export const TIER_LABELS: Record<LoyaltyTier, string> = {
  bronze: "Bronze",
  silver: "Argent",
  gold:   "Gold",
};

export const TIER_BENEFITS: Record<LoyaltyTier, string[]> = {
  bronze: [
    "Accès aux offres exclusives abonnés",
    "Suivi de commande prioritaire",
    "Newsletter avec avant-premières",
  ],
  silver: [
    "Tout Bronze +",
    "Remise de 5 % sur la prochaine commande",
    "Livraison offerte dès 199 MAD",
    "Accès aux ventes privées",
  ],
  gold: [
    "Tout Argent +",
    "Remise de 10 % permanente",
    "Livraison gratuite sans minimum",
    "Conseiller dédié & service VIP",
    "Cadeau surprise à chaque commande",
  ],
};
