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

  const renderer = new THREE.WebGLRenderer({ antialias: true });
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

  const slider: HTMLDivElement | null = document.querySelector(".slider");
  let currentSliderItemId = 0;

  if (slider !== null) {
    slider.addEventListener("wheel", (e) => {
      e.preventDefault();
    });

    slider.addEventListener("touchmove", (e) => {
      e.preventDefault();
    });

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

    slider.addEventListener("click", (e) => {
      e.preventDefault();
      const rect = slider.getBoundingClientRect();

      const relativeX = e.clientX - rect.left;

      const sliderItems = document.querySelectorAll(".slider-item");
      if (!sliderItems) return;

      if (relativeX < rect.width / 2 && currentSliderItemId - 1 > -1) {
        currentSliderItemId -= 1;
      } else if (
        relativeX > rect.width / 2 &&
        currentSliderItemId + 1 < sliderItems.length &&
        slider.scrollLeft !== slider.scrollWidth - slider.clientWidth
      ) {
        currentSliderItemId += 1;
      }

      sliderItems[currentSliderItemId].scrollIntoView({
        inline: "start",
        behavior: "smooth",
      });
    });
  }
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

startRender();
