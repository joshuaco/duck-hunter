import { COLORS } from "../constants";
import k from "../context/kaplayCtx";

k.loadSprite("background", "/graphics/background.png");

export function gameScene() {
  k.scene("game", () => {
    k.setCursor("none");

    k.add([k.rect(k.width(), k.height()), k.color(COLORS.BLUE), "sky"]);
    k.add([k.sprite("background"), k.pos(0, -10), k.z(1)]);
  });
}
