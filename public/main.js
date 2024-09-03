import Circle from "./circle.js";
import { balls,map,matrix, location,sharedState } from './state.js'; // Importieren des sharedState aus state.js
import { threejsanimation} from './animationHandler.js';
import { ThreeJsHandler, createVector} from "./threeHandler.js";


//const canvas = document.getElementById("old-canvas");
//const ctx = canvas.getContext("2d");

const ctx_width = 1000;//canvas.width;
//const ctx_height = canvas.height;
const circle_size = document.getElementById("circle_size").value;
//ctx.strokeStyle = sharedState.animation_color;
let raf;
export const threeJsHandler = new ThreeJsHandler('canvas-container');

main();

async function main() {
  const jsoncontent = await loadJson();
  createCircles(jsoncontent);
  createConnections(jsoncontent);
  fillConnectivityMatrix();
  
  //draw_all_lines(getColor());
  sharedState.all_loaded = true;
  
  const circles =[];
  balls.forEach(ball => {
    location[ball.district_x][ball.district_y].push(ball.id);
    ball.change_circle_size();
    //ball.draw();
  });
  threeJsHandler.createScene( balls, matrix);
  console.log("Scene is created");
}

async function loadJson() {
  try {
    const response = await fetch("./obsidian.json");
    return await response.json();
  } catch (error) {
    console.error("Fehler beim Laden der JSON-Datei:", error);
  }
}

function createCircles(jsoncontent) {

  jsoncontent.forEach((element, i) => {
    const pos_x =  ctx_width * 0.4 * Math.sin((i / jsoncontent.length) * 2 * Math.PI);//+ctx_width / 2;
    const pos_y = ctx_width * 0.4 * Math.cos((i / jsoncontent.length) * 2 * Math.PI);// + ctx_height / 2;
    map.set(element.name, element.id);
    balls.push(
      new Circle(
        element.id,
        element.category,
        element.is_boss,
        element.priority,
        element.name,
        pos_x,
        pos_y,
        createVector(pos_x,pos_y),
        Circle.sort_cordinate(pos_x),
        Circle.sort_cordinate(pos_y),
        pos_x,
        pos_y,
        circle_size,
        element.content
      )
    );
  });
}

function createConnections(jsoncontent) {
  jsoncontent.forEach(element => {
    const children_list = element.children.map(child => balls[map.get(child)]);
    balls[element.id].child_links = children_list;
  });
}

function fillConnectivityMatrix() {
  balls.forEach(ball => {
    matrix.push(ball.get_child_links());
  });
}



function startAnimation() {
  if ( sharedState.all_loaded &&!sharedState.running) {
    raf = window.requestAnimationFrame(threejsanimation);
    sharedState.running = true;
  }
}

window.addEventListener("click", startAnimation);
window.addEventListener("mouseout", startAnimation);
window.addEventListener("scroll", startAnimation);
document.getElementById("myModal").addEventListener("click", startAnimation);