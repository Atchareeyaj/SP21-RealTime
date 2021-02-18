let group = new THREE.Group();
let wall;
let ball;

var w = 0.5;
var d = 0.5;
var h = 20;
var gridSize = 10;


function createEnvironment(scene) {
  console.log("Adding environment");
  const lightL = new THREE.DirectionalLight( 0xff00ff, 0.2 );
  lightL.position.set( 1, 0.9, 0 );
  scene.add( lightL );

  const lightR = new THREE.DirectionalLight( 0xFFffff, 0.3 );
  lightR.position.set( 0, -0.9, 1 );
  scene.add( lightR );

  const lightLL = new THREE.DirectionalLight( 0x64F4FF, 0.5 );
  lightL.position.set( -1, 0, -1 );
  scene.add( lightLL );

  // const lightRR = new THREE.DirectionalLight( 0xFB64FF, 0.3 );
  // lightR.position.set( 0, 0, -1 );
  // scene.add( lightRR );
  
  //level 1
  for(let i =-gridSize; i<= gridSize; i++){
    for(let j=-gridSize; j<=gridSize; j++){
      if(i == -gridSize || i == gridSize || j == -gridSize || j == gridSize ){
        if(i % gridSize/2 >1 || i % gridSize/2 < -1|| j % gridSize/2 >1 || j % gridSize/2 < -1){
          let myGeometry = new THREE.BoxGeometry(w, h, d);
          let myMaterial = new THREE.MeshPhongMaterial();
          wall = new THREE.Mesh(myGeometry, myMaterial);
          wall.position.set(i*(w), h*0.5, j*(d));
          scene.add(wall);
        }
      }
    }
  }
  gridSize += 10;
  h -= 4; 
  //level 2
  for(let i =-gridSize; i<= gridSize; i++){
    for(let j=-gridSize; j<=gridSize; j++){
      if(i == -gridSize || i == gridSize || j == -gridSize || j == gridSize ){
        if(i % 5 == 0 || j%5 == 1){
          let myGeometry = new THREE.BoxGeometry(w, h, d);
          let myMaterial = new THREE.MeshPhongMaterial();
          wall = new THREE.Mesh(myGeometry, myMaterial);
          wall.position.set(i*(w),h*0.5, j*(d));
          scene.add(wall);
        }
      }
    }
  }
  gridSize += 10;
  h -= 4; 

  //level 3
  for(let i =-gridSize; i<= gridSize; i++){
    for(let j=-gridSize; j<=gridSize; j++){
      if(i == -gridSize || i == gridSize || j == -gridSize || j == gridSize ){
        if(i % 5 == 1 || j%5 == 0){
          let myGeometry = new THREE.BoxGeometry(w, h, d);
          let myMaterial = new THREE.MeshPhongMaterial();
          wall = new THREE.Mesh(myGeometry, myMaterial);
          wall.position.set(i*(w), h*0.5, j*(d));
          scene.add(wall);
        }
      }
    }
  }
  gridSize += 10;
  h -= 4; 

  //level 4
  for(let i =-gridSize; i<= gridSize; i++){
    for(let j=-gridSize; j<=gridSize; j++){
      if(i == -gridSize || i == gridSize || j == -gridSize || j == gridSize ){
        if(i % 3 == 1 || j%3 == 1){
          let myGeometry = new THREE.BoxGeometry(w, h, d);
          let myMaterial = new THREE.MeshPhongMaterial();
          wall = new THREE.Mesh(myGeometry, myMaterial);
          wall.position.set(i*(w), h*0.5, j*(d));
          scene.add(wall);
        }
      }
    }
  }
  gridSize += 10;
  h -= 4; 

   //level 5
   for(let i =-gridSize; i<= gridSize; i++){
    for(let j=-gridSize; j<=gridSize; j++){
      if(i == -gridSize || i == gridSize || j == -gridSize || j == gridSize ){
        if(i % 3 == -1 || j%3 == -1){
          let myGeometry = new THREE.BoxGeometry(w, h, d);
          let myMaterial = new THREE.MeshPhongMaterial();
          wall = new THREE.Mesh(myGeometry, myMaterial);
          wall.position.set(i*(w), h*0.5, j*(d));
          scene.add(wall);
        }
      }
    }
  }
  gridSize += 10;
  h -= 2; 

     //level 5
     for(let i =-gridSize; i<= gridSize; i++){
      for(let j=-gridSize; j<=gridSize; j++){
        if(i == -gridSize || i == gridSize || j == -gridSize || j == gridSize ){
          if(i % 2 !== 0 || j%2 !== 0){
            let myGeometry = new THREE.BoxGeometry(w, h, d);
            let myMaterial = new THREE.MeshPhongMaterial();
            wall = new THREE.Mesh(myGeometry, myMaterial);
            wall.position.set(i*(w), h*0.5, j*(d));
            scene.add(wall);
          }
        }
      }
    }
    gridSize += 10;

  //level6 
  let radian = gridSize/1.5
  for(i =0; i<= 360; i+= 360/10){
    let xPos = radian* Math.sin(i);
    let yPos = radian* Math.cos(i);
    let myGeometry = new THREE.SphereGeometry(4, 40,40);
    let myMaterial = new THREE.MeshPhongMaterial();
    ball = new THREE.Mesh(myGeometry, myMaterial);
    ball.position.set(xPos, h, yPos);
    scene.add(ball);  
  }
}


function updateEnvironment(scene) {
  // ball.position.y += 0.01;
}