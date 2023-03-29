import {Injectable} from '@angular/core';
import {Game} from "../models/game";
import {Player} from "../models/player";
import {Round} from "../models/round";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class GameService {

  currentGame = 0;
  currentRound = 0;

  games: Game[] = [];
  get game() {return this.games[this.currentGame]};


  constructor(public router: Router) {
    this.load()
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
    newGame.rounds.push(new Round());
    newGame.date = new Date(Date.now());

    this.games.push(newGame);
    this.setCurrentGame(this.games.length - 1)
    this.save()
  }

  setCurrentGame(index: number) {
    this.currentGame = index;
    console.log(this.currentGame);
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
    this.game.rounds.push(new Round());
    this.currentRound++;
    this.save()
  }

  currentRoundWinner(): number {
    return this.game.rounds[this.currentRound].winner ?? -1;
  }

  calculateScores() {
    // Get winner + multiply score by number of other players (array len - 1)
    let currentRound = this.game.rounds[this.currentRound]
    console.log(currentRound);

    // Winner takes points off each of the losers
    currentRound.results[currentRound.winner!] = currentRound.scores[currentRound.winner!] * (this.game.players.length - 1)

    // Player A's score is 2A - B - C - winner's score (B + C are two other player's scores)
    currentRound.scores.forEach((s1, i1) => {
      if (i1 != currentRound.winner) { // For each loser
        currentRound.results[i1] = (currentRound.scores[i1] * 2) - currentRound.scores[currentRound.winner!];
        currentRound.scores.forEach((s2, i2) => {
          if (i2 != currentRound.winner && i1 != i2) { // For each other loser
            currentRound.results[i1] -= currentRound.scores[i2];
          }
        })
      }
    })

    console.log('Scores: ' + currentRound.scores);
    console.log('Results: ' + currentRound.results);
    // For players without 'result'

    this.save();
  }

  get totals(): number[]  {
    let total = new Array(this.game.players.length).fill(0);
    this.game.rounds.forEach((round) => {
      console.log(round.results)
      total = total.map((r, i) => r + round.results[i])
      console.log(total);
    })
    return total;
  }

}
