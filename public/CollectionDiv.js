import { Div } from "./Div.js";
export class CategoryDiv extends Div {
    constructor(container, category = "Default Category", Callback) {
        super(container, category, true, "none"); // Content ist bearbeitbar
        this.div.addEventListener('click', Callback);
    }

    // Du kannst spezifische Methoden für CategoryDiv hinzufügen, falls nötig
}

export class NameDiv extends Div {
    constructor(container, name = "Default Name", Callback) {
        super(container, name, true, "none"); // Content ist bearbeitbar
        this.div.addEventListener('click', Callback);
    }

    // Du kannst spezifische Methoden für NameDiv hinzufügen, falls nötig
}

export class ContentDiv extends Div {
    constructor(container, content = "Welcome to my Mindmap!", Callback) {
        super(container, content, false, "none"); // Content ist nicht bearbeitbar
        this.div.addEventListener('click', Callback);
    }

    // Du kannst spezifische Methoden für ContentDiv hinzufügen, falls nötig
}