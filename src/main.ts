import k from './context/kaplayCtx';
import { menuScene } from './scenes/main-menu';

menuScene();

k.scene('game', () => {});

k.scene('game-over', () => {});

k.go('main-menu');
