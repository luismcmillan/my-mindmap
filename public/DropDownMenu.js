export class DropdownMenu {
    constructor(container,searchField) {
        this.dropdown = document.createElement("select");
        this.dropdown.style.position = "absolute";
        this.dropdown.style.width = "100px";
        this.dropdown.style.maxHeight = "120px";
        this.dropdown.style.overflowY = "auto";
        this.dropdown.style.display = "none";
        this.dropdown.size = 5;
        this.dropdown.style.left = `${0}px`;
        this.dropdown.style.top = `${0}px`;
        this.dropdown.style.zIndex = 12;
        this.dropdown.style.backgroundColor = "#fff";
        this.dropdown.style.border = "1px solid #ccc";
        this.searchField = searchField;

        container.appendChild(this.dropdown);

        this.hovered = false;

        // Event Listener für Hover
        this.dropdown.addEventListener("mouseover", () => {
            this.hovered = true;
        });

        this.dropdown.addEventListener("mouseout", () => {
            this.hovered = false;
        });

        this.dropdown.addEventListener('click', () => this.handleDropDownSelection());
    }

    ishovered(){
        return this.hovered;
    }

    setInnerHTML(str){
        this.dropdown.innerHTML = str;
    }

    getDropDownMenu(){
        return this.dropdown;
    }

    getValue(){
        return this.dropdown.value;
    }

    // Methoden zur Steuerung der Sichtbarkeit und Position
    show() {
        this.dropdown.style.display = "block";
    }

    hide() {
        this.dropdown.style.display = "none";
    }

    setPosition(left, top) {
        this.dropdown.style.left = `${left}px`;
        this.dropdown.style.top = `${top}px`;
    }

    onClick(callback) {
        this.dropdown.addEventListener('click', callback);
    }

    handleDropDownSelection(){
        const selectedOption = this.dropdown.value;
        this.searchField.value = selectedOption;
    
        // Setze den Text innerhalb der Klammern auf die ausgewählte Option
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);

        const textNode = range.startContainer;
    
        // Text links und rechts vom Cursor
        //const textBeforeCursor = textNode.textContent.slice(0, range.startOffset);
        const textAfterCursor = textNode.textContent.slice(range.startOffset);
        let newValue = "["+this.dropdown.value + textAfterCursor;
        textNode.textContent = newValue;
        this.dropdown.style.display = "none";
        this.searchField.value = "search";
    }
}
