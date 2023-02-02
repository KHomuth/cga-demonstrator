import * as THREE from 'three';
import {GLTFLoader} from 'gltfloader';

export default class WindmillFromFile extends THREE.Group {

  constructor() {
    super();
    this.gltfLoader = new GLTFLoader();
    this.loadingDone = false;
    this.animationMixer = null;
    this.animations = new Map();
    this.state = {
      turnarround: false,
      powerOn: false,
      soundPlaying: false,
      soundLoud: false,
      fast: false
    };
    this.load(this);
  }

  load(thisWindmill) {

    this.gltfLoader.load('src/models/windmillFromBlender.gltf', function (gltf) {

      gltf.scene.traverse(function (child) {
        if (child.isMesh) {
          child.parentWindmill = thisWindmill;
        }
        if (child.name === 'Mesh' || child.name === 'Mesh_1' || child.name === 'topCenterTube' || child.name === 'base' || child.name === 'blades') {
          child.castShadow = true;
        }
      });

      thisWindmill.animationMixer = new THREE.AnimationMixer(gltf.scene);
      for (let i = 0; i < gltf.animations.length; i++) {
        let action = thisWindmill.animationMixer.clipAction(gltf.animations[i]);
        if (gltf.animations[i].name == 'turnarround' || gltf.animations[i].name == 'turnarround_fast') {
          action.setLoop(THREE.LoopRepeat);
        } else {
          action.setLoop(THREE.LoopOnce);
          action.clampWhenFinished = true;
        }

        thisWindmill.animations.set(gltf.animations[i].name, action);
        console.log(gltf.animations[i].name);
      }
      gltf.scene.rotation.set(0, THREE.MathUtils.degToRad(180), 0);
      gltf.scene.position.set(0, 0, 0);// Shift windmill down half its size
      thisWindmill.add(gltf.scene);
      thisWindmill.loadingDone = true;
    });
  }
  addPhysics() {
    if (this.loadingDone === false) {
      window.setTimeout(this.addPhysics.bind(this), 100);
    } else {
      window.physics.add3Cylinder(this, 3, 10, 10, 34, 12, 0, 80, 0);
    }
  }

}