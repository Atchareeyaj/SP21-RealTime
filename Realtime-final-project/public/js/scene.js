/*
 *
 * This uses code from a THREE.js Multiplayer boilerplate made by Or Fleisher:
 * https://github.com/juniorxsound/THREE.Multiplayer
 * And a WEBRTC chat app made by Mikołaj Wargowski:
 * https://github.com/Miczeq22/simple-chat-app
 *
 * Aidan Nelson, April 2020
 *
 */

class Scene {
  constructor(_movementCallback) {
    this.movementCallback = _movementCallback;

    //THREE scene
    this.scene = new THREE.Scene();
    this.keyState = {};

    this.controlUpdate = false;

    //Utility
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    //Add Player
    this.user_head;
    this.user_body;
    this.userColor = null;
    this.userMsg;

    this.client_head;
    this.client_body;
    this.clientColor = null;
    this.addSelf();

    //THREE Camera
    this.camera = new THREE.PerspectiveCamera(
      60,
      this.width / this.height,
      0.1,
      1000
    );
    //this.camera.position.set(0, 3, 6);
    this.camera.position.z = 1
    this.camera.rotation.x = Math.PI/2;
    this.scene.add(this.camera);

    // create an AudioListener and add it to the camera
    this.listener = new THREE.AudioListener();
    this.playerGroup.add(this.listener);

    //THREE WebGL renderer
    this.renderer = new THREE.WebGLRenderer({
      //antialiasing: true,
    });

    this.renderer.setClearColor(new THREE.Color('#9FBFED'));
    this.renderer.setSize(this.width, this.height);

    // THREE CSS renderer
    this.renderer2 = new THREE.CSS3DRenderer();
   

    //Push the canvas to the DOM
    let domElement = document.getElementById("canvas-container");
    domElement.appendChild(this.renderer.domElement);
    //css renderer
    this.renderer2.domElement.style.position = 'absolute';
    this.renderer2.domElement.style.top = 0;
    domElement.appendChild( this.renderer2.domElement );

    //Setup event listeners for events and handle the states
    window.addEventListener("resize", (e) => this.onWindowResize(e), false);
    window.addEventListener("keydown", (e) => this.onKeyDown(e), false);
    window.addEventListener("keyup", (e) => this.onKeyUp(e), false);

    // Helpers
    //this.scene.add(new THREE.GridHelper(500, 500));
    //this.scene.add(new THREE.AxesHelper(10));

    // add controls:
 
    this.controls = new THREE.PlayerControls(this.camera, this.playerGroup);

    this.addLights();
    createEnvironment(this.scene);

    // Start the loop
    this.frameCount = 0;
    this.update();
  }

  //////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////
  // Lighting 💡

  addLights() {
    //this.scene.add(new THREE.AmbientLight(0xffffe6, 0.7));
    let ambient = new THREE.AmbientLight(0x555555);
    this.scene.add(ambient);
  }

  //////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////
  // Clients 👫

  addSelf() {
    let videoMaterial = makeVideoMaterial("local");
    let mat = new THREE.MeshBasicMaterial({color : this.userColor});

    let _face = new THREE.Mesh(new THREE.CircleGeometry( 0.5, 32 ), videoMaterial);
    this.user_head = new THREE.Mesh(new THREE.CylinderGeometry( 0.5, 0.5 , 0.5, 32 ), mat);
    this.user_body = new THREE.Mesh(new THREE.SphereGeometry( 0.1, 0.5,1 ,40), mat);

    _face.position.set(0, 0.8, -0.3);
    this.user_head.position.set(0, 0.8, 0);
    this.user_body.position.set(0, 0, 0);
    this.user_head.rotateX(Math.PI/2);

    // https://threejs.org/docs/index.html#api/en/objects/Group
    this.playerGroup = new THREE.Group();
    this.playerGroup.position.set(0, 0.5, 0);
    this.playerGroup.add(_face);
    this.playerGroup.add(this.user_head);
    this.playerGroup.add(this.user_body);

    // add group to scene
    this.scene.add(this.playerGroup);
  }

  // add a client meshes, a video element and  canvas for three.js video texture
  addClient(_id) {
    let videoMaterial = makeVideoMaterial(_id);
    this.myMat = new THREE.MeshBasicMaterial({color : this.clientColor});

    let _face = new THREE.Mesh(new THREE.CircleGeometry( 0.5, 32 ), videoMaterial);
    this.client_head = new THREE.Mesh(new THREE.CylinderGeometry( 0.5, 0.5 , 0.5, 32 ), mat);
    this.client_body = new THREE.Mesh(new THREE.SphereGeometry( 0.1, 0.5,1 ,40), mat);

    // set position of head before adding to parent object

    _face.position.set(0, 0.8, -0.3);
    this.client_head.position.set(0, 0.8, 0);
    this.client_body.position.set(0, 0, 0);
    this.client_head.rotateX(Math.PI/2);

    // https://threejs.org/docs/index.html#api/en/objects/Group
    var group = new THREE.Group();
    group.add(_face);
    group.add(this.client_head);
    group.add(this.client_body);

    // add group to scene
    this.scene.add(group);

    clients[_id].group = group;
    clients[_id].head = this.client_head;
    clients[_id].body = this.client_body;
    client[_id].color = this.clientColor;
    clients[_id].desiredPosition = new THREE.Vector3();
    clients[_id].desiredRotation = new THREE.Quaternion();
    clients[_id].movementAlpha = 0;
  }

  removeClient(_id) {
    this.scene.remove(clients[_id].group);
  }

  // overloaded function can deal with new info or not
  updateClientPositions(_clientProps) {
    for (let _id in _clientProps) {
      // we'll update ourselves separately to avoid lag...
      if (_id != id) {
        clients[_id].desiredPosition = new THREE.Vector3().fromArray(
          _clientProps[_id].position
        );
        clients[_id].desiredRotation = new THREE.Quaternion().fromArray(
          _clientProps[_id].rotation
        );
      }
    }
  }

  /////////////////////////////////////////////////////////////////////////
  ///////////////////////// ADD Text //////////////////////////////////////



  // snap to position and rotation if we get close
  interpolatePositions() {
    let snapDistance = 0.5;
    let snapAngle = 0.2; // radians
    for (let _id in clients) {
      clients[_id].group.position.lerp(clients[_id].desiredPosition, 0.2);
      clients[_id].group.quaternion.slerp(clients[_id].desiredRotation, 0.2);
      if (
        clients[_id].group.position.distanceTo(clients[_id].desiredPosition) <
        snapDistance
      ) {
        clients[_id].group.position.set(
          clients[_id].desiredPosition.x,
          clients[_id].desiredPosition.y,
          clients[_id].desiredPosition.z
        );
      }
      if (
        clients[_id].group.quaternion.angleTo(clients[_id].desiredRotation) <
        snapAngle
      ) {
        clients[_id].group.quaternion.set(
          clients[_id].desiredRotation.x,
          clients[_id].desiredRotation.y,
          clients[_id].desiredRotation.z,
          clients[_id].desiredRotation.w
        );
      }
    }
  }

  updateClientVolumes() {
    for (let _id in clients) {
      let audioEl = document.getElementById(_id + "_audio");
      if (audioEl) {
        let distSquared = this.camera.position.distanceToSquared(
          clients[_id].group.position
        );

        if (distSquared > 500) {
          // console.log('setting vol to 0')
          audioEl.volume = 0;
        } else {
          // from lucasio here: https://discourse.threejs.org/t/positionalaudio-setmediastreamsource-with-webrtc-question-not-hearing-any-sound/14301/29
          let volume = Math.min(1, 10 / distSquared);
          audioEl.volume = volume;
          // console.log('setting vol to',volume)
        }
      }
    }
  }

  //////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////
  // Interaction 🤾‍♀️

  getPlayerPosition() {
    // TODO: use quaternion or are euler angles fine here?
    return [
      [
        this.playerGroup.position.x,
        this.playerGroup.position.y,
        this.playerGroup.position.z,
      ],
      [
        this.playerGroup.quaternion._x,
        this.playerGroup.quaternion._y,
        this.playerGroup.quaternion._z,
        this.playerGroup.quaternion._w,
      ],
    ];
  }

  //////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////
  // Rendering 🎥

  update() {
    requestAnimationFrame(() => this.update());
    this.frameCount++;

    updateEnvironment();

    if (this.frameCount % 25 === 0) {
      this.updateClientVolumes();
      this.movementCallback();
    }

    this.interpolatePositions();
    
    if(this.controlUpdate == true){
      // console.log(this.userColor);  
      this.user_head.material.color = new THREE.Color(this.userColor);         
      this.user_head.material.needsUpdate = true;
      this.user_body.material.color = new THREE.Color(this.userColor);       
      this.user_body.material.needsUpdate = true;
      this.controls.enabled = true;
      }else{
        this.controls.enabled = false;
    }
     
    this.controls.update();

    this.render();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  //////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////
  // Event Handlers 🍽

  onWindowResize(e) {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
  }

  // keystate functions from playercontrols
  onKeyDown(event) {
    event = event || window.event;
    this.keyState[event.keyCode || event.which] = true;
  }

  onKeyUp(event) {
    event = event || window.event;
    this.keyState[event.keyCode || event.which] = false;
  }
}

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
// Utilities

function makeVideoMaterial(_id) {
  let videoElement = document.getElementById(_id + "_video");
  let videoTexture = new THREE.VideoTexture(videoElement);

  let videoMaterial = new THREE.MeshBasicMaterial({
    map: videoTexture,
    overdraw: true,
    side: THREE.DoubleSide,
  });

  return videoMaterial;
}
