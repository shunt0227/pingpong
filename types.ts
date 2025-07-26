export interface PlayerAssignment {
  player: string;
  block: string;
}

export interface AssignmentResult {
  team1: PlayerAssignment[];
  team2: PlayerAssignment[];
}

export interface SeedSkipResult {
  team1Full: PlayerAssignment[];
  team2New: PlayerAssignment[];
}
