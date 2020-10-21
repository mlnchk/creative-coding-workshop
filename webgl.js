global.THREE = require("three");
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
const palettes = require("nice-color-palettes");

const settings = {
  animate: true,
  context: "webgl",
  attributes: {
    antialias: true,
  },
};

const sketch = ({ context }) => {
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas,
  });

  renderer.setClearColor("hsl(0, 0%, 95%)", 1);

  const camera = new THREE.OrthographicCamera();

  const scene = new THREE.Scene();
  const geometry = new THREE.BoxGeometry(1, 1, 1);

  const palette = random.pick(palettes);

  for (let i = 0; i < 40; i++) {
    const material = new THREE.MeshStandardMaterial({
      color: random.pick(palette),
    });
    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(
      random.range(-1, 1),
      random.range(-1, 1),
      random.range(-1, 1)
    );
    mesh.scale.set(
      random.range(-1, 1),
      random.range(-1, 1),
      random.range(-1, 1)
    );
    mesh.scale.multiplyScalar(0.5);
    scene.add(mesh);
  }

  scene.add(new THREE.AmbientLight("hsl(0, 0%, 20%)"));

  const light = new THREE.DirectionalLight("white", 1);
  light.position.set(0, 0, 4);
  scene.add(light);

  return {
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      const aspect = viewportWidth / viewportHeight;
      const zoom = 1.5;

      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);

      camera.left = -zoom * aspect;
      camera.right = zoom * aspect;
      camera.top = zoom;
      camera.bottom = -zoom;
      camera.near = -100;
      camera.far = 100;

      camera.position.set(zoom, zoom, zoom);
      camera.lookAt(new THREE.Vector3());
      camera.updateProjectionMatrix();
    },
    render({ time }) {
      // mesh.rotation.y = time * ((10 * Math.PI) / 100);
      renderer.render(scene, camera);
    },
    unload() {
      renderer.dispose();
    },
  };
};

canvasSketch(sketch, settings);
