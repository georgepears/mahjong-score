import { Component, OnInit } from '@angular/core';
import {GameService} from "../../../services/game.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html'
})
export class MembersComponent implements OnInit {

  constructor(public game: GameService, public router: Router) {

  }

  ngOnInit(): void {
  }

}
