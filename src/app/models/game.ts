import {Player} from "./player";
import {Round} from "./round";

export class Game {
  players: Player[] = [];
  rounds: Round[] = [];
  date?: Date;
}
