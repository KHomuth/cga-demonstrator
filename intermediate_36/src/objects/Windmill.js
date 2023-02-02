import * as THREE from 'three';
import CSG from '../../../../lib/three-CSGMesh/three-csg.js';
import * as TWEEN from 'tween';

import {Animation, AnimationType, AnimationAxis} from '../animation/Animation.js';

export default class Windmill extends THREE.Group {

  constructor() {
    super();
    this.loadingDone = false;
    this.animations = [];
    this.tweenAnimation = [];
    this.speed = 0;
    this.addParts();
  }

  addParts() {

    const corpusMaterial = new THREE.MeshPhongMaterial({
      color: 0xD3D3D3,
      flatShading: true,
      specular: 0x111111,
      shininess: 100,
      //bumpMap: new THREE.TextureLoader().load('src/images/holderFrame.png'),
      //bumpScale: 1.0
    });

    const wheelMaterial = new THREE.MeshPhongMaterial({
      color: 0xD3D3D3,
      flatShading: true,
      specular: 0x111111,
      shininess: 100
    });

    const panelMaterial = new THREE.MeshPhongMaterial({color: 0x888888, flatShading: true});
    const panelMaterialTextured = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      flatShading: true,
      map: new THREE.TextureLoader().load('src/images/panelTexture.png')
    });
    //const sound = new THREE.PositionalAudio(window.audioListener);
    document.speaker_noise = document.createElement('audio');
    document.speaker_noise.src = 'src/sounds/windpower.mp3';
    document.speaker_noise.loop = true;

    const metalMaterial = new THREE.MeshStandardMaterial({
      color: 0xe7e7e7,
      flatShading: false,
      roughness: 0.0,
      metalness: 0.3
    });

    const envMap = new THREE.TextureLoader()
        .load('../../lib/three.js-r145/examples/textures/2294472375_24a3b8ef46_o.jpg');
    envMap.mapping = THREE.EquirectangularReflectionMapping;
    envMap.encoding = THREE.sRGBEncoding;
    metalMaterial.envMap = envMap;
    metalMaterial.envMapIntensity = 2.0;


    // Corpus
    // ------
    /*const positions = [
      0.5, 95, 0.5,    // 0
      -0.5, 95, 0.5,   // 1
      -1.5, 0, 1.5,    // 2
      1.5, 0, 1.5,     // 3
      0.5, 95, -0.5,   // 4
      -0.5, 95, -0.5,  // 5
      -1.5, 0, -1.5,   // 6
      1.5, 0, -1.5     // 7
    ];


    const indices = [
      0, 1, 2,    // body front 1/2
      0, 2, 3,    // body front 2/2
      1, 5, 6,    // body left 1/2
      1, 6, 2,    // body left 2/2
      4, 0, 3,    // body right 1/2
      4, 3, 7,    // body right 2/2
      4, 5, 1,    // body top 1/2
      4, 1, 0,    // body top 2/2
      3, 2, 6,    // body bottom 1/2
      3, 6, 7,    // body bottom 2/2
      5, 4, 7,    // body back 1/2
      5, 7, 6     // body back 2/2
    ];

    const corpusGeometry = new THREE.BufferGeometry();
    corpusGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
    corpusGeometry.setIndex(indices);
    corpusGeometry.computeVertexNormals();
    const corpus = new THREE.Mesh(corpusGeometry, corpusMaterial);
    //corpus.position.set(0, -75, 0);
    corpus.castShadow = true;
    this.add(corpus);*/

    const corpusCylinder = new THREE.CylinderGeometry(0.5, 2, 95, 32);
    const corpus = new THREE.Mesh(corpusCylinder, corpusMaterial);
    corpus.position.set(0, 48, 0);
    corpus.castShadow = true;
    this.add(corpus);


    // Panel
    // -----
    const panelGeometry = new THREE.BoxGeometry(7.5, 16, 1);
    const panel = new THREE.Mesh(panelGeometry,
        [panelMaterial, panelMaterial, panelMaterial, panelMaterial, panelMaterialTextured, panelMaterial]);
    panel.position.set(0, 14.5, 2);
    panel.castShadow = true;
    this.add(panel);

    // Power Knob
    // ----------
    const knobGeometry = new THREE.CylinderGeometry(1.6, 1.6, 1, 32);
    const knobGripGeometry = new THREE.BoxGeometry(0.35, 1, 2).translate(0, 1, 0);
    const powerKnob = new THREE.Mesh(knobGeometry, metalMaterial).add(new THREE.Mesh(knobGripGeometry, metalMaterial));
    powerKnob.rotation.set(THREE.MathUtils.degToRad(90), 0, 0);
    powerKnob.position.set(0, 4.5, 0.5);
    powerKnob.name = 'powerKnob';
    powerKnob.children[0].name = 'powerKnob';
    panel.add(powerKnob);

    // Power Knob Animation
    // --------------------
    const powerKnobAnimation = new Animation(powerKnob, AnimationType.ROTATION, AnimationAxis.Y);
    powerKnobAnimation.setAmount(THREE.MathUtils.degToRad(-90));
    powerKnobAnimation.setSpeed(THREE.MathUtils.degToRad(360));
    powerKnob.linearAnimation = powerKnobAnimation;
    powerKnobAnimation.onComplete(this.updateFunctionalState.bind(this));
    this.animations.push(powerKnobAnimation);

    // Speed Knob
    // -----------
    const speedKnob = powerKnob.clone();
    speedKnob.position.set(0, 0, 0.5);
    speedKnob.name = 'speedKnob';
    speedKnob.children[0].name = 'speedKnob';
    panel.add(speedKnob);

    // Speed Knob Animation
    // --------------------
    const speedKnobAnimation = new Animation(speedKnob, AnimationType.ROTATION, AnimationAxis.Y);
    speedKnobAnimation.setAmount(THREE.MathUtils.degToRad(-90));
    speedKnobAnimation.setSpeed(THREE.MathUtils.degToRad(360));
    speedKnob.linearAnimation = speedKnobAnimation;
    speedKnobAnimation.onComplete(this.updateFunctionalState.bind(this));
    this.animations.push(speedKnobAnimation);

    // Sound Knob
    // -----------
    const soundKnob = powerKnob.clone();
    soundKnob.position.set(0, -4.5, 0.5);
    soundKnob.name = 'soundKnob';
    soundKnob.children[0].name = 'soundKnob';
    panel.add(soundKnob);

    // Sound Knob Animation
    // --------------------
    const soundKnobAnimation = new Animation(soundKnob, AnimationType.ROTATION, AnimationAxis.Y);
    soundKnobAnimation.setAmount(THREE.MathUtils.degToRad(-90));
    soundKnobAnimation.setSpeed(THREE.MathUtils.degToRad(360));
    soundKnob.linearAnimation = soundKnobAnimation;
    soundKnobAnimation.onComplete(this.updateFunctionalState.bind(this));
    this.animations.push(soundKnobAnimation);


    // Wheel Blades
    // ------------
    const wheel1Geometry = new THREE.TorusKnotGeometry(20, 0.75, 128, 3, 2, 2);
    const wheel1 = new THREE.Mesh(wheel1Geometry, wheelMaterial);

    let box1 = new THREE.Mesh(new THREE.BoxGeometry(35, 60, 60).scale(1.1, 1.1, 1.1).translate(14, 0, 0));

    const wheelCSG = CSG.fromMesh(wheel1);
    const box1CSG = CSG.fromMesh(box1);

    const wheelBlade1 = CSG.toMesh(wheelCSG.subtract(box1CSG), wheel1.matrix, wheel1.material);
    wheelBlade1.position.set(0, 32.5, 0);

    const wheelBlade2 = wheelBlade1.clone();
    wheelBlade2.rotation.set(THREE.MathUtils.degToRad(0), 2, 0);

    const wheelBlade3 = wheelBlade1.clone();
    wheelBlade3.rotation.set(THREE.MathUtils.degToRad(0), 4, 0);

    const wheelGroup = new THREE.Group();
    wheelGroup.add(wheelBlade1).add(wheelBlade2).add(wheelBlade3);
    wheelGroup.children[0].name = 'wheel';
    wheelGroup.children[1].name = 'wheel';
    wheelGroup.children[2].name = 'wheel';
    corpus.add(wheelGroup);


    //Wheel Holder
    //-------------
    const wheelHolderGeometry1 = new THREE.Mesh(new THREE.BoxGeometry(10.5, 0.2, 1.7).translate(6, 0, 0), wheelMaterial);
    wheelHolderGeometry1.position.set(0, 47.5, 0);
    wheelHolderGeometry1.rotation.set(THREE.MathUtils.degToRad(0), -0.1, 0);
    wheelHolderGeometry1.castShadow = true;

    const wheelHolderGeometry2 = new THREE.Mesh(new THREE.BoxGeometry(10.5, 0.2, 1.7).translate(6, 0, 0), wheelMaterial);
    wheelHolderGeometry2.position.set(0, 47.5, 0);
    wheelHolderGeometry2.rotation.set(THREE.MathUtils.degToRad(0), 1.9, 0);
    wheelHolderGeometry2.castShadow = true;

    const wheelHolderGeometry3 = new THREE.Mesh(new THREE.BoxGeometry(10.5, 0.2, 1.7).translate(6, 0, 0), wheelMaterial);
    wheelHolderGeometry3.position.set(0, 47.5, 0);
    wheelHolderGeometry3.rotation.set(THREE.MathUtils.degToRad(0), 4.1, 0);
    wheelHolderGeometry3.castShadow = true;

    let wheelHolderCenter1 = new THREE.Mesh(new THREE.CylinderGeometry(1, 1.2, 1, 30), wheelMaterial);
    wheelHolderCenter1.position.set(0, 47.5, 0);
    wheelHolderCenter1.castShadow = true;

    const wheelHolderGeometry4 = new THREE.Mesh(new THREE.BoxGeometry(10.5, 0.2, 1.7).translate(6, 0, 0), wheelMaterial);
    wheelHolderGeometry4.position.set(0, 18, 0);
    wheelHolderGeometry4.rotation.set(THREE.MathUtils.degToRad(0), -0.1, 0);
    wheelHolderGeometry4.castShadow = true;

    const wheelHolderGeometry5 = new THREE.Mesh(new THREE.BoxGeometry(10.5, 0.2, 1.7).translate(6, 0, 0), wheelMaterial);
    wheelHolderGeometry5.position.set(0, 18, 0);
    wheelHolderGeometry5.rotation.set(THREE.MathUtils.degToRad(0), 2.1, 0);
    wheelHolderGeometry5.castShadow = true;

    const wheelHolderGeometry6 = new THREE.Mesh(new THREE.BoxGeometry(10.5, 0.2, 1.7).translate(6, 0, 0), wheelMaterial);
    wheelHolderGeometry6.position.set(0, 18, 0);
    wheelHolderGeometry6.rotation.set(THREE.MathUtils.degToRad(0), 4.1, 0);
    wheelHolderGeometry6.castShadow = true;

    let wheelHolderCenter2 = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.7, 3, 30), wheelMaterial);
    wheelHolderCenter2.position.set(0, 18, 0);
    wheelHolderCenter2.castShadow = true;

    let wheelFoot = new THREE.Mesh(new THREE.CylinderGeometry(8.5, 8.5, 0.5, 40), wheelMaterial);
    wheelFoot.position.set(0, -47.5, 0);
    wheelFoot.castShadow = true;
    corpus.add(wheelFoot);

    wheelGroup.add(wheelHolderGeometry1);
    wheelGroup.add(wheelHolderGeometry2);
    wheelGroup.add(wheelHolderGeometry3);
    wheelGroup.add(wheelHolderCenter1);
    wheelGroup.add(wheelHolderGeometry4);
    wheelGroup.add(wheelHolderGeometry5);
    wheelGroup.add(wheelHolderGeometry6);
    wheelGroup.add(wheelHolderCenter2);

    for (let i = 3; i < 11; i++) {
      wheelGroup.children[i].name = 'wheel';
    }
    corpus.add(wheelGroup);


    //Wheel Animation
    //---------------
    const tweenAnimationWheel = new TWEEN.Tween(wheelGroup.rotation).to(new THREE.Vector3(
            wheelGroup.rotation.x,
            wheelGroup.rotation.y - THREE.MathUtils.degToRad(-360),
            wheelGroup.rotation.z),
        0).repeat(Infinity).onComplete(this.updateFunctionalState.bind(this));

    this.tweenAnimation.push(tweenAnimationWheel);
  }

  animateWheel(speed, object, animationState){
    object._duration = speed;
    if(animationState == 'start') {
      object.start();
    } else if (animationState == 'stop') {
      object.stop();
    }
    console.log(object._duration);
  }


  updateFunctionalState(){

    const powerOn = THREE.MathUtils.radToDeg(this.children[1].children[0].rotation.y) === -90;
    const speedHigh = THREE.MathUtils.radToDeg(this.children[1].children[1].rotation.y) === -90;
    const soundHigh = THREE.MathUtils.radToDeg(this.children[1].children[2].rotation.y) === -90;

    if (powerOn) {
      document.speaker_noise.play();
      document.speaker_noise.volume = 0.2;
      this.speed = 6000;
      this.animateWheel(this.speed, this.tweenAnimation[0], 'start');

      if (speedHigh) {
        console.log('Windrad dreht sich SCHNELL');
        this.speed = 2000;
        this.animateWheel(2000, this.tweenAnimation[0], 'start');

        if(soundHigh) {
          console.log('Windmill is high volume');
          document.speaker_noise.pause();
          document.speaker_noise.play();
          document.speaker_noise.volume = 1.0;
        } else {
          console.log('Windmill is low volume');
          document.speaker_noise.pause();
          document.speaker_noise.play();
          document.speaker_noise.volume = 0.2;
        }
      } else {
        console.log('Windrad dreht sich langsam');
        if(soundHigh) {
          console.log('Windmill is high volume');
          document.speaker_noise.pause();
          document.speaker_noise.play();
          document.speaker_noise.volume = 1.0;
        } else {
          console.log('Windmill is low volume');
          document.speaker_noise.pause();
          document.speaker_noise.play();
          document.speaker_noise.volume = 0.2;
        }
      }
    } else {
      console.log('nothing happens... no wind, no fun!');
      this.animateWheel(0, this.tweenAnimation[0], 'stop');
      document.speaker_noise.pause();
    }
  }


  addPhysics() {
    /*
    const positions = [
      [0.5, 95, 0.5],   // 0
      [-0.5, 95, 0.5],  // 1
      [-1.5, 0, 1.5],   // 2
      [1.5, 0, 1.5],    // 3
      [0.5, 95, -0.5],  // 4
      [-0.5, 95, -0.5], // 5
      [-1.5, 0, -1.5],  // 6
      [1.5, 0, -1.5]    // 7
    ];
    const indices = [
      [0, 1, 2, 3],  // front
      [1, 5, 6, 2],  // left
      [4, 0, 3, 7],  // right
      [4, 5, 1, 0],  // top
      [3, 2, 6, 7],  // bottom
      [5, 4, 7, 6]   // back
    ];
    window.physics.addConvexPolyhedron(this, 3, positions, indices, true);
    */
    window.physics.add3Cylinder(this, 3, 12, 12, 34, 12, 0, 80, 0);
  }
}
