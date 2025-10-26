import kaplay from 'kaplay';

const k = kaplay({
  width: 256,
  height: 224,
  letterbox: true,
  scale: 4,
  background: [0, 0, 0],
  pixelDensity: devicePixelRatio,
  global: false,
  debug: true // Set to false in prod.
});

export default k;
