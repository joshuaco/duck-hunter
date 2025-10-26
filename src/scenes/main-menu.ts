import k from "../context/kaplayCtx";

k.loadSprite("menu", "/graphics/menu.png");
k.loadFont("nes", "/fonts/nintendo-nes-font/nintendo-nes-font.ttf");

export function menuScene() {
  k.scene("main-menu", () => {
    k.add([k.sprite("menu")]);
    k.add([
      k.text("CLICK TO START", { font: "nes", size: 8 }),
      k.anchor("center"),
      k.pos(k.center().x, k.center().y + 40),
    ]);

    k.onClick(() => {
      k.go("game");
    });
  });
}
