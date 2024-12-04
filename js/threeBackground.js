var camera, clock, scene, renderer;
var geometry, position, plane;

const textureURL = "https://commonzenmedia.com/images/dots.png";

function init() {
  scene = new THREE.Scene();

  clock = new THREE.Clock();

  //Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xffffff);

  //Camera
  camera = new THREE.PerspectiveCamera(
    69,
    window.innerWidth / window.innerHeight,
    1,
    20000
  );
  camera.position.set(-20, 100, -200);
  camera.rotateY(-Math.PI);

  //Plane
  geometry = new THREE.PlaneBufferGeometry(2000, 2000, 1000, 1000);
  geometry.rotateX(-Math.PI / 2);
  position = geometry.attributes.position;
  position.dynamic = true;

  //Texture
  var texture = new THREE.TextureLoader().load(textureURL, function () {
    // Show the canvas once the texture is loaded
    document.body.appendChild(renderer.domElement);
  });
  var material = new THREE.MeshBasicMaterial({ color: 0xffffff });
  material.map = texture;
  plane = new THREE.Mesh(geometry, material);
  scene.add(plane);

  //Light
  var light = new THREE.PointLight(0xfffff, 1, 100);
  light.position.set(50, 50, 50);
  scene.add(light);

  //Resizing
  window.addEventListener("resize", onWindowResize, false);
}

function animate() {
  requestAnimationFrame(animate);

  render();
}

let waveSpeed = 0.6;

let waveHeightMax = 60;

let waveHeight = 50;

let waveHeightMin = 40;

let waveHeightChangeSpeed = 0.2;

function randomizeWaveHeight() {
  Math.random() > 0.5
    ? (waveHeight += waveHeightChangeSpeed)
    : (waveHeight -= waveHeightChangeSpeed);
  if (waveHeight > waveHeightMax) waveHeight = waveHeightMax;
  if (waveHeight < waveHeightMin) waveHeight = waveHeightMin;
}

function moveTheWave() {
  var time = clock.getElapsedTime() * (200000 * waveSpeed);
  for (var i = 0; i < position.count; i++) {
    var y = 50 * Math.sin((time + i) * (1 / 200000) * 2);
    position.setY(i, y);
  }
  position.needsUpdate = true;
}

function render() {
  randomizeWaveHeight();
  moveTheWave();

  camera.lookAt(new THREE.Vector3(600, 0, 100));
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

init();
animate();
