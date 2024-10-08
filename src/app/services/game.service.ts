import {Injectable} from '@angular/core';
import {Game} from "../models/game";
import {Player} from "../models/player";
import {Round} from "../models/round";
import {Router} from "@angular/router";

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
    let games = localStorage.getItem('games');
    if (games != null) {
      this.games = JSON.parse(games) as Game[];
      this.setCurrentGame(this.games.length - 1);
      console.log(this.games);
      if (this.games.length < 1) {
        this.newGame();
      }
      else if (this.games[1].rounds[0]?.winds == null) {
        this.games = new Array<Game>;
        this.newGame();
      }
    } else {
      this.games = new Array<Game>;
      this.newGame();
    }
  }

  save() {
    localStorage.setItem('games', JSON.stringify(this.games));
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
    console.log(this.currentGamePos);
    console.log(this.game);
    console.log(this.games);
    if (this.game.rounds.length == 0 || this.game.rounds[0].results.length == 0) {
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
      this.router.navigate(['/members']));
    }
    else {
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
        this.router.navigate(['/scores']));
    }
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

        this.currentRound.scores.forEach((s2, i2) => {
          if (i2 != this.currentRound.winner && i1 != i2) {
            // For each other player that isn't the winner or player x, calculate differences to be passed around players
            let toPay = (this.currentRound.scores[i1] - this.currentRound.scores[i2]) * this.windMultiplier(i1) * this.windMultiplier(i2);
            this.currentRound.results[i1] += toPay;
          }
        });
      }
    });

    console.log('\n\nScores: ' + this.currentRound.scores);
    console.log('Results: ' + this.currentRound.results);

    this.save();
  }


  windMultiplier(pos: number): number {
    return pos == this.currentRound.winds?.indexOf('East') ? 2 : 1;
  }

  get game() {
    return this.games[this.currentGamePos];
  };

  get currentRound(): Round {
    return this.game.rounds[this.currentRoundPos];
  }

  get currentRoundWinnerPos(): number {
    return this.game.rounds[this.currentRoundPos].winner ?? -1;
  }


  get totals(): number[]  {
    let total = new Array(this.game.players.length).fill(0);
    this.game.rounds.forEach((round) => {
      console.log(round.results);
      total = total.map((r, i) => r + round.results[i]);
      console.log(total);
    })
    return total;
  }

}
