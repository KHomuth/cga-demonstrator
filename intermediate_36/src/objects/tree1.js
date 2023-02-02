import * as THREE from 'three';
import {GLTFLoader} from 'gltfloader';

export default class Tree1 extends THREE.Group {

  constructor() {
    super();
    this.gltfLoader = new GLTFLoader();
    this.loadingDone = false;
    this.load(this);
  }

  load(thisPlant) {

    this.gltfLoader.load('src/models/tree1.gltf', function (gltf) {

      gltf.scene.traverse(function (child) {

        if (child.isMesh) {
          child.receiveShadow = true;
          child.castShadow = true;
        }
      });
      gltf.scene.position.set(0, 0, 0); // Shift plant down half its size
      thisPlant.add(gltf.scene);
      thisPlant.loadingDone = true;
    });
  }
  addPhysics() {
    if (this.loadingDone === false) {
      window.setTimeout(this.addPhysics.bind(this), 100);
    } else {
      window.physics.addTreeCylinder(this, 6, 50, 7, 90, 12, 0, 45, 0);
    }
  }
}