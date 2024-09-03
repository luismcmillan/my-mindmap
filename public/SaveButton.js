import { Button } from "./Button.js";
export class SaveButton extends Button {
    constructor(x, y, canvasContainer, saveCallback) {
        super( 30, 30, 'img/save_hover_off.png', 'img/save_hover_on.png');
        this.button.addEventListener('click', saveCallback);
        this.appendTo(canvasContainer);
        this.button.style.display = "none"; // Anfangs versteckt
        this.button.style.left = `${x}px`;
        this.button.style.top = `${y}px`;
    }

    show() {
        this.button.style.display = "block";
    }

    hide() {
        this.button.style.display = "none";
    }
}