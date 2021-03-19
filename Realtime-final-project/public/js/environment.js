let group = new THREE.Group();
let wall;
let ball;

var w = 0.5;
var d = 0.5;
var h = 20;
var gridSize = 10;

var root, background,light;

let starGeo = new THREE.Geometry();
let stars;

let soulPos = new THREE.Geometry();
let souls;


function createEnvironment(scene) {
  addText(scene);
  initStars(scene);
  addSouls(scene);
}

function updateEnvironment(scene) {
  moveStars();

}

function initStars(scene){
  for(let i=0; i<6000; i++){
    let star = new THREE.Vector3(
      Math.random() *600-300,
      Math.random() *600-300,
      Math.random() *600-300);

      star.velocity = 0.01;
      star.acceleration = 0.002;
      starGeo.vertices.push(star);
  }
  let sprite = new THREE.TextureLoader().load('../assets/star.png');
  let startMaterial = new THREE.PointsMaterial({
    //color: 0xaaaaaa,
    size: 1,
    map: sprite, 
    transparent: true
  });

  stars = new THREE.Points(starGeo,startMaterial);
  scene.add(stars);
}

function moveStars(){
  starGeo.vertices.forEach(p => {
    // p.velocity += p.acceleration;
    
    if (p.z < -200 || p.z > 200) {
      p.z = -p.z;
    }
    p.z += p.velocity;
  });
  starGeo.verticesNeedUpdate = true;
  stars.rotation.y +=0.001;
}

function addSouls(scene){
  for(let i=0; i<30; i++){
    let soul = new THREE.Vector3(
      Math.random()*600-300,
      0,
      Math.random()*600-300);
      soulPos.vertices.push(soul);
  }

  
  for(let i=0; i<30; i++){
    let soulGeo = new THREE.SphereGeometry(5, 32, 32);
    let soulMaterial = new THREE.MeshBasicMaterial({color: 0x1b1b1b});
    let soulMesh = new THREE.Mesh(soulGeo,soulMaterial);
    soulMesh.position.set(soulPos.vertices[i].x,soulPos.vertices[i].y,soulPos.vertices[i].z);
    scene.add(soulMesh);
  }
}

function addText(scene){

  root = new THREE.Object3D()
    root.position.set(0,0,0);
    root.rotation.y = Math.PI / 3
    scene.add(root)

    background = makeElementObject('div', 200, 200)
    background.css3dObject.element.textContent = "I am an HTML <div> element mixed into the WebGL scene. This text is editable!"
    background.css3dObject.element.setAttribute('contenteditable', '')
    background.position.z = 20
    background.css3dObject.element.style.opacity = "1"
    background.css3dObject.element.style.padding = '10px'
    const color1 = '#7bb38d'
    const color2 = '#71a381'
    background.css3dObject.element.style.background = color1;
    root.add( background );

    light = new THREE.PointLight( 0xffffff, 1, 0 );
    light.castShadow = true;
    light.position.z = 150;
    light.shadow.mapSize.width = 1024;  // default
    light.shadow.mapSize.height = 1024; // default
    light.shadow.camera.near = 1;       // default
    light.shadow.camera.far = 2000;      // default

    // scene.add( new THREE.PointLightHelper( light, 10 ) )

    root.add( light );
}

function makeElementObject(type, width, height) {
  const obj = new THREE.Object3D

  const element = document.createElement( type );
  element.style.width = width+'px';
  element.style.height = height+'px';
  element.style.opacity = 0.999;
  element.style.boxSizing = 'border-box'

  var css3dObject = new THREE.CSS3DObject( element );
  obj.css3dObject = css3dObject
  obj.add(css3dObject)

  return obj
}

