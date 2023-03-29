import { Component, OnInit } from '@angular/core';
import {GameService} from "../../../services/game.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-scores',
  templateUrl: './scores.component.html',
  styles: [
  ]
})
export class ScoresComponent implements OnInit {

  constructor(public game: GameService, public router: Router) {
  }

  ngOnInit(): void {
  }

}
