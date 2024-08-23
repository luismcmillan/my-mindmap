import circle from "./circle.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const ctx_width = canvas.width;
const ctx_height = canvas.height;
const circle_size = document.getElementById("circle_size").value;

ctx.strokeStyle = "gray";

let raf;
const lineWidth = 2;  // Einheitliche Linienstärke definiert
let running = false;
let all_loaded = false;
let general_dragged = false;
let general_hovered = false;
let lines_disappear_animation_done = false;
let starting_animation_done = false;
let animiation_color = 65;

const balls = [];
const map = new Map();
const matrix = [];

main();

async function main() {
  const jsoncontent = await loadJson();

  createCircles(jsoncontent);
  createConnections(jsoncontent);
  createConnectivityMatrix();
  
  draw_all_lines(getColor());
  all_loaded = true;
  
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

function clear() {
  ctx.clearRect(0, 0, ctx_width, ctx_height);
}

function getColor() {
  return `rgb(${animiation_color} ${animiation_color} ${animiation_color})`;
}

async function draw_line_between(ball1, ball2, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;  // Konstante Linienstärke setzen
  ctx.beginPath();
  ctx.moveTo(ball1.x, ball1.y);
  ctx.lineTo(ball2.x, ball2.y);
  ctx.stroke();
}

function draw_all_lines(color) {
  balls.forEach((ball, i) => {
    matrix[i].forEach(linkedBall => {
      draw_line_between(ball, linkedBall, color);
    });
  });
}

function startAnimation() {
  if (!running) {
    raf = window.requestAnimationFrame(animation);
    running = true;
  }
}

async function animation() {
  if (!all_loaded) return;

  if (general_hovered || !starting_animation_done) clear();

  if (!lines_disappear_animation_done && animiation_color < 215) {
    animiation_color += 10;
  } else if (lines_disappear_animation_done && animiation_color > 65) {
    animiation_color -= 10;
  }

  draw_all_lines(getColor());

  let found_out_of_position = false;
  balls.forEach(ball => {
    if (animiation_color === 215) ball.follow();
    ball.change_circle_gravity();
    ball.change_circle_size();
    ball.draw();
    
    // Text anzeigen
    ball.show_text();

    if (!ball.in_position) found_out_of_position = true;
  });

  lines_disappear_animation_done = !found_out_of_position;
  starting_animation_done = animiation_color <= 65 && lines_disappear_animation_done;

  raf = window.requestAnimationFrame(animation);
}


function getMousePosition(e) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const mouse_x = (e.clientX - rect.left) * scaleX;
  const mouse_y = (e.clientY - rect.top) * scaleY;
  return { mouse_x, mouse_y };
}

// Touch-Event-Handler hinzufügen





function getTouchPosition(touch) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const mouse_x = (touch.clientX - rect.left) * scaleX;
  const mouse_y = (touch.clientY - rect.top) * scaleY;
  return { mouse_x, mouse_y };
}

function handleTouchStart(e) {
  const touch = e.touches[0];
  const { mouse_x, mouse_y } = getTouchPosition(touch);
  general_dragged = balls.some(ball => {
    if (ball.isPointInside(mouse_x, mouse_y)) {
      ball.dragging = true;
      return true;
    }
    ball.dragging = false;
    return false;
  });
}

function handleMouseMove(e) {
  if (all_loaded && !running && !starting_animation_done) {
    raf = window.requestAnimationFrame(animation);
    running = true;
  }

  const { mouse_x, mouse_y } = getMousePosition(e);
  let found_hovered = false;

  balls.forEach(ball => {
    ball.hovered = ball.dragging || ball.isPointInside(mouse_x, mouse_y);
    ball.draw();
    if (ball.hovered) {
      found_hovered = true;
      general_hovered = true;
      document.getElementById("circle-content").innerHTML = ball.give_content();
      if (ball.dragging) {
        ball.x = mouse_x;
        ball.y = mouse_y;
      }
    }
  });

  general_hovered = found_hovered;
}


function handleTouchMove(e) {
  if (all_loaded && !running && !starting_animation_done) {
    raf = window.requestAnimationFrame(animation);
    running = true;
  }

  const touch = e.touches[0];
  const { mouse_x, mouse_y } = getTouchPosition(touch);
  let found_hovered = false;

  balls.forEach(ball => {
    ball.hovered = ball.dragging || ball.isPointInside(mouse_x, mouse_y);
    ball.draw();
    if (ball.hovered) {
      found_hovered = true;
      general_hovered = true;
      document.getElementById("circle-content").innerHTML = ball.give_content();
      if (ball.dragging) {
        ball.x = mouse_x;
        ball.y = mouse_y;
      }
    }
  });

  general_hovered = found_hovered;
  e.preventDefault();  // Verhindert das Standardverhalten (z.B. Scrollen)
}

function handleTouchEnd() {
  general_dragged = false;
  balls.forEach(ball => {
    ball.dragging = false;
    ball.hovered = false;
  });
}

function handleMouseUp() {
  general_dragged = false;
  balls.forEach(ball => {
    ball.dragging = false;
    ball.hovered = false;
  });
}

function handleMouseDown(e) {
  const { mouse_x, mouse_y } = getMousePosition(e);
  general_dragged = balls.some(ball => {
    if (ball.isPointInside(mouse_x, mouse_y)) {
      ball.dragging = true;
      return true;
    }
    ball.dragging = false;
    return false;
  });
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