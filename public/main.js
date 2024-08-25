import circle from "./circle.js";
import { balls,map,matrix, sharedState } from './state.js'; // Importieren des sharedState aus state.js
import { handleMouseMove, handleMouseDown, handleMouseUp , handleTouchStart, handleTouchMove, handleTouchEnd} from './eventFunction.js';
import { animation,draw_all_lines, getColor } from './animationHandler.js';

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const ctx_width = canvas.width;
const ctx_height = canvas.height;
const circle_size = document.getElementById("circle_size").value;
ctx.strokeStyle = sharedState.animation_color;
let raf;

main();

async function main() {
  const jsoncontent = await loadJson();

  createCircles(jsoncontent);
  createConnections(jsoncontent);
  createConnectivityMatrix();
  
  draw_all_lines(getColor());
  sharedState.all_loaded = true;
  
  balls.forEach(ball => {
    ball.change_circle_size();
    ball.draw();
  });
}

async function loadJson() {
  try {
    const response = await fetch("./obsidian_with_position.json");
    return await response.json();
  } catch (error) {
    console.error("Fehler beim Laden der JSON-Datei:", error);
  }
}

function createCircles(jsoncontent) {
  jsoncontent.forEach((element, i) => {
    map.set(element.name, element.id);
    balls.push(
      new circle(
        element.id,
        element.category,
        element.is_boss,
        element.name,
        ctx_width / 2 + ctx_width * 0.45 * Math.sin((i / jsoncontent.length) * 2 * Math.PI),
        ctx_height / 2 + ctx_width * 0.45 * Math.cos((i / jsoncontent.length) * 2 * Math.PI),
        element.x_pos,
        element.y_pos,
        circle_size,
        element.content
      )
    );
  });
}

function createConnections(jsoncontent) {
  jsoncontent.forEach(element => {
    const children_list = element.children.map(child => balls[map.get(child)]);
    const parent_list = element.parents.map(parent => balls[map.get(parent)]);

    balls[element.id].child_links = children_list;
    balls[element.id].parent_links = parent_list;
  });
}

function createConnectivityMatrix() {
  balls.forEach(ball => {
    matrix.push(ball.get_child_links());
  });
}

function startAnimation() {
  if (!sharedState.running) {
    raf = window.requestAnimationFrame(animation);
    sharedState.running = true;
  }
}



function clear() {
  ctx.clearRect(0, 0, ctx_width, ctx_height);
}
// Event-Listener für Maus- und Touch-Events
canvas.addEventListener("mousemove", handleMouseMove);
canvas.addEventListener("mousedown", handleMouseDown);
canvas.addEventListener("mouseup", handleMouseUp);
canvas.addEventListener("click", startAnimation);
canvas.addEventListener("mouseout", startAnimation);
canvas.addEventListener("touchstart", handleTouchStart);
canvas.addEventListener("touchmove", handleTouchMove);
canvas.addEventListener("touchend", handleTouchEnd);
window.addEventListener("scroll", startAnimation);
document.getElementById("myModal").addEventListener("click", startAnimation);