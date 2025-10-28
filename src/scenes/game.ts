import { COLORS } from '../constants';
import { formatScore } from '../utils';
import k from '../context/kaplayCtx';
import gameManager from '../manager/game-manager';
import gameController from '../controllers/game';

k.loadSprite('background', '/graphics/background.png');
k.loadSprite('cursor', '/graphics/cursor.png');
k.loadSound('gun-shot', '/sounds/gun-shot.wav');
k.loadSound('ui-appear', '/sounds/ui-appear.wav');

export function gameScene() {
  k.scene('game', () => {
    k.setCursor('none');

    k.add([k.rect(k.width(), k.height()), k.color(COLORS.BLUE), 'sky']);
    k.add([k.sprite('background'), k.pos(0, -10), k.z(1)]);

    const score = k.add([
      k.text(formatScore(0), { font: 'nes', size: 8 }),
      k.pos(192, 197),
      k.z(2)
    ]);

    const roundCount = k.add([
      k.text('1', { font: 'nes', size: 8 }),
      k.pos(42, 181),
      k.z(2),
      k.color(COLORS.RED)
    ]);

    const duckIcons = k.add([k.pos(95, 198)]);
    let duckIconPosX = 1;

    for (let i = 0; i < 10; i++) {
      duckIcons.add([k.rect(7, 9), k.pos(duckIconPosX, 0), `duckIcon-${i}`]);
      duckIconPosX += 8;
    }

    const bulletMask = k.add([
      k.rect(0, 8),
      k.pos(25, 198),
      k.z(2),
      k.color(0, 0, 0)
    ]);

    const cursor = k.add([k.sprite('cursor'), k.anchor('center'), k.pos(), k.z(3)]);

    gameController.roundStart(roundCount);
    gameManager.enterState('round-start', true);

    k.onClick(() => {
      if (gameManager.state === 'hunt-start' && !gameManager.isGamePaused) {
        if (gameManager.bulletsLeft > 0) {
          k.play('gun-shot', { volume: 0.5 });
          gameManager.bulletsLeft--;
        }
      }
    });

    k.onUpdate(() => {
      score.text = formatScore(gameManager.currentScore);

      switch (gameManager.bulletsLeft) {
        case 3:
          bulletMask.width = 0;
          break;
        case 2:
          bulletMask.width = 8;
          break;
        case 1:
          bulletMask.width = 16;
          break;
        default:
          bulletMask.width = 24;
          break;
      }

      cursor.moveTo(k.mousePos());
    });
  });
}
