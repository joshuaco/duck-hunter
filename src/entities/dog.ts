import type { GameObj, Vec2 } from 'kaplay';
import k from '../context/kaplayCtx';
import gameManager from '../manager/game-manager';

k.loadSprite('dog', '/graphics/dog.png', {
  sliceX: 4,
  sliceY: 3,
  anims: {
    search: { from: 0, to: 3, speed: 6, loop: true },
    sniff: { from: 4, to: 5, speed: 4, loop: true },
    detect: 6,
    jump: { from: 7, to: 8, speed: 6 },
    catch: 9,
    mock: { from: 10, to: 11, loop: true }
  }
});
k.loadSound('sniffing', '/sounds/sniffing.wav');
k.loadSound('barking', '/sounds/barking.wav');
k.loadSound('laughing', '/sounds/laughing.wav');
k.loadSound('duck-hunted', '/sounds/successful-hunt.wav');

function createDog(position: Vec2) {
  const sniffingSound = k.play('sniffing', { volume: 2 });
  sniffingSound.stop();

  const barkingSound = k.play('barking');
  barkingSound.stop();

  const laughingSound = k.play('laughing');
  laughingSound.stop();

  return k.add([
    k.sprite('dog'),
    k.pos(position),
    k.state('search', ['search', 'sniff', 'detect', 'jump', 'drop']),
    k.z(1),
    {
      nbSniffs: 0,
      speed: 15,
      searchForDucks(this: GameObj) {
        this.onStateEnter('search', () => {
          this.play('search');
          k.wait(2, () => {
            this.enterState('sniff');
          });
        });

        this.onStateUpdate('search', () => {
          this.move(this.speed, 0);
        });

        this.onStateEnter('sniff', () => {
          this.nbSniffs++;
          this.play('sniff');
          k.wait(1, () => {
            if (this.nbSniffs === 2) {
              this.enterState('detect');
              return;
            }
            this.enterState('search');
          });
        });

        this.onStateEnter('detect', () => {
          this.play('detect');
          barkingSound.play();
          k.wait(1, () => {
            barkingSound.stop();
            this.enterState('jump');
          });
        });

        this.onStateEnter('jump', () => {
          this.play('jump');
          barkingSound.play();
          k.wait(0.5, () => {
            barkingSound.stop();
            this.use(k.z(0));
            this.enterState('drop');
          });
        });

        this.onStateUpdate('jump', () => {
          this.move(100, -40);
        });

        this.onStateEnter('drop', async () => {
          await k.tween(
            this.pos.y,
            this.pos.y + 35,
            0.5,
            (newY) => (this.pos.y = newY),
            k.easings.linear
          );
          gameManager.enterState('round-start', true);
        });
      },
      async slideUpAndDown(this: GameObj) {
        await k.tween(
          this.pos.y,
          90,
          0.4,
          (newY) => (this.pos.y = newY),
          k.easings.linear
        );
        await k.wait(1);
        await k.tween(
          this.pos.y,
          125,
          0.5,
          (newY) => (this.pos.y = newY),
          k.easings.linear
        );
      },
      async catchFallenDuck(this: GameObj) {
        this.play('catch');
        k.play('duck-hunted');
        await this.slideUpAndDown();
        gameManager.enterState('hunt-end');
      },
      async mockLaugh(this: GameObj) {
        this.play('mock');
        laughingSound.play();
        await this.slideUpAndDown();
        gameManager.enterState('hunt-end');
      }
    }
  ]);
}

export default createDog;
