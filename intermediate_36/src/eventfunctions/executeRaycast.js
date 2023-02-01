import * as THREE from 'three';

window.raycaster = new THREE.Raycaster();

document.speaker_noise_2 = document.createElement('audio');
document.speaker_noise_2.src = 'src/sounds/Naughty-By-Nature-Hip-Hop-Hooray.mp3';
document.speaker_noise_2.loop = true;

export function executeRaycast() {

  window.raycaster.setFromCamera(window.mousePosition, window.camera);
  let intersects = window.raycaster.intersectObject(window.scene, true);

  if (intersects.length > 0) {
    let firstHit = intersects[0].object;

    if (firstHit.name === 'powerKnob' || firstHit.name === 'speedKnob' || firstHit.name === 'soundKnob') {
      if (firstHit.children.length > 0) {
        firstHit.linearAnimation.toggleEndPosition();
      } else {
        firstHit.parent.linearAnimation.toggleEndPosition();
      }
    } else if (firstHit.name === 'speedKnob') {
      if (firstHit.children.length > 0) {
        firstHit.animateWheel(6000, this.tweenAnimation[0], 'stop');
        firstHit.animateWheel(2000, this.tweenAnimation[0], 'start');
      } else {
        firstHit.animateWheel(2000, this.tweenAnimation[0], 'stop');
        firstHit.animateWheel(6000, this.tweenAnimation[0], 'start');
      }
     }

    //Blender Animations
    if (firstHit.name === 'Button_1') {
      firstHit.parentWindmill.state.powerOn = !firstHit.parentWindmill.state.powerOn;
      firstHit.parentWindmill.state.turnarround = !firstHit.parentWindmill.state.turnarround;

      if (firstHit.parentWindmill.state.powerOn && firstHit.parentWindmill.state.turnarround) {
        firstHit.parentWindmill.animations.get('Button_1_off').stop();
        firstHit.parentWindmill.animations.get('Button_1_on').play();
        firstHit.parentWindmill.animations.get('turnarround').play();

        document.speaker_noise_2.play();
        document.speaker_noise_2.volume = 0.2;
      } else {
        firstHit.parentWindmill.animations.get('Button_1_on').stop();
        firstHit.parentWindmill.animations.get('Button_1_off').play();
        firstHit.parentWindmill.animations.get('turnarround').stop();
        firstHit.parentWindmill.animations.get('turnarround_fast').stop();

        document.speaker_noise_2.pause();
      }
    } else if (firstHit.name === 'Button_2') {
      firstHit.parentWindmill.state.fast = !firstHit.parentWindmill.state.fast;

      if (firstHit.parentWindmill.state.fast && firstHit.parentWindmill.state.powerOn) {
        firstHit.parentWindmill.animations.get('Button_2_off').stop();
        firstHit.parentWindmill.animations.get('Button_2_on').play();
        firstHit.parentWindmill.animations.get('turnarround').stop();
        firstHit.parentWindmill.animations.get('turnarround_fast').play();
      } else if (firstHit.parentWindmill.state.fast && !firstHit.parentWindmill.state.powerOn) {
        firstHit.parentWindmill.animations.get('Button_2_on').play();
        firstHit.parentWindmill.animations.get('Button_2_off').stop();
        firstHit.parentWindmill.animations.get('turnarround_fast').stop();
      } else if (!firstHit.parentWindmill.state.fast && firstHit.parentWindmill.state.powerOn) {
        firstHit.parentWindmill.animations.get('Button_2_on').stop();
        firstHit.parentWindmill.animations.get('Button_2_off').play();
        firstHit.parentWindmill.animations.get('turnarround').play();
        firstHit.parentWindmill.animations.get('turnarround_fast').stop();
      } else {
        firstHit.parentWindmill.animations.get('Button_2_on').stop();
        firstHit.parentWindmill.animations.get('Button_2_off').play();
        firstHit.parentWindmill.animations.get('turnarround').stop();
        firstHit.parentWindmill.animations.get('turnarround_fast').stop();
      }
    } else if (firstHit.name === 'Button_3') {
      firstHit.parentWindmill.state.sound = !firstHit.parentWindmill.state.sound;

      if (firstHit.parentWindmill.state.sound && firstHit.parentWindmill.state.powerOn) {
        document.speaker_noise_2.volume = 1.0;
        firstHit.parentWindmill.animations.get('Button_3_on').play();
        firstHit.parentWindmill.animations.get('Button_3_off').stop();

      } else {
        document.speaker_noise_2.volume = .2;

        firstHit.parentWindmill.animations.get('Button_3_on').stop();
        firstHit.parentWindmill.animations.get('Button_3_off').play();
      }
    }
  }
}