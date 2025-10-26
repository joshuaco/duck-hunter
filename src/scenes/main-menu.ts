import { COLORS } from '../constants';
import { formatScore } from '../utils';
import k from '../context/kaplayCtx';

k.loadSprite('menu', '/graphics/menu.png');
k.loadFont('nes', '/fonts/nintendo-nes-font/nintendo-nes-font.ttf');

export function menuScene() {
  k.scene('main-menu', () => {
    k.add([k.sprite('menu')]);
    k.add([
      k.text('CLICK TO START', { font: 'nes', size: 8 }),
      k.anchor('center'),
      k.pos(k.center().x, k.center().y + 40)
    ]);

    const bestScore = Number(k.getData('best-score')) ?? 0;

    k.add([
      k.text(`TOP SCORE = ${formatScore(bestScore)}`, { font: 'nes', size: 8 }),
      k.anchor('center'),
      k.pos(k.center().x, 184),
      k.color(COLORS.RED)
    ]);

    k.onClick(() => {
      k.go('game');
    });
  });
}
