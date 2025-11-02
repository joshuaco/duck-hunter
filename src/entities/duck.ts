import type { GameObj } from 'kaplay';
import { COLORS } from '../constants';
import k from '../context/kaplayCtx';
import gameManager from '../manager/game-manager';

k.loadSprite('duck', '/graphics/duck.png', {
  sliceX: 8,
  sliceY: 1,
  anims: {
    'flight-diagonal': { from: 0, to: 2, loop: true },
    'flight-side': { from: 3, to: 5, loop: true },
    shot: 6,
    fall: 7
  }
});

k.loadSound('quacking', '/sounds/quacking.wav');
k.loadSound('flapping', '/sounds/flapping.ogg');
k.loadSound('impact', '/sounds/impact.wav');
k.loadSound('fall', '/sounds/fall.wav');

function createDuck(duckID: string, speed: number) {
  // Starting positions
  const startPos = [
    k.vec2(80, k.center().y + 40),
    k.vec2(k.center().x, k.center().y + 40)
  ];

  // Normalize vectors
  const flyDirections = [k.vec2(-1, -1), k.vec2(1, -1), k.vec2(1, -1)];

  const chosenPosIndex = k.randi(startPos.length);
  const choseFlyDirectionIndex = k.randi(flyDirections.length);

  return k.add([
    k.sprite('duck', { anim: 'flight-side' }),
    k.area({ shape: new k.Rect(k.vec2(0), 24, 24) }), // Collision component
    k.pos(startPos[chosenPosIndex]),
    k.body(),
    k.anchor('center'),
    k.state('fly', ['fly', 'shot', 'fall']),
    k.timer(),
    k.offscreen({ destroy: true, distance: 100 }),
    {
      flyTimer: 0,
      flyTimerLoop: null,
      timeBeforeEscape: 5,
      duckID,
      flyDirection: null,
      speed,
      quackingSound: null,
      flappingSound: null,
      fallSound: null,
      setBehavior(this: GameObj) {
        this.flyDirection = flyDirections[choseFlyDirectionIndex];

        if (this.flyDirection.x < 0) this.flipX = true;
        this.quackingSound = k.play('quacking', { volume: 0.5, loop: true });
        this.flappingSound = k.play('flapping', { loop: true, speed: 2 });

        this.onStateUpdate('fly', () => {
          const currentAnim =
            this.getCurAnim().name === 'flight-side'
              ? 'flight-diagonal'
              : 'flight-side';
          if (
            this.flyTimer < this.timeBeforeEscape &&
            (this.pos.x > k.width() + 10 || this.pos.x < -10)
          ) {
            this.flyDirection.x = -this.flyDirection.x;
            this.flipX = !this.flipX;
            this.play(currentAnim);
          }

          if (this.pos.y < -10 || this.pos.y > k.height() - 70) {
            this.flyDirection.y = -this.flyDirection.y;
            this.play(currentAnim);
          }

          this.move(
            this.speed * this.flyDirection.x,
            this.speed * this.flyDirection.y
          );
        });

        this.onStateEnter('shot', async () => {
          this.quackingSound.stop();
          this.flappingSound.stop();

          this.flyTimerLoop.cancel();

          gameManager.ducksShotInRound++;
          await k.wait(0.5);

          this.enterState('fall');
        });

        this.onStateEnter('fall', () => {
          this.fallSound = k.play('fall', { volume: 0.7 });
          this.play('fall');
        });

        this.onStateUpdate('fall', async () => {
          this.move(0, this.speed - 30);

          if (this.pos.y > k.height() - 50) {
            console.log({ posX: this.pos.x });
            this.fallSound.stop();

            k.play('impact');

            this.destroy();
            sky.color = k.Color.fromHex(COLORS.BLUE);

            const duckIcon = k.get(`duckIcon-${this.duckID}`, {
              recursive: true
            })[0];

            duckIcon.color = k.Color.fromHex(COLORS.RED);

            await k.wait(1);
            gameManager.enterState('duck-hunted');
          }
        });

        this.onClick(() => {
          if (gameManager.bulletsLeft <= 0 || this.state === 'fall') return;
          gameManager.currentScore += 100;
          this.play('shot');
          this.enterState('shot');
        });

        const sky = k.get('sky')[0];

        this.flyTimerLoop = this.loop(1, () => {
          this.flyTimer += 1;
          if (this.flyTimer === this.timeBeforeEscape) {
            sky.color = k.Color.fromHex(COLORS.BEIGE);
          }
        });

        this.onExitScreen(() => {
          this.quackingSound.stop();
          this.flappingSound.stop();
          sky.color = k.Color.fromHex(COLORS.BLUE);

          gameManager.bulletsLeft = 3;
          gameManager.enterState('duck-escaped');
        });
      }
    }
  ]);
}

export default createDuck;
