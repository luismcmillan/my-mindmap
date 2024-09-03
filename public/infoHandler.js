import { createVector } from "./cameraAndInfoHandler.js";
import { sharedState } from "./state.js";
import { SaveButton } from "./SaveButton.js";
import { DeleteButton } from "./DeleteButton.js";
import { EditButton } from "./EditButton.js";
import { CategoryDiv, NameDiv, ContentDiv } from "./CollectionDiv.js";
import { DropdownContainer } from "./DropDownContainer.js";
import { DropdownMenu } from "./DropDownMenu.js";
import { SearchField } from "./SearchField.js";
import { AddingCircleButton } from "./AddingCircleButton.js";
export class InfoHandler {
  constructor() {
    const canvasContainer = document.getElementById("canvas-container");
    this.name_to_id = new Map();
    this.clicked_link = null;
    this.is_link_clicked = false;

    this.activated = false;
    this.editMode = false;
    this.linkingMode = false;
    this.hovered = false;

    this.clicked_focus_topic = null;
    this.update_available = false;
    this.child_links_update = null;


    this.content =
      "Welcome to my Mindmap! Feel free to click on every circle :)";
    this.converted_content = "";
    this.name = "MIAU";
    this.categoryDiv = "WUFF";

    this.editButton = new EditButton(0, 0, canvasContainer, () => {
      this.editMode = !this.editMode;
      if (this.editMode) {
        this.contentDiv.setEditable(true); //.contentEditable = true;
        this.saveButton.show();
        this.deleteButton.show(); //.style.display = "block";
        this.nameDiv.setDisplay("block"); //.style.display = "block";
        this.categoryDiv.setDisplay("block"); //.style.display = "block";
        this.contentDiv.setContent(this.clicked_focus_topic.content); //.innerHTML = this.clicked_focus_topic.content;
      } else {
        this.contentDiv.setEditable(false); //.contentEditable = false;
        this.saveButton.hide();
        this.searchField.hide(); //.style.display = "none";
        this.deleteButton.hide(); //.style.display = "none";
        this.nameDiv.setDisplay("none"); //style.display = "none";
        this.categoryDiv.setDisplay("none"); //style.display = "none";
        this.contentDiv.setContent(this.converted_content); //.innerHTML = this.converted_content;
      }
    });
    this.saveButton = new SaveButton(0, 0, canvasContainer, () => {
        console.log("before ",this.clicked_focus_topic.child_links)
      this.clicked_focus_topic.name = this.nameDiv.getContent(); //.innerHTML;
      this.clicked_focus_topic.content = this.contentDiv.getContent(); //innerHTML;
      this.clicked_focus_topic.category = this.categoryDiv.getContent(); //.innerHTML;
      this.converted_content = this.ersetzeWortMitLink(this.clicked_focus_topic.content);
      console.log("new children ",this.findUniqueWords(this.clicked_focus_topic.content));
      this.child_links_update = this.findUniqueWords(this.clicked_focus_topic.content);
      this.update_available = true;
      console.log("update AVAILABLE",this.update_available)
      console.log(this.findUniqueWords(this.clicked_focus_topic.content));
    });
    this.deleteButton = new DeleteButton(0, 0, canvasContainer, () => {});
    this.searchField = new SearchField(canvasContainer);
    this.dropdown = new DropdownMenu(canvasContainer, this.searchField);
    this.dropdownContainer = new DropdownContainer(
      canvasContainer,
      this.searchField,
      this.dropdown
    ); //null; // Neu: Dropdown-Container
    this.categoryDiv = new CategoryDiv(
      this.dropdownContainer.getContainer(),
      "Default Category",
      () => {}
    );
    this.nameDiv = new NameDiv(
      this.dropdownContainer.getContainer(),
      "Default Name",
      () => {}
    );
    this.contentDiv = new ContentDiv(
      this.dropdownContainer.getContainer(),
      "Heyhi",
      (event) => {
        if (this.linkingMode && event.key === "Enter") {
          event.preventDefault(); // Verhindert die Default-Enter-Verhalten
        }
      }
    );
    this.addingCircleButton = new AddingCircleButton();
    this.content =
      "Welcome to my Mindmap! Feel free to click on every circle :)";
  }

  getUpdateStatus(){
    return this.update_available;
  }

  setUpdateAvailabilityFalse(){
    this.update_available = false;
  }

  getUpdatedFocusTopic(balls){
    const child_list = [];
    this.child_links_update.forEach((topic,id) => {
        child_list.push(balls[this.name_to_id.get(topic)]);
        console.log(topic+"   "+id);
    });
    this.clicked_focus_topic.child_links = child_list;
    return this.clicked_focus_topic;
  }

  isLinkClicked() {
    return this.dropdownContainer.isLinkClicked();
  }

  getClickedLinkId() {
    return this.name_to_id.get(this.dropdownContainer.getClickedLink());
  }

  setBalls(balls) {
    balls.forEach((ball) => {
      this.name_to_id.set(ball.name, ball.id);
      const option = document.createElement("option");
      option.value = ball.name;
      option.textContent = ball.name;
      this.dropdown.getDropDownMenu().appendChild(option);
    });
    this.dropdownContainer.setNameToID(this.name_to_id);
  }

  getHovered() {
    if (
      this.editButton.ishovered() ||
      this.saveButton.ishovered() ||
      this.deleteButton.ishovered() ||
      this.dropdown.ishovered() ||
      this.dropdownContainer.ishovered()
    ) {
      return true;
    } else {
      return false;
    }
  }

  changeActivity() {
    if (this.activated) {
      this.activated = false;
      this.dropdownContainer.setDisplay("none"); //.style.display = "none";
      this.editButton.hide(); //.style.display = "none";
      this.saveButton.hide();
      this.deleteButton.hide(); //this.deleteButton.style.display = "none";
    } else {
      this.activated = true;
      this.dropdownContainer.setDisplay("block"); //.style.display = "block";
      this.editButton.show(); //.style.display = "block";
    }
  }

  activate() {
    this.activated = true;
    this.dropdownContainer.setDisplay("block"); //.style.display = "block";
    this.editButton.show(); //.style.display = "block";
  }

  deactivate() {
    this.activated = false;
    this.dropdownContainer.setDisplay("none"); //.style.display = "none";
    this.editButton.hide(); //.style.display = "none";
  }

  deactivateEditMode() {
    this.editMode = false;
    this.contentDiv.setEditable(false); //.contentEditable = false;
    this.saveButton.hide();
    this.deleteButton.hide(); //this.deleteButton.style.display = "none";
    this.nameDiv.setDisplay("none"); //.style.display = "none";
    this.categoryDiv.setDisplay("none"); //.style.display = "none";
  }

  setFocusTopic(clicked_focus_topic) {
    this.clicked_focus_topic = clicked_focus_topic;
    this.categoryDiv.setContent(clicked_focus_topic.category); //.innerHTML = clicked_focus_topic.category;
    this.categoryDiv.setBackgroundColor(
      `#${sharedState.colors[this.categoryDiv.getContent()]
        .toString(16)
        .padStart(6, "0")}`
    ); //.style.backgroundColor = `#${sharedState.colors[this.categoryDiv.innerHTML].toString(16).padStart(6, '0')}`;

    //this.categoryDiv.style.backgroundColor = sharedState.colors[this.categoryDiv.innerHTML];
    console.log(clicked_focus_topic.name);
    this.nameDiv.setContent(clicked_focus_topic.name); //.innerHTML = clicked_focus_topic.name;

    this.content = clicked_focus_topic.content;
    this.converted_content = this.ersetzeWortMitLink(
      this.clicked_focus_topic.content
    ); //this.childDetector.
    console.log(this.converted_content);
    this.contentDiv.setContent(this.converted_content); //.innerHTML = this.converted_content;
    this.is_link_clicked = false;
  }

  adjustPosition(camera) {
    const containerVec = createVector(
      this.clicked_focus_topic.x + this.clicked_focus_topic.radius,
      this.clicked_focus_topic.y - 2 * this.clicked_focus_topic.radius
    );
    containerVec.project(camera);
    const container_x = ((containerVec.x + 1) / 2) * 2024;
    const container_y = ((containerVec.y * -1 + 1) / 2) * 2024;

    // Set position of dropdownContainer
    this.dropdownContainer.setPosition(container_x, container_y); //.style.left = `${container_x}px`;
    //this.dropdownContainer.style.top = `${container_y}px`;
    this.editButton.setScreenPosition(container_x, container_y - 40);
    this.saveButton.setScreenPosition(container_x + 40, container_y - 40);
    this.deleteButton.setScreenPosition(container_x + 80, container_y - 40);
    this.searchField.setPosition(container_x + 120, container_y - 40); //.style.left = `${container_x+ 120}px`;
    //this.searchField.style.top = `${container_y-40}px`;
    this.dropdown.setPosition(container_x + 120, container_y - 15); //.style.left = `${container_x+ 120}px`;
    //this.dropdown.style.top = `${container_y-15}px`;
  }

  updateContent(content) {
    this.content = content;
    this.contentDiv.innerHTML = content;
    this.repositionNameDiv();
  }

  repositionNameDiv() {
    const contentRect = this.contentDiv.getBoundingClientRect();
    const contentHeight = contentRect.height;
    const content_y = parseFloat(this.contentDiv.style.top);
    this.nameDiv.style.top = `${content_y + contentHeight + 10}px`; // +10 for some spacing
  }

  switchOffDisplaySetting() {
    this.contentDiv.setDisplay("none"); //.style.display = "block";
  }

  switchOnDisplaySetting() {
    this.contentDiv.setDisplay("block"); //.style.display = "block";
  }

  ersetzeWortMitLink(str) {
    const regex = /\[\[(.*?)\]\]/g;

    return str.replace(regex, (match, p1) => {
      // p1 enthält das Wort zwischen [[ und ]]
      return `<a href="#" class="link" data-word="${p1}">${p1}</a>`;
    });
  }

  findUniqueWords(text) {
    // Regex zum Finden von [[wort]]-Mustern
    const regex = /\[\[(.*?)\]\]/g;
    let matches = new Set(); // Set zur Vermeidung von Duplikaten
    let match;

    // Schleife, um alle Übereinstimmungen zu finden
    while ((match = regex.exec(text)) !== null) {
      matches.add(match[1]); // Das Wort zwischen [[ und ]] hinzufügen
    }

    // Die gefundenen Wörter als Array zurückgeben
    return Array.from(matches);
  }
}
