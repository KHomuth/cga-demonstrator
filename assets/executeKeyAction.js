window.spaceDown = false;

export function keyDownAction(event) {
  switch (event.keyCode) {
    case 32:
      if (!window.spaceDown) {
        window.spaceDown = true;
        console.log('Spacebar pressed');
      }
      break;
  }
}

export function keyUpAction(event) {
  switch (event.keyCode) {
    case 32:
      window.spaceDown = false;
      break;
  }
}