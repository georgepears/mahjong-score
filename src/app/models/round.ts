export class Round {
  winner?: number; // Index of the winning player

  scores: number[] = []; // Scores inputted by user in same order as players
  results: number[] = []; // Results calculated in same order as players
  winds: string[] = []; // Winds of each player in same order as players

  constructor(_winds: string[]) {
    this.winds = _winds;
  }
}
