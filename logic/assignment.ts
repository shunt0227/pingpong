import { PlayerAssignment, AssignmentResult, SeedSkipResult } from '../types';
import { BLOCKS, HALF_1_BLOCKS, QUARTER_GROUPS_MAP, ALL_PLAYERS, ALL_QUARTERS } from '../constants';

// Helper to shuffle an array
const shuffle = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Helper to get the half (1 or 2) for a given block
const getHalf = (block: string): 1 | 2 => {
  return HALF_1_BLOCKS.includes(block) ? 1 : 2;
};

// Helper to get the quarter ('AB', 'CD', 'EF', 'GH') for a given block
const getQuarter = (block: string): string => {
  return QUARTER_GROUPS_MAP[block];
};

/**
 * Validates if a given set of assignments conflicts with tournament rules.
 */
const validateAssignments = (assignments: PlayerAssignment[]): boolean => {
    const assignmentMap = new Map(assignments.map(a => [a.player, a.block]));

    for (let i = 0; i < assignments.length; i++) {
        for (let j = i + 1; j < assignments.length; j++) {
            const p1 = assignments[i];
            const p2 = assignments[j];

            const p1Rank = parseInt(p1.player.split('-')[1]);
            const p2Rank = parseInt(p2.player.split('-')[1]);

            // Rule for P1 vs P2
            if ((p1Rank === 1 && p2Rank === 2) || (p1Rank === 2 && p2Rank === 1)) {
                if (getHalf(p1.block) === getHalf(p2.block)) return false;
            }
            // Rule for P5 vs P6
            if ((p1Rank === 5 && p2Rank === 6) || (p1Rank === 6 && p2Rank === 5)) {
                if (getHalf(p1.block) === getHalf(p2.block)) return false;
            }
        }
    }
    
    // Rule for top 4 quarters
    const top4 = assignments.filter(a => ['I-1', 'I-2', 'I-3', 'I-4'].includes(a.player));
    if (top4.length > 1) {
        const quarters = top4.map(a => getQuarter(a.block));
        if (new Set(quarters).size !== quarters.length) return false;
    }

    return true;
};

/**
 * The core backtracking solver.
 * It can take constraints (pre-assigned players) to solve for the remaining players.
 */
const solveForTeam = (
  players: string[],
  availableBlocks: string[],
  constraints: PlayerAssignment[] = []
): PlayerAssignment[] | null => {
  if (players.length === 0) return [];
  if (players.length > availableBlocks.length) return null;

  const playerToBlockMap = new Map<string, string>();

  function backtrack(playerIndex: number, currentBlocks: string[]): boolean {
    if (playerIndex >= players.length) return true;

    const player = players[playerIndex];
    
    for (const block of shuffle(currentBlocks)) {
      playerToBlockMap.set(player, block);
      const assignmentsAsArray = Array.from(playerToBlockMap.entries()).map(([p, b]) => ({ player: p, block: b }));
      
      if (validateAssignments([...assignmentsAsArray, ...constraints])) {
        const remainingBlocks = currentBlocks.filter(b => b !== block);
        if (backtrack(playerIndex + 1, remainingBlocks)) {
          return true;
        }
      }
      playerToBlockMap.delete(player); 
    }
    return false;
  }
  
  const sortedPlayers = [...players].sort((a,b) => parseInt(a.split('-')[1]) - parseInt(b.split('-')[1]));
  
  if (backtrack(0, [...availableBlocks])) {
    return sortedPlayers.map(p => ({ player: p, block: playerToBlockMap.get(p)! }));
  }

  return null;
}

export const generateAssignments = (
  team1Count: number,
  team2Count: number
): AssignmentResult | null => {
  if (team1Count + team2Count !== 8) return null;
  
  const team1Players = Array.from({ length: team1Count }, (_, i) => `I-${i + 1}`);
  const team2Players = Array.from({ length: team2Count }, (_, i) => `I-${i + 1 + team1Count}`);

  const MAX_ATTEMPTS = 50;
  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    const fullAssignmentAttempt = solveForTeam(ALL_PLAYERS, BLOCKS);
    if(fullAssignmentAttempt){
      const team1Result = fullAssignmentAttempt.filter(p => team1Players.includes(p.player));
      const team2Result = fullAssignmentAttempt.filter(p => team2Players.includes(p.player));
      
      if(team1Result.length === team1Count && team2Result.length === team2Count){
          return { 
              team1: team1Result, 
              team2: team2Result.map(p => ({...p, player: `II-${parseInt(p.player.split('-')[1]) - team1Count}`})) 
          };
      }
    }
  }
  
  return null;
};

/**
 * Generates assignments for "Seed Skip" mode.
 * Returns two separate results: one for the full 8-player "I-Team" assignment,
 * and one for a new "II-Team" created from the fixed blocks.
 */
export const generateAssignmentsWithSkip = (preAssignments: Record<string, string>): SeedSkipResult | null => {
    const fixedAssignments: PlayerAssignment[] = [];
    for (const player of ALL_PLAYERS) {
        const block = preAssignments[player];
        if (block && block !== '') {
            fixedAssignments.push({ player, block });
        }
    }

    if (fixedAssignments.length === 0) return null;

    if (!validateAssignments(fixedAssignments)) {
        return null; // The user's fixed choices are self-conflicting.
    }

    // --- Calculation 1: Solve for the full 8-player "I-Team" ---
    const fixedPlayers = fixedAssignments.map(a => a.player);
    const floatingPlayers = ALL_PLAYERS.filter(p => !fixedPlayers.includes(p));

    const fixedBlocks = fixedAssignments.map(a => a.block);
    const availableBlocksForI = BLOCKS.filter(b => !fixedBlocks.includes(b));
    
    const floatingResult = solveForTeam(floatingPlayers, availableBlocksForI, fixedAssignments);
    
    if (!floatingResult) {
        return null; // Could not find a valid assignment for the rest of the players.
    }
    
    const team1Full = [...floatingResult, ...fixedAssignments].sort((a, b) => parseInt(a.player.split('-')[1]) - parseInt(b.player.split('-')[1]));

    // --- Calculation 2: Create a new "II-Team" from the fixed blocks ---
    const team2PlayersNew = Array.from({ length: fixedBlocks.length }, (_, i) => `II-${i + 1}`);
    const team2New = solveForTeam(team2PlayersNew, fixedBlocks);

    if (!team2New) {
        // This should theoretically not happen if the fixed blocks passed validation.
        // But as a safeguard:
        return null;
    }

    return {
        team1Full,
        team2New,
    };
};
