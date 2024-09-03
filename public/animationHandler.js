import { balls, matrix, sharedState } from "./state.js"; // Importieren des sharedState aus state.js
import { threeJsHandler} from "./main.js";
let raf;
export async function threejsanimation() {
  if (!sharedState.all_loaded) return;
  balls.forEach((ball) => {
    ball.new_target_position();
    ball.keep_distance();
    ball.follow();
    ball.updateDistrict();
    ball.change_circle_gravity();
    ball.change_circle_size();
    //console.log(sharedState.counter+"hallo");
    sharedState.counter = sharedState.counter + 1;
    sharedState.rotation_pos = (sharedState.rotation_pos + 0.000001) % 360;
  });
  threeJsHandler.updateScene(balls, matrix);
  if (threeJsHandler.getInfoHandlerUpdateStatus()){
    balls[threeJsHandler.getUpdatedFocusTopicID()] = threeJsHandler.getUpdatedFocusTopic();
    console.log("matrix before", matrix[threeJsHandler.getUpdatedFocusTopicID()],"  id",threeJsHandler.getUpdatedFocusTopicID());
    matrix[threeJsHandler.getUpdatedFocusTopicID()] = threeJsHandler.getUpdatedFocusTopic().child_links;
    threeJsHandler.setUpdateAvaiabilityFalse();
    console.log("matrix after", matrix[threeJsHandler.getUpdatedFocusTopicID()],"  id",threeJsHandler.getUpdatedFocusTopicID());
  }
  
  
  raf = window.requestAnimationFrame(threejsanimation);
}
