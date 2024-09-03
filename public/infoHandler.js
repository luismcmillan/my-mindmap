import { createVector } from "./cameraAndInfoHandler.js";
import { sharedState } from "./state.js";
export class InfoHandler {
    constructor() {
        this.name_to_id = new Map();
        this.clicked_link = null;
        this.is_link_clicked = false;

        this.activated = false;
        this.editMode = false;
        this.hovered = false;

        this.clicked_focus_topic = null;
        this.content = "Welcome to my Mindmap! Feel free to click on every circle :)";
        this.converted_content = "";
        this.name = "MIAU";
        this.categoryDiv = "WUFF";

        this.editButton = null; 
        this.saveButton = null;
        this.deleteButton = null;
        this.categoryDiv = null;
        this.nameDiv = null;
        this.contentDiv = null;
        this.circleButton = null;
        this.dropdownContainer = null; // Neu: Dropdown-Container
        this.content = "Welcome to my Mindmap! Feel free to click on every circle :)";
        this.createDropdownContainer(); // Neu: Methode zum Erstellen des Dropdowns
        this.createCategoryDiv()
        this.createNameDiv();
        this.createContentDiv();
        this.createEditButton(); 
        this.createSaveButton();
        this.createDeleteButton();
        this.createFloatingCircleButton();

        //this.childDetector = new ChildDetector(this.dropdownContainer);
        //this.childDetector.initLinks();
    }

    isLinkClicked(){
        return this.is_link_clicked;
    }

    getClickedLinkId(){
        return this.name_to_id.get(this.clicked_link);
    }

    setBalls(balls){
        balls.forEach((ball) => {
            this.name_to_id.set(ball.name,ball.id);
        });
    }

    getHovered(){
        return this.hovered;
    }

    changeActivity(){
        if(this.activated){
            this.activated = false;
            console.log("inaktiv");
            this.dropdownContainer.style.display = "none";
            this.editButton.style.display = "none";
            this.saveButton.style.display = "none";
            this.deleteButton.style.display = "none";
        }else {
            this.activated = true;
            this.dropdownContainer.style.display = "block";
            this.editButton.style.display = "block";
            console.log("aktiv");
        }
    }

    activate(){
        this.activated = true;
        this.dropdownContainer.style.display = "block";
        this.editButton.style.display = "block";
    }

    deactivate(){
        this.activated = falce;
        this.dropdownContainer.style.display = "none";
        this.editButton.style.display = "none";
    }

    deactivateEditMode(){
        this.editMode = false;
        this.saveButton.style.display = "none";
        this.deleteButton.style.display = "none";
        this.nameDiv.style.display = "none"; 
        this.categoryDiv.style.display = "none"; 
    }

    setFocusTopic(clicked_focus_topic) {
        this.clicked_focus_topic = clicked_focus_topic;
        this.categoryDiv.innerHTML = clicked_focus_topic.category;
        this.categoryDiv.style.backgroundColor = `#${sharedState.colors[this.categoryDiv.innerHTML].toString(16).padStart(6, '0')}`;

        //this.categoryDiv.style.backgroundColor = sharedState.colors[this.categoryDiv.innerHTML];
        this.nameDiv.innerHTML = clicked_focus_topic.name;

        this.content = clicked_focus_topic.content;
        this.converted_content = this.ersetzeWortMitLink(clicked_focus_topic.content); //this.childDetector.
        this.contentDiv.innerHTML = this.converted_content;
        this.is_link_clicked = false;

        
        //const children = this.childDetector.extractBracketedWords(clicked_focus_topic.content);
    //console.log(result); // Ausgabe: ["Beispiel", "mehreren", "Wörtern"]
        //console.log("childDetector",children);
    }

    adjustPosition(camera) {
        const containerVec = createVector(this.clicked_focus_topic.x + this.clicked_focus_topic.radius, this.clicked_focus_topic.y - 2* this.clicked_focus_topic.radius);
        containerVec.project(camera);
        const container_x = (containerVec.x + 1) / 2 * 2024;
        const container_y = (containerVec.y * (-1) + 1) / 2 * 2024;

        // Set position of dropdownContainer
        this.dropdownContainer.style.left = `${container_x}px`;
        this.dropdownContainer.style.top = `${container_y}px`;
        this.editButton.style.left = `${container_x}px`; // -40 für Abstand links vom contentDiv
        this.editButton.style.top = `${container_y-40}px`; // gleiche Höhe wie contentDiv
        this.saveButton.style.left = `${container_x+ 40}px`; // -40 für Abstand links vom contentDiv
        this.saveButton.style.top = `${container_y-40}px`;
        this.deleteButton.style.left = `${container_x+ 80}px`; // -40 für Abstand links vom contentDiv
        this.deleteButton.style.top = `${container_y-40}px`;
    }

    updateContent(content) {
        this.content = content;
        this.contentDiv.innerHTML = content;

        // Reposition nameDiv if needed
        this.repositionNameDiv();
    }

    repositionNameDiv() {
        const contentRect = this.contentDiv.getBoundingClientRect();
        const contentHeight = contentRect.height;
        const content_y = parseFloat(this.contentDiv.style.top);
        this.nameDiv.style.top = `${content_y + contentHeight + 10}px`; // +10 for some spacing
    }

    switchOffDisplaySetting() {
        this.contentDiv.style.display = "block";
    }

    switchOnDisplaySetting() {
        this.contentDiv.style.display = "block";
    }

    // Neu: Dropdown-Container für mehrere Divs
    createDropdownContainer() {
        const canvasContainer = document.getElementById('canvas-container');
        this.dropdownContainer = document.createElement("div");
        this.dropdownContainer.style.position = "absolute";
        this.dropdownContainer.style.left = `${0}px`;
        this.dropdownContainer.style.top = `${0}px`;
        this.dropdownContainer.style.padding = "10px";
        this.dropdownContainer.style.border = "1px solid black";
        this.dropdownContainer.style.backgroundColor = "white";
        this.dropdownContainer.style.zIndex = 9;
        canvasContainer.appendChild(this.dropdownContainer);

        // Neu: Dropdown-Toggle-Button
        const dropdownToggle = document.createElement("button");
        dropdownToggle.innerHTML = "Toggle Info";
        dropdownToggle.style.display = "block";
        dropdownToggle.addEventListener("click", () => {
            // Umschalten der Sichtbarkeit der Inhalte im Dropdown
            const isHidden = this.dropdownContainer.style.display === "none";
            this.dropdownContainer.style.display = isHidden ? "block" : "none";
        });

        canvasContainer.appendChild(dropdownToggle);

        this.dropdownContainer.addEventListener("mouseover", () => {
            this.hovered = true;
        });

        this.dropdownContainer.addEventListener("mouseout", () => {
            this.hovered = false;
        });

        this.dropdownContainer.addEventListener('click', (event) => {
            if (event.target.classList.contains('link')) {
                this.is_link_clicked = true;
                event.preventDefault();
                this.clicked_link = event.target.getAttribute('data-word');
                //console.log("MIAU CLICK ", this.clicked_link);
            }else {
                this.is_link_clicked = false;
            }
        });
    }

    createContentDiv() {
        this.contentDiv = document.createElement("div");
        this.contentDiv.style.position = "relative"; // Relativ zu dropdownContainer
        this.contentDiv.style.padding = "10px";
        this.contentDiv.style.border = "1px solid black";
        this.contentDiv.style.backgroundColor = "white";
        this.contentDiv.innerHTML = this.content;
        this.contentDiv.style.zIndex = 10;
        this.contentDiv.contentEditable = false;
        this.contentDiv.style.display = "none"; // Initial sichtbar

        // Neu: ContentDiv wird dem Dropdown-Container hinzugefügt
        this.dropdownContainer.appendChild(this.contentDiv);
    }

    createNameDiv() {
        this.nameDiv = document.createElement("div");
        this.nameDiv.style.position = "relative"; // Relativ zu dropdownContainer
        this.nameDiv.style.padding = "10px";
        this.nameDiv.style.border = "1px solid black";
        this.nameDiv.style.backgroundColor = "white";
        this.nameDiv.innerHTML = "Default Name";
        this.nameDiv.style.zIndex = 10;
        this.nameDiv.contentEditable = true;
        this.nameDiv.style.display = "none"; 
        this.dropdownContainer.appendChild(this.nameDiv); 
        

        // Neu: NameDiv wird dem Dropdown-Container hinzugefügt
        //this.dropdownContainer.appendChild(this.nameDiv);
    }

    createCategoryDiv() {
        this.categoryDiv = document.createElement("div");
        this.categoryDiv.style.position = "relative"; // Relativ zu dropdownContainer
        this.categoryDiv.style.padding = "10px";
        this.categoryDiv.style.border = "1px solid black";
        this.categoryDiv.style.backgroundColor = "white";
        this.categoryDiv.innerHTML = "Default Name";
        this.categoryDiv.style.zIndex = 10;
        this.categoryDiv.contentEditable = true;
        this.categoryDiv.style.display = "none"; 
        this.dropdownContainer.appendChild(this.categoryDiv); 
    }

    createEditButton() {
        const canvasContainer = document.getElementById('canvas-container');
        this.editButton = document.createElement("button");
        this.editButton.style.position = "absolute";
        this.editButton.style.width = "30px";
        this.editButton.style.height = "30px";
        this.editButton.style.border = "none";
        this.editButton.style.borderRadius = "50%";
        this.editButton.style.backgroundImage = "url('img/edit.png')";
        this.editButton.style.backgroundSize = "cover";  // Bild füllt den gesamten Button aus
        this.editButton.style.backgroundPosition = "center";  // Bild wird zentriert
        this.editButton.style.backgroundRepeat = "no-repeat"; 
        this.editButton.style.left = `${0}px`; // Erstes Setzen auf 0, Position später aktualisieren
        this.editButton.style.top = `${0}px`;
        this.editButton.style.zIndex = 11; 
        canvasContainer.appendChild(this.editButton);

        this.editButton.addEventListener("mouseover", () => {
            this.hovered = true;
        });

        this.editButton.addEventListener("mouseout", () => {
            this.hovered = false;
        });

        this.editButton.addEventListener("click", () => {
            if (this.editMode == true) {
                this.editMode = false;
                
            } else {
                this.editMode = true;
                
            }
            
            if (this.editMode) {
                console.log("added name");
                //this.dropdownContainer.insertBefore(this.nameDiv, this.contentDiv);
                //this.dropdownContainer.insertBefore(this.categoryDiv, this.nameDiv);
                this.contentDiv.contentEditable = true;
                this.saveButton.style.display = "block";
                this.deleteButton.style.display = "block";
                this.nameDiv.style.display = "block"; 
                this.categoryDiv.style.display = "block"; 
                this.contentDiv.innerHTML = this.content;
                
            } else {
                console.log("removed name");
                //this.dropdownContainer.removeChild(this.categoryDiv);
                //this.dropdownContainer.removeChild(this.nameDiv);
                this.contentDiv.contentEditable = false;
                this.saveButton.style.display = "none";
                this.deleteButton.style.display = "none";
                this.nameDiv.style.display = "none"; 
                this.categoryDiv.style.display = "none"; 
                this.contentDiv.innerHTML = this.converted_content;
            }
        });
    }

    createSaveButton() {
        const canvasContainer = document.getElementById('canvas-container');
        this.saveButton = document.createElement("button");
        this.saveButton.style.position = "absolute";
        this.saveButton.style.width = "30px";
        this.saveButton.style.height = "30px";
        this.saveButton.style.border = "none";
        this.saveButton.style.borderRadius = "50%";
        this.saveButton.style.left = `${0}px`; // Erstes Setzen auf 0, Position später aktualisieren
        this.saveButton.style.top = `${0}px`;
        this.saveButton.style.backgroundImage = "url('img/save.png')";
        this.saveButton.style.backgroundSize = "cover";  // Bild füllt den gesamten Button aus
        this.saveButton.style.backgroundPosition = "center";  // Bild wird zentriert
        this.saveButton.style.backgroundRepeat = "no-repeat"; 
        this.saveButton.style.zIndex = 11; 
        this.saveButton.style.display = "none";
        canvasContainer.appendChild(this.saveButton);
        this.saveButton.addEventListener("click", () => {
            this.clicked_focus_topic.name = this.nameDiv.innerHTML;
            this.clicked_focus_topic.content = this.contentDiv.innerHTML;
            this.clicked_focus_topic.category = this.categoryDiv.innerHTML;
        });

        this.saveButton.addEventListener("mouseover", () => {
            this.hovered = true;
        });

        this.saveButton.addEventListener("mouseout", () => {
            this.hovered = false;
        });
    }

    createDeleteButton() {
        const canvasContainer = document.getElementById('canvas-container');
        this.deleteButton = document.createElement("button");
        //this.deleteButton.innerHTML = "Delete";
        this.deleteButton.style.position = "absolute";
        this.deleteButton.style.width = "30px";
        this.deleteButton.style.height = "30px";
        this.deleteButton.style.borderRadius = "50%";
        this.deleteButton.style.border = "none";
        this.deleteButton.style.left = `${0}px`; // Erstes Setzen auf 0, Position später aktualisieren
        this.deleteButton.style.backgroundImage = "url('img/delete.png')";
        this.deleteButton.style.backgroundSize = "cover";  // Bild füllt den gesamten Button aus
        this.deleteButton.style.backgroundPosition = "center";  // Bild wird zentriert
        this.deleteButton.style.backgroundRepeat = "no-repeat"; 
        //this.deleteButton.style.backgroundColor = "#ff0000"; // Farbe des Buttons
        this.deleteButton.style.top = `${0}px`;
        this.deleteButton.style.zIndex = 11; 
        this.deleteButton.style.display = "none";
        canvasContainer.appendChild(this.deleteButton);

        this.deleteButton.addEventListener("mouseover", () => {
            this.hovered = true;
            console.log("hover");
        });

        this.deleteButton.addEventListener("mouseout", () => {
            this.hovered = false;
            console.log("away");
        });
    }

    createFloatingCircleButton() {
        this.circleButton = document.createElement("button");
        this.circleButton.innerHTML = "+";
        this.circleButton.style.position = "fixed"; // Fixierte Position unabhängig vom Scrollen
        this.circleButton.style.bottom = "80px"; // Abstand zum unteren Rand
        this.circleButton.style.right = "40px";  // Abstand zum rechten Rand
        this.circleButton.style.width = "50px";  // Kreis-Durchmesser
        this.circleButton.style.height = "50px"; // Kreis-Durchmesser
        this.circleButton.style.borderRadius = "50%"; // Um den Button rund zu machen
        this.circleButton.style.border = "none";  // Optional: keine sichtbare Umrandung
        this.circleButton.style.backgroundColor = "#007BFF"; // Farbe des Buttons
        this.circleButton.style.color = "white"; // Textfarbe
        this.circleButton.style.fontSize = "24px"; // Schriftgröße
        this.circleButton.style.cursor = "pointer"; // Zeiger ändern beim Hover
        this.circleButton.style.zIndex = 11; // Über andere Elemente legen
    
        // Optional: Füge eine Aktion hinzu, wenn der Button geklickt wird
        this.circleButton.addEventListener("click", () => {
            alert("Floating Button Clicked!");
        });

        document.body.appendChild(this.circleButton);
    }

    ersetzeWortMitLink(str) {
        const regex = /\[\[(.*?)\]\]/g;

        return str.replace(regex, (match, p1) => {
            // p1 enthält das Wort zwischen [[ und ]]
            return `<a href="#" class="link" data-word="${p1}">${p1}</a>`;
        });
    }


    
}


