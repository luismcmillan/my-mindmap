import { balls,map,matrix, sharedState } from './state.js'; // Importieren des sharedState aus state.js

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const ctx_width = canvas.width;
const ctx_height = canvas.height;
const circle_size = document.getElementById("circle_size").value;

const lineWidth = 2;  // Einheitliche Linienstärke definiert
let raf;

export async function animation() {
    if (!sharedState.all_loaded) return;
  
    if (sharedState.general_hovered || !sharedState.starting_animation_done) clear();
    /*
    if (!sharedState.lines_disappear_animation_done && sharedState.animation_color < 215) {
        sharedState.animation_color += 10;
    } else if (sharedState.lines_disappear_animation_done && sharedState.animation_color > 65) {
        sharedState.animation_color -= 10;
    }
        */
  
    draw_all_lines(getColor());
  
    let found_out_of_position = false;
    balls.forEach(ball => {
      //if (sharedState.animation_color === 215) {
        ball.new_target_position();
        ball.follow();
        ball.keep_distance();

      //}
        
      ball.updateDistrict()
      ball.change_circle_gravity();
      ball.change_circle_size();
      ball.draw();
      
      // Text anzeigen
      ball.show_text();
      
      sharedState.rotation_pos = (sharedState.rotation_pos +0.000001)%360;
  
      if (!ball.in_position) found_out_of_position = true;
    });
  
    sharedState.lines_disappear_animation_done = !found_out_of_position;
    sharedState.starting_animation_done = sharedState.animation_color <= 65 && sharedState.lines_disappear_animation_done;
  
    raf = window.requestAnimationFrame(animation);
  }
  
  async function draw_line_between(ball1, ball2, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;  // Konstante Linienstärke setzen
    ctx.beginPath();
    ctx.moveTo(ball1.x, ball1.y);
    ctx.lineTo(ball2.x, ball2.y);
    ctx.stroke();
  }
  
  export function draw_all_lines(color) {
    balls.forEach((ball, i) => {
      matrix[i].forEach(linkedBall => {
        draw_line_between(ball, linkedBall, color);
      });
    });
  }
  
  export function getColor(){
    return `rgb(${sharedState.animation_color}, ${sharedState.animation_color}, ${sharedState.animation_color})`
  }

  

  function clear() {
    ctx.clearRect(0, 0, ctx_width, ctx_height);
  }