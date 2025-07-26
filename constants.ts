export const BLOCKS: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

export const HALF_1_BLOCKS: string[] = ['A', 'B', 'C', 'D'];
export const HALF_2_BLOCKS: string[] = ['E', 'F', 'G', 'H'];

export const QUARTER_GROUPS_MAP: { [key: string]: string } = {
  A: 'AB', B: 'AB',
  C: 'CD', D: 'CD',
  E: 'EF', F: 'EF',
  G: 'GH', H: 'GH',
};

export const ALL_QUARTERS: string[] = ['AB', 'CD', 'EF', 'GH'];

export const ALL_PLAYERS: string[] = Array.from({ length: 8 }, (_, i) => `I-${i + 1}`);