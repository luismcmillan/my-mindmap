export class DropdownContainer {
    constructor(container,searchField,dropdown) {
        this.dropdownContainer = document.createElement("div");
        this.dropdownContainer.style.position = "absolute";
        this.dropdownContainer.style.left = `${0}px`;
        this.dropdownContainer.style.top = `${0}px`;
        this.dropdownContainer.style.padding = "10px";
        this.dropdownContainer.style.border = "1px solid black";
        this.dropdownContainer.style.backgroundColor = "white";
        this.dropdownContainer.style.zIndex = 9;
        this.hovered = false;
        this.is_link_clicked = false;
        this.clicked_link = null;
        this.searchField = searchField;
        this.dropdown = dropdown;
        this.name_to_id = null;

        container.appendChild(this.dropdownContainer);

        this.dropdownContainer.addEventListener("mouseover", () => {
            this.hovered = true;
        });

        this.dropdownContainer.addEventListener("mouseout", () => {
            this.hovered = false;
        });

        this.dropdownContainer.addEventListener('click', (event) => {
            if (event.target.classList.contains('link')) {
                console.log("LINK CLICKED");
                this.is_link_clicked = true;
                event.preventDefault();
                this.clicked_link = event.target.getAttribute('data-word');
            } else {
                this.is_link_clicked = false;
            }
        });

        this.dropdownContainer.addEventListener('keydown', (event) => this.handleBracketAutoComplete(event));
    }

    setNameToID(name_to_id){
        this.name_to_id =name_to_id;
    }

    isLinkClicked(){
        return this.is_link_clicked;
    }

    ishovered(){
        return this.hovered;
    }

    // Methode zur Steuerung des Hintergrunds
    setBackgroundColor(color) {
        this.dropdownContainer.style.backgroundColor = color;
    }

    // Methode zur Steuerung der Position
    setPosition(left, top) {
        this.dropdownContainer.style.left = `${left}px`;
        this.dropdownContainer.style.top = `${top}px`;
    }

    // Methode zur Anpassung der Darstellung
    setDisplay(display) {
        this.dropdownContainer.style.display = display;
    }

    // Automatischer Abschluss von Klammern (aus der Originalfunktion)
    handleBracketAutoComplete(event) {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
    
        // Aktuelle Textposition
        const textNode = range.startContainer;
    
        // Text links und rechts vom Cursor
        const textBeforeCursor = textNode.textContent.slice(0, range.startOffset);
        const textAfterCursor = textNode.textContent.slice(range.startOffset); // Text rechts vom Cursor
    
        const isCharacterInput = /^[a-zA-Z0-9!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]$/.test(event.key);
    
        if (event.key === "[") {
            this.searchField.show();//.style.display = "block";
            event.preventDefault(); // Verhindert das Standardverhalten
            const bracketTextNode = document.createTextNode("[]");
            range.insertNode(bracketTextNode); // Füge '[]' an der aktuellen Cursor-Position ein
            range.setStart(bracketTextNode, 1); // Setze den Cursor zwischen die beiden Klammern
            range.setEnd(bracketTextNode, 1);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    
        let value = "";
        if (isCharacterInput) {
            value = textBeforeCursor + event.key + textAfterCursor; // Gesamter Text inklusive eingegebener Taste
            this.searchField.setValue(this.checkAndRemoveBrackets(value,textAfterCursor));//.setVa.value = this.checkAndRemoveBrackets(value,textAfterCursor);
            this.filterDropdown(this.searchField.getValue());
        } else {
            if (event.key === "Backspace"){
                value = textBeforeCursor.slice(0, -1) + textAfterCursor;
            }else{
                value = textBeforeCursor + textAfterCursor;
            }  
            this.searchField.setValue(this.checkAndRemoveBrackets(value,textAfterCursor));//.value = this.checkAndRemoveBrackets(value,textAfterCursor);
            this.filterDropdown(this.searchField.getValue());//.value);
        }
    
        if (event.key === "Enter" && this.dropdown.getDropDownMenu().options.length > 0 && this.linkingMode) {
            const dropdownValue = this.dropdown.getValue();
    
            // Text vor dem Cursor leeren
            let newValue = "["+dropdownValue + textAfterCursor; // Füge den Dropdown-Wert vor dem Cursor ein
            newValue = newValue.replace(/[\r\n]+/g, '');
            textNode.textContent = newValue;
            const newRange = document.createRange();
            const newCursorPosition = dropdownValue.length + 2;
            newRange.setStart(textNode, newCursorPosition);//dropdownValue.length); // Cursor hinter dem neuen Wert setzen
            newRange.setEnd(textNode, newCursorPosition);//dropdownValue.length);
            selection.removeAllRanges();
            selection.addRange(newRange);
            this.dropdown.hide();
            this.searchField.setValue("search");//.value = "search";
        }
    }

    checkAndRemoveBrackets(str,textAfterCursor) {
        // Überprüfen, ob der String länger als 1 Zeichen ist

        const openBracketsCount = str.split("[").length - 1;
        const closeBracketsCount = str.split("]").length - 1;
        if (openBracketsCount != 1|| closeBracketsCount != 1 || openBracketsCount != closeBracketsCount) {
            this.linkingMode = false;
            this.searchField.hide();//.style.display = "none";
            return "";
        }

        if (str[0] != "[" || str[str.length - 1] != "]" || !textAfterCursor.includes("]")){
            this.linkingMode = false;
            this.searchField.hide();//.style.display = "none";
            return "";
        }

        if (str.length < 2) {
            this.linkingMode = false;
            this.searchField.hide();//.style.display = "none";
            return "";
        }
        
        // Überprüfen, ob das erste Zeichen "[" und das letzte Zeichen "]" ist
        if (str[0] === "[" && str[str.length - 1] === "]") {
            this.searchField.show();//.style.display = "block";
            this.linkingMode = true;
            // Entfernt das erste und das letzte Zeichen
            return str.slice(1, -1);
        }
    
        // Wenn die Bedingung nicht erfüllt ist, den Originalstring zurückgeben
        this.linkingMode = false;
        this.searchField.hide();//.style.display = "none";
        return "";
    }

    filterDropdown(searchTerm) {
        const lowerSearchTerm = searchTerm.toLowerCase();
    
        // Leere zuerst das Dropdown
        this.dropdown.setInnerHTML('');
    
        // Durchlaufe die Map und filtere nach dem Suchbegriff
        this.name_to_id.forEach((id, name) => {
            if (name.toLowerCase().includes(lowerSearchTerm)) {
                const option = document.createElement("option");
                option.value = name;
                option.textContent = name;
                this.dropdown.getDropDownMenu().appendChild(option);
            }
                
        });
        if(this.dropdown.getDropDownMenu().options.length > 0 && searchTerm.length > 0){
            this.dropdown.show();//.style.display = "block";
            this.dropdown.getDropDownMenu().selectedIndex = 0;
        }else{
            this.dropdown.hide();//.style.display = "none";
        }
    }

    // Methode, um herauszufinden, ob eine Link geklickt wurde
    wasLinkClicked() {
        return this.is_link_clicked;
    }

    // Methode, um das geklickte Link-Wort abzurufen
    getClickedLink() {
        return this.clicked_link;
    }

    getContainer(){
        return this.dropdownContainer;
    }
}
