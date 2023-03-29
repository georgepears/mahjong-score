import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MainComponent} from "./components/pages/main/main.component";
import {MembersComponent} from "./components/pages/members/members.component";
import {ScoresComponent} from "./components/pages/scores/scores.component";
import {ScoreRoundComponent} from "./components/pages/score-round/score-round.component";

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        redirectTo: 'members',
        pathMatch: 'full'
      },
      {
        path: 'members',
        component: MembersComponent
      },
      {
        path: 'score-round',
        component: ScoreRoundComponent
      },
      {
        path: 'scores',
        component: ScoresComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
