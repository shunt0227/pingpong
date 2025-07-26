import { BLOCKS } from '../constants';
import { DistributionResult } from '../types';

const DISTRIBUTION_SEQUENCE: string[] = ['A', 'H', 'E', 'D', 'C', 'F', 'G', 'B', 'B', 'G', 'F', 'C', 'D', 'E', 'H', 'A'];

export const calculateBlockDistribution = (totalParticipants: number): DistributionResult => {
  const counts: DistributionResult = BLOCKS.reduce((acc, block) => {
    acc[block] = 0;
    return acc;
  }, {} as DistributionResult);

  if (totalParticipants <= 0) {
    return counts;
  }

  for (let i = 0; i < totalParticipants; i++) {
    const block = DISTRIBUTION_SEQUENCE[i % DISTRIBUTION_SEQUENCE.length];
    if (counts[block] !== undefined) {
      counts[block]++;
    }
  }

  return counts;
};