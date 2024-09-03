import * as THREE from "../libs/three.module.js";
import { InfoHandler } from "./infoHandler.js";

export class CameraAndInfoHandler {
    constructor() {
        this.camera = new THREE.PerspectiveCamera(
            40,
            1024 / 1024,
            0.1,
            10000 // Erhöht den Farbbereich für Zoom
          );
        this.camera_target_position = createVector(0,0);
        this.camera_v = 0.1;
        this.camera.near = 0.1;
        this.target_achieved = false;
        this.createCamera();

        this.infoHandler = new InfoHandler();
    }

    setBalls(balls){
        this.infoHandler.setBalls(balls)
    }

    getUpdateStatus(){
        return this.infoHandler.getUpdateStatus();
    }

    setUpdateStatusFalse(){
        this.infoHandler.setUpdateAvailabilityFalse();
    }

    getUpdatedFocusTopic(balls){
        return this.infoHandler.getUpdatedFocusTopic(balls);
    }

    getClickedLinkId(){
        return this.infoHandler.getClickedLinkId();
    }

    isLinkClicked(){
        return this.infoHandler.isLinkClicked();
    }

    getInfoHandlerHovered(){
        return this.infoHandler.getHovered();
    }

    changeInfoHandlerActivity(){
        this.infoHandler.changeActivity();
    }

    deactivateInfoHandlerEditMode(){
        this.infoHandler.deactivateEditMode();
    }

    deactivateInfoHandler(){
        this.infoHandler.deactivate();
    }

    activateInfoHandlerActivity(){
        this.infoHandler.activate();
    }

    updateFocusTopic(clicked_focus_topic){
        this.infoHandler.setFocusTopic(clicked_focus_topic);
    }

    getCamera(){
        return this.camera;
    }

    createCamera(){
        
          this.camera.position.x = 0;
          this.camera.position.y = 0;
          this.camera.position.z = 2000;
    }

    adjustPosition(adjust_x, adjust_y, renderer){
        this.camera.position.x = this.camera.position.x + adjust_x;
        this.camera.position.y = this.camera.position.y + adjust_y;
        this.infoHandler.adjustPosition(this.camera,renderer);//-adjust_x,adjust_y,this.camera,renderer);
        //this.changeInfoDivPosition(new_info_position, renderer);
    }

    infoHandlerPOS(){
        this.infoHandler.adjustPosition(this.camera);//,renderer);//-adjust_x,adjust_y,this.camera,renderer);
    }

    adjustTarget(adjust_x, adjust_y){
        this.camera_target_position.x = this.camera_target_position.x + adjust_x;
        this.camera_target_position.y = this.camera_target_position.y + adjust_y;
    }

    setTarget(target){
        this.camera_target_position.x = target.x;
        this.camera_target_position.y = target.y;
    }

    camerafollow(){
        const distance = Math.sqrt(
            (this.camera_target_position.x - this.camera.position.x) ** 2 + (this.camera_target_position.y - this.camera.position.y) ** 2
        );
        if (distance > 5) {
            const deltaX = this.camera.position.x - this.camera_target_position.x;
            const deltaY = this.camera.position.y - this.camera_target_position.y;
            const totalDelta = Math.abs(deltaX) + Math.abs(deltaY);
    
            this.camera.position.x -= this.camera_v * (deltaX / totalDelta);
            this.camera.position.y -= this.camera_v * (deltaY / totalDelta);
            //this.infoHandler.switchOffDisplaySetting();
        } else if ( distance < 5) {
            this.camera.position.x = this.camera_target_position.x;
            this.camera.position.y = this.camera_target_position.y;
            this.target_achieved = true;
            this.infoHandler.switchOnDisplaySetting();
        }
    
        if (this.camera_v < 5) {
            this.camera_v += 0.05;
            this.camera_v += 0.05;
        }
      }
    updateInfoContent(content){
        this.infoHandler.updateContent(content);
    }

    switchOnInfo(){
        this.infoHandler.switchOnDisplaySetting();
    }

}
export function createVector(x, y) {
    return new THREE.Vector3(x, y, 1);
  }
