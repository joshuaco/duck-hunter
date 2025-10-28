import type { GameObj } from 'kaplay';
import k from '../context/kaplayCtx';
import gameManager from '../manager/game-manager';

k.loadSprite('text-box', '/graphics/text-box.png');

const gameController = {
  roundStart(roundCount: GameObj) {
    gameManager.onStateEnter('round-start', async (isFirstRound: boolean) => {
      if (!isFirstRound) gameManager.duckSpeed += 50;

      k.play('ui-appear', { volume: 0.5 });

      gameManager.currentRound++;
      roundCount.text = gameManager.currentRound.toString();

      const textBox = k.add([
        k.sprite('text-box'),
        k.pos(k.center().x, k.center().y - 40),
        k.anchor('center'),
        k.z(2)
      ]);

      textBox.add([
        k.text(`ROUND`, { font: 'nes', size: 8 }),
        k.anchor('center'),
        k.pos(0, -10)
      ]);

      textBox.add([
        k.text(`${gameManager.currentRound}`, { font: 'nes', size: 8 }),
        k.anchor('center'),
        k.pos(0, 5)
      ]);

      await k.wait(1);

      textBox.destroy();
      gameManager.enterState('hunt-start');
    });
  }
};

export default gameController;
