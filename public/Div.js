export class Div {
    constructor(container, content = "", editable = false, display = "none") {
        this.div = document.createElement("div");
        this.div.style.position = "relative";
        this.div.style.padding = "10px";
        this.div.style.border = "1px solid black";
        this.div.style.backgroundColor = "white";
        this.div.style.zIndex = 10;
        this.div.contentEditable = editable;
        this.div.style.display = display;
        this.div.innerHTML = content;

        container.appendChild(this.div);
    }

    setEditable(editable) {
        this.div.contentEditable = editable;
    }

    setDisplay(display) {
        this.div.style.display = display;
    }

    setContent(content) {
        this.div.innerHTML = content;
    }

    setBackgroundColor(color) {
        this.div.style.backgroundColor = color;
    }

    getContent() {
        return this.div.innerHTML;
    }
}