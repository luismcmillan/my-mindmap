export class Button {
    constructor(width, height, imageUrl, hoverImageUrl, zIndex = 11) {
        this.button = document.createElement("button");
        this.button.style.position = "absolute";
        this.button.style.width = `${width}px`;
        this.button.style.height = `${height}px`;
        this.button.style.border = "none";
        this.button.style.borderRadius = "50%";
        this.button.style.backgroundImage = `url('${imageUrl}')`;
        this.button.style.backgroundSize = "cover";  // Bild füllt den gesamten Button aus
        this.button.style.backgroundPosition = "center";  // Bild wird zentriert
        this.button.style.backgroundRepeat = "no-repeat"; 
        this.button.style.zIndex = 11; 
        

        this.hoverImageUrl = hoverImageUrl;
        this.imageUrl = imageUrl;
        this.hovered = false;

        this.initHoverEffects();
    }

    initHoverEffects() {
        this.button.addEventListener("mouseover", () => {
            this.button.style.backgroundImage = `url('${this.hoverImageUrl}')`;
            this.hovered = true;
        });
        this.button.addEventListener("mouseout", () => {
            this.button.style.backgroundImage = `url('${this.imageUrl}')`;
            this.hovered = false;
        });
    }

    ishovered(){
        return this.hovered;
    }

    appendTo(container) {
        container.appendChild(this.button);
    }

    setScreenPosition(xPos,yPos){
        this.button.style.left = `${xPos}px`;
        this.button.style.top = `${yPos}px`;
    }
}