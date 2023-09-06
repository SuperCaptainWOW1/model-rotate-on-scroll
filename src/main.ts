import * as THREE from "three";

const maxRotation = Math.PI / 2;

function startRender() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#4098D5");
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.01,
    1000
  );

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.querySelector("#app")?.appendChild(renderer.domElement);

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
  cube.position.set(0, 0, -5);

  const targetRotation = new THREE.Quaternion();

  function animate() {
    requestAnimationFrame(animate);

    cube.quaternion.slerp(targetRotation, 0.02);

    renderer.render(scene, camera);
  }
  animate();

  const slider = document.querySelector(".slider");

  if (slider) {
    slider.addEventListener("scroll", () => {
      const maxScrollLeft = slider.scrollWidth - slider.clientWidth;
      const scrollLeftPercent = slider.scrollLeft / maxScrollLeft;

      const eulerRotation = new THREE.Euler(
        0,
        scrollLeftPercent * maxRotation,
        0
      );
      targetRotation.setFromEuler(eulerRotation);
    });
  }
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

startRender();
