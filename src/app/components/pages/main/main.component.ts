import { Component, OnInit } from '@angular/core';
import {GameService} from "../../../services/game.service";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styles: [
  ]
})
export class MainComponent implements OnInit {

  menu = false;

  constructor(public gameService: GameService) { }

  ngOnInit(): void {
  }

}
