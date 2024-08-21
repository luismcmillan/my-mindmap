import circle from "./circle.js";
const canvas = document.getElementById("canvas");
var circle_size = document.getElementById("circle_size").value;
const ctx = canvas.getContext("2d");
var ctx_width = canvas.getAttribute("width");
var ctx_height = canvas.getAttribute("height");
ctx.strokeStyle = "gray";
let raf;
let general_dragged = false;
let general_hovered = false;
let all_loaded = false;
let running = false;
let lines_disappear_animation_done = false;
let starting_animation_done = false;
let animiation_color = 65;
let matrix;
const balls = [];
const map = new Map();
main();




async function main(){
  const jsoncontent = await loadJson();
  //Creates all circles
  var i = 0;
  for (const element of jsoncontent) {
    map.set(element.name, element.id);
    balls.push(
      new circle(
        element.id,
        element.category,
        element.is_boss,
        element.name,
        ctx_width / 2 +
          ctx_width * 0.45 * Math.sin((i / jsoncontent.length) * 2 * Math.PI),
        ctx_height / 2 +
          ctx_width * 0.45 * Math.cos((i / jsoncontent.length) * 2 * Math.PI),
        element.x_pos,
        element.y_pos,
        circle_size,
        element.content
      )
    );
    i++;
  }
  

  //Creates all connections
  for (const element of jsoncontent) {
    const children_list = [];
    const parent_list = [];
    for(const child of element.children){
      children_list.push(balls[map.get(child)]);
    }
    for(const parent of element.parents){
      parent_list.push(balls[map.get(parent)]);
    }
    balls[element.id].child_links= children_list;
    balls[element.id].parent_links= parent_list;
  }

  //Creates connectivity matrix
  matrix = Array.from({ length: balls.length }, () =>
    Array(balls.length).fill(0)
  );
  for(const ball of balls){
    let children_links = ball.get_child_links();
    for (let i = 0; i < children_links.length; i++) {
      matrix[ball.id][map.get(children_links[i].name)] = 1;
    } 
  }
  
  draw_all_lines(`rgb(${animiation_color} ${animiation_color} ${animiation_color}`);
  /*
  
  */
  
  all_loaded = true;
  for (const element of balls) {
    element.change_circle_size();
    element.draw();
  }

  

}







function clear() {
  ctx.fillStyle = "rgb(255 255 255 / 30%)";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

async function draw_line_between(ball1, ball2,color) {
  const old_strokestyle = ctx.strokeStyle;
  ctx.strokeStyle = color; // Farbe der Linie 
  ctx.moveTo(ball1.x, ball1.y);
  ctx.lineTo(ball2.x, ball2.y);
  ctx.stroke();
  ctx.strokeStyle = old_strokestyle;
}

async function draw() {
  console.log("draw");
  if (all_loaded){
    clear();
    
    draw_all_lines(`rgb(${animiation_color} ${animiation_color} ${animiation_color}`);

    for (let i = 0; i < matrix.length; i++) {
      balls[i].follow();
    }

    for (const element of balls) {
      element.change_circle_gravity();
      element.change_circle_size();
      element.draw();
      //draw_me(element);
    }
  raf = window.requestAnimationFrame(draw);
  }
  
}

async function animation() {
  if (all_loaded){
    if(general_hovered || !starting_animation_done){
      clear();
    }
    
    if ((animiation_color < 215 && !lines_disappear_animation_done) ){
      animiation_color +=10;
      draw_all_lines(`rgb(${animiation_color} ${animiation_color} ${animiation_color}`);
    }
    if ((lines_disappear_animation_done && animiation_color > 65) ){
      if (animiation_color > 65){
        animiation_color -=10;
      }
      draw_all_lines(`rgb(${animiation_color} ${animiation_color} ${animiation_color}`);
    }
    for (let i = 0; i < matrix.length; i++) {
      if (animiation_color == 215){
        balls[i].follow();
      }
    }
    if (animiation_color <= 65 && lines_disappear_animation_done){
      if (general_hovered){
        draw_all_lines(`rgb(${animiation_color} ${animiation_color} ${animiation_color}`);
      }
    }
    let found_out_of_position = false;
    for (const element of balls) {
      element.change_circle_gravity();
      element.change_circle_size();
      element.draw();
      
      if (!element.in_position){
        found_out_of_position = true;
      }
    }
    for (const element of balls) {
      element.show_text();
    }
    found_out_of_position ? lines_disappear_animation_done = false : lines_disappear_animation_done = true;
    if (animiation_color <= 65 && lines_disappear_animation_done){
      starting_animation_done = true;
    }
    raf = window.requestAnimationFrame(animation);
  }  
}

async function loadJson() {
  try {
    const response = await fetch("./obsidian_with_position.json");
    const jsonData = await response.json();
    return jsonData;
  } catch (error) {
    console.error("Fehler beim Laden der JSON-Datei:", error);
  }
}

canvas.addEventListener("mousemove", (e) => {
  if (all_loaded && !running && !starting_animation_done){
    raf = window.requestAnimationFrame(animation);
    running = true;
  }
  if (all_loaded && general_hovered) {
    clear();
    draw_all_lines(`rgb(${animiation_color} ${animiation_color} ${animiation_color}`);
  }
  
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const mouse_x = (e.clientX - rect.left)*scaleX;
  const mouse_y = (e.clientY - rect.top)*scaleY;
  let found_hovered = false;

  for (const element of balls) {
    element.hovered = element.dragging ||element.isPointInside(mouse_x, mouse_y);
    element.draw()
    if (element.hovered) {
      found_hovered = true;
      general_hovered = true;
      document.getElementById("circle-content").innerHTML = element.give_content();
      if (element.dragging == true) {
        element.x = mouse_x;
        element.y = mouse_y;
      }
    }
  }
  general_hovered = found_hovered ? true : false;
});

canvas.addEventListener("click", (e) => {
  if (!running) {
    raf = window.requestAnimationFrame(animation);
    running = true;
  }
});

window.addEventListener("scroll", (e) => {
  if (!running) {
    raf = window.requestAnimationFrame(animation);
    running = true;
  }
});

document.getElementById("myModal"),
  addEventListener("click", (e) => {
    if (!running) {
      raf = window.requestAnimationFrame(animation);
      running = true;
    }
  });

canvas.addEventListener("mouseout", (e) => {
  if (!running) {
    raf = window.requestAnimationFrame(animation);
    running = true;
  }
  /*
  for (const element of balls) {
    element.dragging = false;
  }
  window.cancelAnimationFrame(raf);
  running = false;
  */
});

canvas.addEventListener("mousedown", (e) => {
  let found_dragged = false;
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const mouse_x = (e.clientX - rect.left)*scaleX;
  const mouse_y = (e.clientY - rect.top)*scaleY;

  if (!general_dragged){
    for (const element of balls) {
      if (element.isPointInside(mouse_x, mouse_y)) {
        element.dragging = true;
        found_dragged = true;
      }else{
        element.dragging = false;
      }
    }
  }
  
  found_dragged ? general_dragged = true : general_dragged = false;
});



async function draw_all_lines(color) {
  
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix.length; j++) {
      if (matrix[i][j] == 1) {
        draw_line_between(balls[i], balls[j],color);//
      }
    }
  }
}



canvas.addEventListener("mouseup", (e) => {
  general_dragged = false;
  for (const element of balls) {
    element.dragging = false;
    element.hovered = false;
  }
});
