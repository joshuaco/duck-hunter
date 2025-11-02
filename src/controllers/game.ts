import { fontConfig } from '../constants';
import k from '../context/kaplayCtx';
import gameManager from '../manager/game-manager';
import createDuck from '../entities/duck';

k.loadSprite('text-box', '/graphics/text-box.png');

const roundStart = gameManager.onStateEnter(
  'round-start',
  async (isFirstRound: boolean) => {
    if (!isFirstRound) gameManager.duckSpeed += 50;

    k.play('ui-appear', { volume: 0.5 });

    gameManager.currentRound++;
    k.get('round-count')[0].text = gameManager.currentRound.toString();

    const textBox = k.add([
      k.sprite('text-box'),
      k.pos(k.center().x, k.center().y - 40),
      k.anchor('center'),
      k.z(2)
    ]);

    textBox.add([k.text(`ROUND`, fontConfig), k.anchor('center'), k.pos(0, -10)]);

    textBox.add([
      k.text(`${gameManager.currentRound}`, fontConfig),
      k.anchor('center'),
      k.pos(0, 5)
    ]);

    await k.wait(1);

    textBox.destroy();
    gameManager.enterState('hunt-start');
  }
);

const huntStart = gameManager.onStateEnter('hunt-start', () => {
  gameManager.currentHunt++;
  const duck = createDuck(
    String(gameManager.currentHunt - 1),
    gameManager.duckSpeed
  );
  duck.setBehavior();
});

const huntEnd = gameManager.onStateEnter('hunt-end', () => {
  const bestScore = Number(k.getData('best-score'));
  if (gameManager.currentScore > bestScore) {
    k.setData('best-score', gameManager.currentScore.toString());
  }

  if (gameManager.currentHunt <= 9) {
    gameManager.enterState('hunt-start');
    return;
  }

  gameManager.currentHunt = 0;
  gameManager.enterState('round-end');
});

const duckHunted = gameManager.onStateEnter('duck-hunted', () => {
  gameManager.bulletsLeft = 3;
  k.get('dog', { recursive: true })[0].catchFallenDuck();
});

const duckEscaped = gameManager.onStateEnter('duck-escaped', () => {
  gameManager.bulletsLeft = 3;
  k.get('dog', { recursive: true })[0].mockLaugh();
});

export default { roundStart, huntStart, duckHunted, duckEscaped, huntEnd };
