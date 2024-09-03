import { Button } from "./Button.js";
export class DeleteButton extends Button {
    constructor(x, y, canvasContainer, deleteCallback) {
        super( 30, 30, 'img/delete_hover_off.png', 'img/delete_hover_on.png');
        this.button.addEventListener('click', deleteCallback);
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