import * as THREE from 'three';

export default class SkyBox extends THREE.Group {

  constructor() {
    super();

    const materialArray = createMaterialArray('wood');
    
    const skyboxGeometry = new THREE.BoxGeometry(500, 250, 500);
    
    const skybox = new THREE.Mesh(skyboxGeometry, materialArray);
    
    this.add(skybox);

    function createPathStrings(filename) {
    
        const basePath = "./src/images/";
        
        const baseFilename = basePath + filename;
        
        const fileType = ".jpg";
        
        const sides = ["ft", "bk", "up", "dn", "rt", "lf"];
        
        const pathStings = sides.map(side => {
        
            return baseFilename + "_" + side + fileType;
        
        });
        
        
        return pathStings;
        
      }
    
      function createMaterialArray(filename) {
    
        const skyboxImagepaths = createPathStrings(filename);
        
        const materialArray = skyboxImagepaths.map(image => {
        
            let texture = new THREE.TextureLoader().load(image);
        
        
            return new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide }); 
        
        });
        
        return materialArray;
        
      }
  }
}