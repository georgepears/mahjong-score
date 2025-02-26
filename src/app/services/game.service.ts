import { Injectable } from '@angular/core';
import { Game } from "../models/game";
import { Player } from "../models/player";
import { Round } from "../models/round";
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class GameService {

  currentGamePos = 0;
  currentRoundPos = 0;

  games: Game[] = [];

  constructor(public router: Router) {
    this.load();
  }

  load() {
    try {
      let games = localStorage.getItem('games');
      if (games != null) {
        this.games = JSON.parse(games) as Game[];
        if (!this.validateGames(this.games)) {
          throw new Error("Invalid game data");
        }
        this.setCurrentGame(this.games.length - 1);
      } else {
        this.initializeNewGame();
      }
    } catch (error) {
      console.error("Error loading games:", error);
      this.initializeNewGame();
    }
  }

  save() {
    localStorage.setItem('games', JSON.stringify(this.games));
  }

  initializeNewGame() {
    this.games = new Array<Game>();
    this.newGame();
  }

  validateGames(games: Game[]): boolean {
    // Add your validation logic here
    return games.every(game => game.players.length === 4 && game.rounds.length > 0);
  }

  newGame() {
    let newGame = new Game();
    for (let i = 0; i < 4; i++) {
      let player = new Player();
      newGame.players.push(player);
    }
    newGame.rounds.push(new Round(['East', 'South', 'West', 'North'])); // Default order for new game
    newGame.date = new Date(Date.now());

    this.games.push(newGame);
    this.setCurrentGame(this.games.length - 1);
    this.save();
  }

  setCurrentGame(index: number) {
    this.currentGamePos = index;
    if (this.games[this.currentGamePos]) {
      let currentGame = this.games[this.currentGamePos];
      if (currentGame.rounds.length == 0 || currentGame.rounds[0].results.length == 0) {
        this.navigate(['/members']);
      } else {
        this.navigate(['/scores']);
      }
    } else {
      console.error("Current game is undefined:", this.currentGamePos);
      this.initializeNewGame();
    }
  }

  navigate(route: string[]) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(route);
    });
  }

  newRound() {
    // Calculate next round order
    let newRoundWinds = this.currentRound.winds;
    if (this.currentRoundWinnerPos != this.currentRound.winds.indexOf('East')) {
      // If winner not east, calculate new order
      newRoundWinds = [newRoundWinds[3], newRoundWinds[0], newRoundWinds[1], newRoundWinds[2]];
    }
    this.game.rounds.push(new Round(newRoundWinds));
    this.currentRoundPos++;
    this.save();
  }

  calculateScores() {
    console.log(this.currentRound);
    this.currentRound.results = [0, 0, 0, 0];

    this.currentRound.scores.forEach((s1, i1) => {
      if (i1 != this.currentRound.winner) {
        // For each non-winner (player x), calculate amount to be paid to winner and taken from player x
        let toPayWinner = this.currentRound.scores[this.currentRound.winner!] * this.windMultiplier(i1) * this.windMultiplier(this.currentRound.winner!);
        this.currentRound.results[this.currentRound.winner!] += toPayWinner;
        this.currentRound.results[i1!] -= toPayWinner;
      }
    });
  }
}
