import * as THREE from "../libs/three.module.js"
import { CameraAndInfoHandler } from "./cameraAndInfoHandler.js";

export class ThreeJsHandler {
  constructor(containerId) {
    this.containerId = containerId;
    this.scene = null;
    this.camera = new CameraAndInfoHandler();
    this.camera_target_position = new THREE.Vector3(0, 0, 1200);
    this.target_achieved = false;
    this.camera_v = 0.1;

    this.mouse_down = false;
    this.old_worldposition = null;

    this.renderer = null;
    this.light = null;
    this.mouse = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();
    this.mesh_to_ball = new Map();
    this.lines_list = [];
    this.id_to_lines = new Map();
    this.lines_to_balls = new Map();
    this.balls = null;
    this.font = null;
    this.focus_topic_id = 0;
    this.old_topic_id = 0;
    this.clicked_topic_id = 0;
    this.old_clicked_topic_id = 0;
    this.general_hovered = false;
    this.general_dragged = false;

    this.canvas = null;
    this.ctx = null;
    this.textTexture = null;
    this.textPlane = null;

    this.initialize();
    
  }

  initialize() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xd7d7d7);
    this.renderer = new THREE.WebGLRenderer();
    //this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setSize(2024, 2024);

    const container = document.getElementById(this.containerId);
    if (!container) {
      console.error(`Container with ID ${this.containerId} not found.`);
      return;
    }
    container.appendChild(this.renderer.domElement);
    this.addLight();
    this.loadFont();
    this.createTextCanvas();
    window.addEventListener("keydown", this.onKeyDown.bind(this), false);
    window.addEventListener("mousemove", this.onMouseMove.bind(this), false);
    window.addEventListener("mousedown", this.onMouseDown.bind(this), false);
    window.addEventListener("mouseup", this.onMouseUp.bind(this), false);
    window.addEventListener("click", this.onClick.bind(this), false);
    window.addEventListener("resize", this.onWindowResize.bind(this), false);
  }

  addLight() {
    if (!this.light) {
      this.light = new THREE.PointLight(0xffffff, 1);
      this.light.position.set(10, 10, 10);
      this.scene.add(this.light);
    }
  }

  loadFont() {
    const loader = new THREE.FontLoader();
    loader.load("helvetiker_regular.typeface.json", (font) => {
      this.font = font;
      console.log("Schriftart geladen");
    });
  }
 
  onMouseMove(event) {
    if (!this.camera.getInfoHandlerHovered()){
      const rect = this.renderer.domElement.getBoundingClientRect();
      this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera.getCamera());
      const circleMeshes = this.balls.map((circle) => circle.mesh); // Nur Kreismeshes
      const intersects = this.raycaster.intersectObjects(circleMeshes); // Nur nach Kreisen scannen
      const ray = this.raycaster.ray;
      const worldPosition = ray.origin
        .clone()
        .add(
          ray.direction.clone().multiplyScalar(ray.origin.z / -ray.direction.z)
        );

      if (this.general_dragged) {
        this.balls[this.focus_topic_id].x = worldPosition.x;
        this.balls[this.focus_topic_id].y = worldPosition.y;
      } else {
        if (intersects.length > 0) {
          this.general_hovered = true;
          this.old_topic_id = this.focus_topic_id;
          this.focus_topic_id =
            this.balls[this.mesh_to_ball.get(intersects[0].object["uuid"])].id;
          if (this.old_topic_id != this.focus_topic_id) {
            this.updateCircleColor();
            this.updateLineColor();
          }
          if (this.balls[this.focus_topic_id].dragging) {
            this.balls[this.mesh_to_ball.get(intersects[0].object["uuid"])].x =
              worldPosition.x;
            this.balls[this.mesh_to_ball.get(intersects[0].object["uuid"])].y =
              worldPosition.y;
          }
        } else {
          this.general_hovered = false;
          if(this.mouse_down){
              const worldPosition_diff_x = worldPosition.x - this.old_worldposition.x;
              const worldPosition_diff_y = worldPosition.y - this.old_worldposition.y;
              this.target_achieved = false;
              this.camera.adjustTarget(-worldPosition_diff_x,-worldPosition_diff_y);
              this.camera.adjustPosition(-worldPosition_diff_x,-worldPosition_diff_y, this.renderer);
          }
        }
      }
    }
  }

  

  

  onMouseUp(event) {
    this.general_dragged = false;
    this.mouse_down = false;
    if(this.focus_topic_id != null) this.balls[this.focus_topic_id].dragging = false;
    
  }

  onMouseDown(event) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera.getCamera());
    const ray = this.raycaster.ray;
    const worldPosition = ray.origin.clone().add(ray.direction.clone().multiplyScalar(ray.origin.z / -ray.direction.z));
    
    const circleMeshes = this.balls.map((circle) => circle.mesh); // Nur Kreismeshes
    const intersects = this.raycaster.intersectObjects(circleMeshes); // Nur nach Kreisen scannen

    if (intersects.length > 0) {
      const intersectedMesh = intersects[0].object;
      const ballId = this.mesh_to_ball.get(intersectedMesh.uuid);
      //const old_topic = this.focus_topic_id;
      this.focus_topic_id = this.balls[ballId].id;
      if (this.balls[ballId].is_hovered) {
        this.general_dragged = true;
        this.balls[ballId].dragging = true;
      }
    } else {
      this.general_dragged = false;
        this.old_worldposition = worldPosition;
        this.mouse_down = true;
    }
  }

onClick(event) {
    if (!this.camera.getInfoHandlerHovered()){
      console.log("hier wird gehovered ",this.camera.getInfoHandlerHovered());
      // Berechnung der Mausposition in NDC (Normalized Device Coordinates)
      const rect = this.renderer.domElement.getBoundingClientRect();
      this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      this.raycaster.setFromCamera(this.mouse, this.camera.getCamera());
      const ray = this.raycaster.ray;
      const worldPosition = ray.origin.clone().add(ray.direction.clone().multiplyScalar(ray.origin.z / -ray.direction.z));
      console.log("Maus-Weltkoordinaten:", worldPosition);
      const circleMeshes = this.balls.map((circle) => circle.mesh); // Nur Kreismeshes
      const intersects = this.raycaster.intersectObjects(circleMeshes); // Nur nach Kreisen scannen

      if (intersects.length > 0) {
          this.old_clicked_topic_id = this.clicked_topic_id;
          this.clicked_topic_id = this.focus_topic_id;
          this.camera.deactivateInfoHandlerEditMode();
          if (this.clicked_topic_id === this.old_clicked_topic_id){
            this.camera.changeInfoHandlerActivity();
          }else{
            //this.camera.deactivateInfoHandlerEditMode();
            this.camera.activateInfoHandlerActivity();
          }
          const old_camera_x = this.camera.getCamera().position.x;
          const old_camera_y = this.camera.getCamera().position.y;
          const camera_diff_x = worldPosition.x- old_camera_x;
          const camera_diff_y = worldPosition.y- old_camera_y;
          this.camera.setTarget(worldPosition);
          //this.setCameraTargetPosition(worldPosition);
          this.camera.updateFocusTopic(this.balls[this.clicked_topic_id]); 
          //this.camera.updateInfoContent(this.balls[this.clicked_topic_id].content);
          
          //this.newInfoDiv.updateContent(this.focus_topic.content);
          //this.camera.setInfoPosition(worldPosition);
          const infoposition = createVector(worldPosition.x,worldPosition.y);
          //const test = worldPosition.clone();
          //console.log("worldPosition",worldPosition);
          //console.log("focus pos x",this.balls[this.focus_topic_id].x," focus pos y",this.balls[this.focus_topic_id].y);
          //console.log("camera pos",this.camera.getCamera().position);
          //console.log("x = ",this.balls[this.focus_topic_id].x-this.camera.getCamera().position.x," y = ",this.balls[this.focus_topic_id].y-this.camera.getCamera().position.y);


          // Schritt 1: Hole die Position des Objekts im 3D-Raum
          const test_vector = createVector(this.balls[this.focus_topic_id].x,this.balls[this.focus_topic_id].y);
          console.log("HIER",test_vector);
          test_vector.project(this.camera.getCamera());
          console.log("DA",test_vector);
          const widthHalf = 2024 / 2;
          const heightHalf = 2024 / 2;

          //const screenX = (vector.x * widthHalf) + widthHalf;
          //const screenY = -(vector.y * heightHalf) + heightHalf;
          //console.log("CALC",screenX,screenY)


          //console.log("worldPosition.x ",worldPosition.x,"camera_diff_x ",camera_diff_x,"this.focus_topic.radius",this.focus_topic.radius);
          worldPosition.x = worldPosition.x - camera_diff_x +this.balls[this.focus_topic_id].radius;
          worldPosition.y = worldPosition.y - camera_diff_y -this.balls[this.focus_topic_id].radius;
          //console.log("relative = ",worldPosition);
          //this.camera.updateInfoContent(this.balls[this.clicked_topic_id].content);
          this.camera.switchOnInfo();//infoposition,worldPosition ,this.renderer);
          //this.newInfoDiv.changeInfoDivPosition(worldPosition,this.camera.getCamera(),this.renderer);
          
        

      }
    }else{
      if(this.camera.isLinkClicked()){
        const new_topic_position = createVector(this.balls[this.camera.getClickedLinkId()].x,this.balls[this.camera.getClickedLinkId()].y);
        this.old_clicked_topic_id = this.focus_topic_id;
        this.focus_topic_id = this.camera.getClickedLinkId();
        this.old_clicked_topic_id = this.focus_topic_id;
        this.camera.setTarget(new_topic_position);
        this.camera.updateFocusTopic(this.balls[this.camera.getClickedLinkId()]); 
        this.updateCircleColor();
        this.updateLineColor();
      }
      
    }
}

  onKeyDown(event) {
    // Überprüfe, ob Cmd/Ctrl gedrückt ist
    if (event.metaKey || event.ctrlKey) {
      if (event.key === "+") {
        // Cmd/Ctrl + '+'
        this.camera.position.z -= 50; // Kamera näher ran
      }
      if (event.key === "-") {
        // Cmd/Ctrl + '-'
        this.camera.position.z += 50; // Kamera weiter weg
      }
      //this.render();
    }
  }

  createScene(balls, matrix) {
    this.createLines(balls, matrix);
    this.createCircles(balls);
    this.updateCanvasText(balls);
    this.camera.setBalls(balls);
    this.camera.updateFocusTopic(this.balls[this.clicked_topic_id]); 
    this.render();
  }

  updateScene(balls, matrix) {



    this.updateLines();
    this.updateCircles(balls);
    this.updateCanvasText(balls);
    this.camera.infoHandlerPOS();
    this.camera.camerafollow();
    this.render();

  }

  
  createLines(balls, matrix) {
    balls.forEach((ball, i) => {
      const child_lines = [];
      matrix[i].forEach((linkedBall) => {
        const material = new THREE.LineBasicMaterial({
          color: 0x969696,
          linewidth: 20,
        });
        const points = [
          new THREE.Vector3(ball.x, ball.y, 0),
          new THREE.Vector3(linkedBall.x, linkedBall.y, 0),
        ];
        const circles_id = {
          startID: ball.id,
          endID: linkedBall.id,
        };
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const lineMesh = new THREE.Line(geometry, material);
        child_lines.push(lineMesh);
        this.lines_list.push(lineMesh);
        this.lines_to_balls.set(lineMesh["uuid"], circles_id);
        this.scene.add(lineMesh);
      });
      this.id_to_lines.set(ball.id, child_lines);
    });
    console.log(this.id_to_lines);
  }

  updateLines() {
    this.lines_list.forEach((line) => {
      const circles_id = this.lines_to_balls.get(line["uuid"]);
      line.geometry.setFromPoints([
        new THREE.Vector3(
          this.balls[circles_id.startID].x,
          this.balls[circles_id.startID].y,
          0
        ), //startX, startY, 0),
        new THREE.Vector3(
          this.balls[circles_id.endID].x,
          this.balls[circles_id.endID].y,
          0
        ),
      ]);
    });
  }

  createCircles(balls) {
    const mesh_to_ball = new Map();
    for (let i = 0; i < balls.length; i++) {
      const circle = balls[i];
      //console.log("id ",circle.id," i = ",i);
      const geometry = new THREE.CircleGeometry(circle.radius, 12);
      const material = new THREE.MeshBasicMaterial({ color: circle.color });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(circle.x, circle.y, 1);
      circle.mesh = mesh;
      mesh_to_ball.set(mesh["uuid"], circle.id);
      balls[i] = circle;
      this.scene.add(mesh);
    }
    this.mesh_to_ball = mesh_to_ball;
    this.balls = balls;
  }

  updateCircles() {
    this.balls.forEach((ball) => {
      ball.mesh.position.set(ball.x, ball.y, 1);
    });
  }

  updateLineColor() {
    this.id_to_lines.get(this.focus_topic_id).forEach((line) => {
        line.material.color.set(0xFFFFFF);
    });

    this.id_to_lines.get(this.old_topic_id).forEach((line) => {
        line.material.color.set(0x969696);
    });

    
    
  }

  updateCircleColor() {
    this.balls[this.old_topic_id].mesh.material.color.set(this.balls[this.old_topic_id].color);
    this.balls[this.old_topic_id].child_links.forEach((ball) => {
      this.balls[ball.id].mesh.material.color.set(ball.color);
    });
    this.balls[this.old_topic_id].is_hovered = false;

    this.balls[this.focus_topic_id].is_hovered = true;
    this.balls[this.focus_topic_id].mesh.material.color.set( "#FFFFFF");
    this.balls[this.focus_topic_id].child_links.forEach(
      (ball) => {
        this.balls[ball.id].mesh.material.color.set("#FFFFFF");
      }
    );
  }

  createText() {
    for (let i = 0; i < this.balls.length; i++) {
      const circle = this.balls[i];
      const textGeometry = new THREE.TextGeometry(circle.name, {
        font: this.font,
        size: 30,
        height: 0,
        curveSegments: 12,
      });
      const textMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);
      textMesh.position.set(circle.x, circle.y, 2);
      circle.textMesh = textMesh;
      this.balls[i] = circle;

      if (circle.is_boss) {
        this.scene.add(textMesh);
      }
    }
  }

  updateText() {
    for (let i = 0; i < this.balls.length; i++) {
      const circle = this.balls[i];
      if (circle.is_boss) {
        const textMesh = circle.textMesh;
        textMesh.position.set(circle.x, circle.y, 2);
        this.scene.add(textMesh);
        this.balls[i] = circle;
        continue;
      }
      if (circle === this.balls[this.focus_topic_id]) {
        const textMesh = circle.textMesh;
        textMesh.position.set(circle.x, circle.y, 2);
        this.scene.add(textMesh);
        circle.textMesh = textMesh;
        this.balls[i] = circle;
        continue;
      }
    }
  }

  createTextCanvas() {
    // Canvas erstellen
    this.canvas = document.createElement("canvas");
    this.canvas.width = 1024;//window.innerWidth;
    this.canvas.height = 1024;//window.innerHeight; // Höhe der Textur

    // 2D-Kontext zum Zeichnen auf der Canvas
    this.ctx = this.canvas.getContext("2d");

    // Erstellt eine leere Textur
    this.textTexture = new THREE.CanvasTexture(this.canvas);

    // Erstelle eine Plane, auf der die CanvasTextur angezeigt wird
    const geometry = new THREE.PlaneGeometry(
      this.canvas.width,
      this.canvas.height
    );
    const material = new THREE.MeshBasicMaterial({
      map: this.textTexture,
      transparent: true,
    });
    this.textPlane = new THREE.Mesh(geometry, material);

    this.textPlane.position.z = 1; // Auf der z=1 Ebene
    this.scene.add(this.textPlane);
  }

  updateCanvasText(balls) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.font = "20px Arial";
    this.ctx.fillStyle = "black";
    this.ctx.textAlign = "center";
    balls.forEach((ball, i) => {
      if (ball.is_boss || ball.is_hovered || i == this.clicked_topic_id) {
        this.ctx.fillText(
          ball.name,
          ball.x + this.canvas.width / 2,
          -ball.y + this.canvas.height / 2 - ball.radius
        );
      }
    });
    this.textTexture.needsUpdate = true;
  }

  onWindowResize() {
    this.camera.getCamera().aspect = window.innerWidth / window.innerHeight;
    this.camera.getCamera().updateProjectionMatrix(); // Kamera-Projektionsmatrix aktualisieren
    this.renderer.setSize(window.innerWidth, window.innerHeight); // Renderer-Größe anpassen
  }

  render() {
    this.renderer.render(this.scene, this.camera.getCamera());
  }
}


export function createVector(x, y) {
  return new THREE.Vector3(x, y, 1);
}

