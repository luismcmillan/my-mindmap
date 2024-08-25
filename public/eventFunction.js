
import { balls, sharedState } from "./state.js"; // Importieren des sharedState aus state.js
import { animation } from "./animationHandler.js";
let raf;

function handleTouchStart(e) {
    const touch = e.touches[0];
    const { mouse_x, mouse_y } = getTouchPosition(touch);
    sharedState.general_dragged = balls.some(ball => {
      if (ball.isPointInside(mouse_x, mouse_y)) {
        ball.dragging = true;
        return true;
      }
      ball.dragging = false;
      return false;
    });
  }
  
  function handleMouseMove(e) {
    if (sharedState.all_loaded && !sharedState.running && !sharedState.starting_animation_done) {
      raf = window.requestAnimationFrame(animation);
      sharedState.running = true;
    }
  
    const { mouse_x, mouse_y } = getMousePosition(e);
    let found_hovered = false;
  
    balls.forEach(ball => {
      ball.hovered = ball.dragging || ball.isPointInside(mouse_x, mouse_y);
      ball.draw();
      if (ball.hovered) {
        found_hovered = true;
        sharedState.general_hovered = true;
        document.getElementById("circle-content").innerHTML = ball.give_content();
        if (ball.dragging) {
          ball.x = mouse_x;
          ball.y = mouse_y;
        }
      }
    });
  
    sharedState.general_hovered = found_hovered;
  }
  
  function handleTouchMove(e) {
    if (sharedState.all_loaded && !sharedState.running && !sharedState.starting_animation_done) {
      raf = window.requestAnimationFrame(animation);
      sharedState.running = true;
    }
  
    const touch = e.touches[0];
    const { mouse_x, mouse_y } = getTouchPosition(touch);
    let found_hovered = false;
  
    balls.forEach(ball => {
      ball.hovered = ball.dragging || ball.isPointInside(mouse_x, mouse_y);
      ball.draw();
      if (ball.hovered) {
        found_hovered = true;
        sharedState.general_hovered = true;
        document.getElementById("circle-content").innerHTML = ball.give_content();
        if (ball.dragging) {
          ball.x = mouse_x;
          ball.y = mouse_y;
        }
      }
    });
  
    sharedState.general_hovered = found_hovered;
    e.preventDefault();  // Verhindert das Standardverhalten (z.B. Scrollen)
  }
  
  function handleTouchEnd() {
    sharedState.general_dragged = false;
    balls.forEach(ball => {
      ball.dragging = false;
      ball.hovered = false;
    });
  }
  
  function handleMouseUp() {
    sharedState.general_dragged = false;
    balls.forEach(ball => {
      ball.dragging = false;
      ball.hovered = false;
    });
  }
  
  function handleMouseDown(e) {
    const { mouse_x, mouse_y } = getMousePosition(e);
    sharedState.general_dragged = balls.some(ball => {
      if (ball.isPointInside(mouse_x, mouse_y)) {
        ball.dragging = true;
        return true;
      }
      ball.dragging = false;
      return false;
    });
  }

  function getMousePosition(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mouse_x = (e.clientX - rect.left) * scaleX;
    const mouse_y = (e.clientY - rect.top) * scaleY;
    return { mouse_x, mouse_y };
  }
  
  function getTouchPosition(touch) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mouse_x = (touch.clientX - rect.left) * scaleX;
    const mouse_y = (touch.clientY - rect.top) * scaleY;
    return { mouse_x, mouse_y };
  }

  export { handleTouchStart, handleMouseMove, handleTouchMove, handleTouchEnd ,handleMouseUp, handleMouseDown};