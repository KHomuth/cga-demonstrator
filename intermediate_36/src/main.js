//External libraries
import * as THREE from '../../../lib/three.js-r145/build/three.module.js';
import * as CONTROLS from '../../../lib/three.js-r145/examples/jsm/controls/OrbitControls.js';
import * as DAT from '../../../lib/dat.gui-0.7.9/build/dat.gui.module.js';
import * as TWEEN from 'tween';

//Own modules
import Windmill from './objects/Windmill.js';
import WindmillFromFile from './objects/WindmillFromFile.js';
import Floor from './objects/Floor.js';
import SkyBox from './objects/SkyBox.js';
import Physics from './physics/Physics.js';
import Trees from './objects/Trees.js';

//Event function
import {updateAspectRatio} from './eventfunctions/updateAspectRatio.js';
import {calculateMousePosition} from './eventfunctions/calculateMousePosition.js';
import {executeRaycast} from './eventfunctions/executeRaycast.js';
import {keyDownAction, keyUpAction} from './eventfunctions/executeKeyAction.js';

function main() {

  window.scene = new THREE.Scene();
  //window.scene.add(new THREE.AxesHelper(50));

  window.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000);

  window.camera.position.set(-100, 150, 300);
  window.camera.lookAt(0, 0, 0);

  window.renderer = new THREE.WebGLRenderer({antialias: true});
  window.renderer.setSize(window.innerWidth, window.innerHeight);
  window.renderer.setClearColor(new THREE.Color(0xffffff));
  window.renderer.shadowMap.enabled = true;

  window.physics = new Physics(false);
  window.physics.setup(0, -200, 0, 1 / 120, true);

  window.audioListener = new THREE.AudioListener();
  window.camera.add(window.audioListener);

  document.getElementById('3d_content').appendChild(window.renderer.domElement);

  const windmill = new Windmill(); //einbinden und verwenden der Windmill.js
  windmill.position.set(-30, 0, 0);
  windmill.addPhysics();
  window.scene.add(windmill);

  const windmillFromFile = new WindmillFromFile(); //einbinden und verwenden der Blender Windmill datei
  windmillFromFile.position.set(30, 0, 0);
  windmillFromFile.scale.set(6.9, 6.9, 6.9);
  windmillFromFile.addPhysics();
  window.scene.add(windmillFromFile);

  /*const trees = new Trees(); //einbinden und verwenden der Windmill.js
  trees.position.set(-90, 0, -90);
  trees.scale.set(1.2, 1.2, 1.2);
  window.scene.add(trees);

  const trees2 = trees.clone(); //einbinden und verwenden der Windmill.js
  trees2.position.set(-90, 0, 90);
  trees2.rotation.set(0, THREE.MathUtils.degToRad(90), 0);
  window.scene.add(trees2);

  const trees3 = trees.clone(); //einbinden und verwenden der Windmill.js
  trees3.position.set(90, 0, -90);
  trees3.rotation.set(0, THREE.MathUtils.degToRad(90), 0);
  window.scene.add(trees3);

  const trees4 = trees.clone(); //einbinden und verwenden der Windmill.js
  trees4.position.set(90, 0, 90);
  trees4.rotation.set(0, THREE.MathUtils.degToRad(90), 0);
  window.scene.add(trees4);*/

  const floor = new Floor();
  floor.position.set(0, 0, 0);
  floor.scale.set(2.5, 2, 2.5);
  window.scene.add(floor);

  const ambientLight = new THREE.AmbientLight(0xffffff);
  ambientLight.intensity = 0.5;
  window.scene.add(ambientLight);

  const spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(100, 100, 100);
  spotLight.intensity = 1;
  spotLight.target = floor;
  spotLight.angle = THREE.MathUtils.degToRad(30);
  spotLight.penumbra = 1.0;
  spotLight.castShadow = true;
  spotLight.shadow.mapSize.set(2048, 2048);
  spotLight.shadow.camera.aspect = 1;
  spotLight.shadow.camera.near = 10;
  spotLight.shadow.camera.far = 500;
  window.scene.add(spotLight);

  const skybox = new SkyBox();
  skybox.position.set(0, 120, 0);
  window.scene.add(skybox);

  const gui = new DAT.GUI();
  gui.add(spotLight.position, 'x', 0, 200);
  gui.add(spotLight.position, 'y', 0, 200);
  gui.add(spotLight.position, 'z', 0, 200);

  const orbitControls = new CONTROLS.OrbitControls(window.camera, window.renderer.domElement);
  orbitControls.target = new THREE.Vector3(0, 0, 0);      // ersetzt window.camera.lookAt(0, 0, 0)
  orbitControls.update();                                 // Aktivieren/Übernehmen des Targets


  const clock = new THREE.Clock();

  function mainLoop() {

    const delta = clock.getDelta();

    windmill.animations.forEach(function (animation) {
      animation.update(delta);
    });

    TWEEN.update();

    if(windmillFromFile.animationMixer !== null) {
      windmillFromFile.animationMixer.update(delta);
    }

    window.physics.update(delta);

    window.renderer.render(window.scene, window.camera);
    requestAnimationFrame(mainLoop);
  }

  mainLoop();
}

window.onload = main;
window.onresize = updateAspectRatio;
window.onmousemove = calculateMousePosition;
window.onclick = executeRaycast;
window.onkeydown = keyDownAction;
window.onkeyup = keyUpAction;