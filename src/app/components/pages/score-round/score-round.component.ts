import { Component, OnInit } from '@angular/core';
import {GameService} from "../../../services/game.service";

@Component({
  selector: 'app-score-round',
  templateUrl: './score-round.component.html',
  styles: [
  ]
})
export class ScoreRoundComponent implements OnInit {

  constructor(public game: GameService) { }

  ngOnInit(): void {
  }

}
