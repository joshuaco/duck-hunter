import type { GameObj } from 'kaplay';
import k from '../context/kaplayCtx';

function createGameManager() {
  return k.add([
    k.state('menu', [
      'menu',
      'cutscene',
      'round-start',
      'round-end',
      'hunt-end',
      'duck-hunted',
      'duck-escaped',
    ]),
    {
      isGamePaused: false,
      currentScore: 0,
      currentRound: 0,
      currentHunt: 0,
      bulletsLeft: 3,
      ducksShotInRound: 0,
      duckSpeed: 100,
      resetGameState(this: GameObj) {
        this.currentScore = 0;
        this.currentRound = 0;
        this.currentHunt = 0;
        this.bulletsLeft = 3;
        this.ducksShotInRound = 0;
        this.duckSpeed = 100;
      },
    },
  ]);
}

const gameManager = createGameManager();

export default gameManager;
