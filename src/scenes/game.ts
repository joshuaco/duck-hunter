import { COLORS } from "../constants";
import { formatScore } from "../utils";
import k from "../context/kaplayCtx";

k.loadSprite("background", "/graphics/background.png");

export function gameScene() {
  k.scene("game", () => {
    k.setCursor("none");

    k.add([k.rect(k.width(), k.height()), k.color(COLORS.BLUE), "sky"]);
    k.add([k.sprite("background"), k.pos(0, -10), k.z(1)]);

    const score = k.add([
      k.text(formatScore(0), { font: "nes", size: 8 }),
      k.pos(192, 197),
      k.z(2),
    ]);

    const roundCount = k.add([
      k.text("1", { font: "nes", size: 8 }),
      k.pos(42, 181),
      k.z(2),
      k.color(COLORS.RED),
    ]);
  });
}
