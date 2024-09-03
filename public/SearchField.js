export class SearchField {
    constructor(container) {
        this.searchField = document.createElement("input");
        this.searchField.style.position = "absolute";
        this.searchField.style.width = "100px";
        this.searchField.style.height = "30px";
        this.searchField.style.border = "none";
        this.searchField.style.left = `${0}px`;
        this.searchField.style.backgroundColor = "#f0f0f0";
        this.searchField.style.top = `${0}px`;
        this.searchField.style.zIndex = 11;
        this.searchField.style.display = "none";
        this.searchField.style.opacity = "0.5";
        this.searchField.value = "search";

        container.appendChild(this.searchField);

        this.hovered = false;
        
        // Event Listener für Hover
        this.searchField.addEventListener("mouseover", () => {
            this.hovered = true;
        });

        this.searchField.addEventListener("mouseout", () => {
            this.hovered = false;
        });

        this.searchField.addEventListener('focus', () => {
            this.dropdown.show();
        });
    }

    setValue(newValue){
        this.searchField.value = newValue;
    }

    getValue(){
        return this.searchField.value;
    }

    // Methoden zur Steuerung der Sichtbarkeit und Position
    show() {
        this.searchField.style.display = "block";
    }

    hide() {
        this.searchField.style.display = "none";
    }

    setPosition(left, top) {
        this.searchField.style.left = `${left}px`;
        this.searchField.style.top = `${top}px`;
    }

    onFocus(callback) {
        this.searchField.addEventListener('focus', callback);
    }

    onBlur(callback) {
        this.searchField.addEventListener('blur', callback);
    }
}
