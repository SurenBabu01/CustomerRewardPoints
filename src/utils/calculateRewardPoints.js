import { REWARD_TIERS, MIN_SPENDING_FOR_REWARDS } from '../constants/rewardsConfig';
import logger from './logger';

/**
 * Calculates reward points for a given purchase amount.
 */
const calculateRewardPoints = (amount) => {
  /* Guard against invalid input */
  if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
    logger.warn(`Invalid amount for reward calculation: ${amount}`);
    return 0;
  }

  /* Floor the amount to handle fractional dollars */
  const flooredAmount = Math.floor(amount);

  /* No points if spending is at or below minimum threshold */
  if (flooredAmount <= MIN_SPENDING_FOR_REWARDS) {
    return 0;
  }

  /**
   * Reduce over tiers (sorted highest-to-lowest threshold).
   * For each tier, calculate points for dollars above the tier threshold,
   * then reduce the remaining amount to that threshold for the next tier.
   */
  const { points } = REWARD_TIERS.reduce(
    (acc, tier) => {
      if (acc.remainingAmount > tier.threshold) {
        const eligibleDollars = acc.remainingAmount - tier.threshold;
        const tierPoints = eligibleDollars * tier.pointsPerDollar;

        return {
          points: acc.points + tierPoints,
          remainingAmount: tier.threshold,
        };
      }
      return acc;
    },
    { points: 0, remainingAmount: flooredAmount }
  );

  logger.debug(`Reward points for $${amount}: ${points}`);
  return points;
};

export default calculateRewardPoints;
