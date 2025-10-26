import k from './context/kaplayCtx';
import { gameScene } from './scenes/game';
import { menuScene } from './scenes/main-menu';

menuScene();
gameScene();

k.scene('game-over', () => {});

k.go('main-menu');
