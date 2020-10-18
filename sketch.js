const canvasSketch = require("canvas-sketch");
const { lerp } = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random");
const palletes = require("nice-color-palettes");

const settings = {
  dimensions: [2048, 2048],
};

random.setSeed(random.getRandomSeed());
console.log(random.getSeed());

const sketch = () => {
  const colorCount = random.rangeFloor(1, 6);
  const pallete = random.shuffle(random.pick(palletes)).slice(0, colorCount);

  const createGrid = () => {
    const points = [];
    const count = 30;
    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        const u = count <= 1 ? 0.5 : x / (count - 1);
        const v = count <= 1 ? 0.5 : y / (count - 1);
        const radius = Math.abs(random.noise2D(u, v) * 0.05);
        const rotation = random.noise2D(u, v);
        points.push({
          color: random.pick(pallete),
          position: [u, v],
          radius,
          rotation,
        });
      }
    }
    return points;
  };

  // random.setSeed(512);
  const points = createGrid().filter(() => random.value() > 0.1);
  const margin = 400;

  return ({ context, width, height }) => {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    points.forEach((data) => {
      const { position, radius, color, rotation } = data;
      const [u, v] = position;
      // const x = u * width;
      // const y = v * height;
      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);

      // context.beginPath();
      // context.arc(x, y, radius * width, Math.PI * 2, false);
      // context.fillStyle = color;
      // context.fill();

      context.save();

      context.fillStyle = color;
      context.font = `${radius * width}px 'Helvetica'`;
      context.translate(x, y); // меняет опорную точку канваса
      context.rotate(rotation);
      context.fillText("#", 0, 0); // 0, 0 потому что мы сделали translate

      context.restore();
    });
  };
};

canvasSketch(sketch, settings);
