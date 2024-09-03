import { Button } from "./Button.js";
export class AddingCircleButton {
    constructor() {
        this.imageUrl = 'img/adding_hover_off.png';
        this.hoverImageUrl = 'img/adding_hover_on.png';
        this.addingButton = document.createElement("button");
        this.addingButton.style.position = "fixed"; // Fixierte Position unabhängig vom Scrollen
        this.addingButton.style.bottom = "80px"; // Abstand zum unteren Rand
        this.addingButton.style.right = "40px";  // Abstand zum rechten Rand
        this.addingButton.style.width = "50px";  // Kreis-Durchmesser
        this.addingButton.style.height = "50px"; // Kreis-Durchmesser
        this.addingButton.style.borderRadius = "50%"; // Um den Button rund zu machen
        this.addingButton.style.border = "none";  // Optional: keine sichtbare Umrandung
        this.addingButton.style.backgroundImage = `url('${this.imageUrl}')`;
        this.addingButton.style.backgroundSize = "cover";  // Bild füllt den gesamten Button aus
        this.addingButton.style.backgroundPosition = "center";  // Bild wird zentriert
        this.addingButton.style.backgroundRepeat = "no-repeat"; 
        this.addingButton.style.fontSize = "24px"; // Schriftgröße
        this.addingButton.style.cursor = "pointer"; // Zeiger ändern beim Hover
        this.addingButton.style.zIndex = 11; // Über andere Elemente legen
    
        // Optional: Füge eine Aktion hinzu, wenn der Button geklickt wird
        this.addingButton.addEventListener("click", () => {
            alert("Floating Button Clicked!");
        });

        document.body.appendChild(this.addingButton);
        this.initHoverEffects();
    }

    initHoverEffects() {
        this.addingButton.addEventListener("mouseover", () => {
            this.addingButton.style.backgroundImage = `url('${this.hoverImageUrl}')`;
        });
        this.addingButton.addEventListener("mouseout", () => {
            this.addingButton.style.backgroundImage = `url('${this.imageUrl}')`;
        });
    }
}
