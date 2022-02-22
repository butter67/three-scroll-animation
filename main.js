import "./style.css";
import * as THREE from "three";
import GUI from "lil-gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

//canvas
const canvas = document.querySelector("#webgl");

//scene
const scene = new THREE.Scene();

//size
const sizes = {
  width: innerWidth,
  height: innerHeight,
};

//bg texture
const textureLoader = new THREE.TextureLoader();
const bgTexture = textureLoader.load("/img/scene-bg.jpg");
scene.background = bgTexture;

//Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
);
camera.position.set(0, 0, +30);

//renderer
const renderer = new THREE.WebGL1Renderer({
  canvas: canvas,
  // alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);

//Object
const stone = new THREE.Mesh(
  new THREE.IcosahedronGeometry(6),
  new THREE.MeshPhongMaterial({
    color: 0x88bfbf,
    side: THREE.DoubleSide,
  })
);
scene.add(stone);
stone.position.set(6, -2, -5);
stone.rotation.set(1, 1, 0);

const Tous = new THREE.Mesh(
  new THREE.TorusGeometry(10, 3, 16, 100),
  new THREE.MeshStandardMaterial({
    color: 0xff6347,
    wireframe: false,
  })
);
scene.add(Tous);
Tous.position.set(-4, -5, 50);

//Light
const Plight = new THREE.PointLight(0xffffff);
Plight.position.set(20, 20, 20);
scene.add(Plight);

//Helper
const PlightHelper = new THREE.PointLightHelper(Plight, 10, "pink");
scene.add(PlightHelper);

//Orbit con
const controls = new OrbitControls(camera, renderer.domElement);

//Scroll animation
const animationScripts = [];

animationScripts.push({
  start: 0,
  end: 40,
  function() {
    camera.lookAt(stone.position);
    camera.position.set(0, 1, 30);
    stone.position.z = lerp(-5, 10, scalePercent(0, 40));
    Tous.position.z = lerp(50, -20, scalePercent(0, 40));
  },
});

animationScripts.push({
  start: 40,
  end: 60,
  function() {
    camera.lookAt(stone.position);
    camera.position.set(0, 0, 30);
    stone.rotation.z = lerp(1, Math.PI, scalePercent(40, 60));
  },
});

animationScripts.push({
  start: 60,
  end: 80,
  function() {
    camera.lookAt(stone.position);
    camera.position.x = lerp(0, -15, scalePercent(60, 80));
    camera.position.y = lerp(0, -15, scalePercent(60, 80));
    camera.position.z = lerp(30, 55, scalePercent(60, 80));
  },
});

animationScripts.push({
  start: 80,
  end: 101,
  function() {
    camera.lookAt(stone.position);
    stone.rotation.x += 0.01;
    stone.rotation.y += 0.01;
  },
});

//Senkei hokan(smooth)
function lerp(x, y, a) {
  return (1 - a) * x + a * y;
}

function scalePercent(start, end) {
  return (scrollPercent - start) / (end - start);
}

//Start animation
function playScrollAnimation() {
  animationScripts.forEach((animation) => {
    if (scrollPercent >= animation.start && scrollPercent <= animation.end)
      animation.function();
  });
}

//Scroll
let scrollPercent = 0;
document.body.onscroll = () => {
  scrollPercent =
    (document.documentElement.scrollTop /
      (document.documentElement.scrollHeight -
        document.documentElement.clientHeight)) *
    100;
  console.log(scrollPercent);
};

//animation
const tick = () => {
  window.requestAnimationFrame(tick);
  playScrollAnimation();

  // stone.rotation.x += 0.002;
  // stone.rotation.y += 0.004;

  Tous.rotation.x += 0.01;
  Tous.rotation.y += 0.005;

  renderer.render(scene, camera);
};
tick();

//Re-size
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(window.devicePixelRatio);
});
