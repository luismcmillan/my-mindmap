import { sharedState, location, balls, canvasSize } from "./state.js";

export default class Circle {
  constructor(
    id,
    category,
    is_boss,
    priority,
    name,
    x,
    y,
    district_x,
    district_y,
    target_x,
    target_y,
    size,
    content
  ) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.district_x = district_x;
    this.district_y = district_y;
    this.target_x = target_x;
    this.target_y = target_y;
    this.vx = 0.1;
    this.vy = 0.1;
    this.radius = size;
    this.content = content;
    this.dragging = false;
    this.name = name;
    this.category = category;
    this.priority = priority;
    if (is_boss === "true") {
      this.is_boss = true;
    } else {
      this.is_boss = false;
    }
    this.color = this.set_color();
    this.parent_links = [];
    this.child_links = [];
    this.hovered = false;
    this.attraction = 800 / document.getElementById("gravity").value;
    this.rejection =
      (document.getElementById("rejection") / 100) * this.attraction;
    this.in_position = false;
  }
  constructor(
    id,
    category,
    is_boss,
    priority,
    name,
    x,
    y,
    district_x,
    district_y,
    target_x,
    target_y,
    size,
    content
  ) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.district_x = district_x;
    this.district_y = district_y;
    this.target_x = target_x;
    this.target_y = target_y;
    this.vx = 0.1;
    this.vy = 0.1;
    this.radius = size;
    this.content = content;
    this.dragging = false;
    this.name = name;
    this.category = category;
    this.priority = priority;
    if (is_boss === "true") {
      this.is_boss = true;
    } else {
      this.is_boss = false;
    }
    this.color = this.set_color();
    this.parent_links = [];
    this.child_links = [];
    this.hovered = false;
    this.attraction = 800 / document.getElementById("gravity").value;
    this.rejection =
      (document.getElementById("rejection") / 100) * this.attraction;
    this.in_position = false;
  }

    draw() {
        if(this.hovered){
            this.draw_me_once("white");
            for(let i = 0; i< this.child_links.length;i++){
                this.child_links[i].draw_me_once("white");
                //this.child_links[i].show_text();
                this.draw_line_to(this.child_links[i]);
            }
            for(let i = 0; i< this.parent_links.length;i++){
                this.parent_links[i].draw_me_once("white");
                //this.parent_links[i].show_text();
                this.draw_line_to(this.parent_links[i]);
            }
            
        }else{
            
            this.draw_me_normal();
        }
        //this.show_text();
      }

      draw_line_to(ball) {
        const canvas = document.getElementById("canvas");
        const ctx = canvas.getContext("2d");
        const old_strokestyle = ctx.strokeStyle;
        const old_linewidth = ctx.lineWidth;
        ctx.strokeStyle = "white"; // Farbe der Linie
        //ctx.lineWidth = 3;   
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(ball.x, ball.y);
        ctx.stroke();
        ctx.strokeStyle = old_strokestyle; // Farbe der Linie
        //ctx.lineWidth = old_linewidth;  
    }
    complicated_follow(){

    }
    

    follow(){

        const distance = Math.sqrt((this.target_x-this.x)**2 + (this.target_y-this.y)**2);
        if (!this.dragging && distance > 50*this.priority) {
            this.x = this.x - this.vx*((this.x-this.target_x)/(Math.abs(this.x-this.target_x) + Math.abs(this.y-this.target_y)));
            this.y = this.y - this.vy*((this.y-this.target_y)/(Math.abs(this.x-this.target_x) + Math.abs(this.y-this.target_y)));
        } else if (!this.dragging && distance < 8.0){
            this.x = this.target_x;
            this.y = this.target_y;
            this.in_position = true;
        }
        if (this.vx < 1){
          this.vx += 0.05;
          this.vy += 0.05;
        }
    }

    keepDistanceTo(posX, posY) {
        const distance = Math.sqrt((posX - this.x) * (posX - this.x) + (posY - this.y) * (posY - this.y));
        if (distance < 300.0) {
            //console.log("this.x = ",this.x, "this.vx = ",this.vx, " posX = ", posX, "this.y = ",this.y," posY = ",posY, " (Math.abs(this.x - posX) + Math.abs(this.y - posY) = ", (Math.abs(this.x - posX) + Math.abs(this.y - posY)));
            //console.log("x = ",this.x + 0.1 * this.vx * ((this.x - posX) / (Math.abs(this.x - posX) + Math.abs(this.y - posY)))," y = ",this.y + 0.1 * this.vy * ((this.y - posY) / (Math.abs(this.x - posX) + Math.abs(this.y - posY))));
            if((Math.abs(this.x - posX) + Math.abs(this.y - posY)) != 0.0){
              this.x = this.x + this.vx * ((this.x - posX) / (Math.abs(this.x - posX) + Math.abs(this.y - posY)));
              this.y = this.y + this.vy * ((this.y - posY) / (Math.abs(this.x - posX) + Math.abs(this.y - posY)));
            }
        }
    }

  show_text() {
    if (this.hovered || this.dragging || this.is_boss) {
      const canvas = document.getElementById("canvas");
      const ctx = canvas.getContext("2d");
      const old_color = ctx.fillStyle;
      ctx.font = "30px Arial";
      ctx.textAlign = "center";
      ctx.fillStyle = "black";
      ctx.fillText(this.name, this.x, this.y - this.radius);
      ctx.stroke();
      ctx.fillStyle = old_color;
    }
  }

    draw_me_normal(){
        const canvas = document.getElementById("canvas");
        const ctx = canvas.getContext("2d");
        const old_color = ctx.fillStyle;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
        ctx.fillStyle = old_color;
    }

  draw_me_once(color) {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const old_color = ctx.fillStyle;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
    ctx.fillStyle = old_color;
  }

  sort_position() {
    this.district_x = Circle.sort_cordinate(this.x);
    this.district_y = Circle.sort_cordinate(this.y);
  }

  updateDistrict() {
    const old_district_x = this.district_x;
    const old_district_y = this.district_y;
    this.sort_position();
    if (
      old_district_x === this.district_x &&
      old_district_y === this.district_y
    ) {
      return;
    }
    // Entfernen der ID von der alten Position

    const oldDistrictArray = location[old_district_x][old_district_y];
    const indexToRemove = oldDistrictArray.indexOf(this.id);

    if (indexToRemove !== -1) {
      // ID aus dem alten Array entfernen
      oldDistrictArray.splice(indexToRemove, 1);
      location[this.district_x][this.district_y].push(this.id);
    } else {
      console.log("ID nicht in der alten Position gefunden.");
      return;
    }
  }
  set_target_position(posX, posY) {
    this.target_x = this.setPosition(posX);
    this.target_y = this.setPosition(posY);
  }

  isPointInside(x, y) {
    const dx = x - this.x;
    const dy = y - this.y;
    this.hovered = dx * dx + dy * dy <= this.radius * this.radius;
    return this.hovered;
  }

  change_circle_gravity() {
    this.attraction = 800 / document.getElementById("gravity").value;
  }

  change_circle_rejection() {
    this.rejection =
      (document.getElementById("rejection") / 100) * this.attraction;
  }

  change_circle_size() {
    this.radius =
      (document.getElementById("circle_size").value *
        (10 + this.get_child_links().length)) /
      10;
  }
  get_child_links() {
    return this.child_links;
  }

  change_child_links(links) {
    this.child_links = links;
  }

  change_parent_links(links) {
    this.parent_links = links;
  }

  give_content() {
    return this.content;
  }

  set_color() {
    return sharedState.colors[this.category] || "gray";
  }

    new_target_position() {
      let sum_follow_x = 0;
      let sum_follow_y = 0;
      const child_links = this.child_links;
      const follow_count = child_links.length;
      for (let i = 0; i < follow_count; i++) {
          const circle = child_links[i]; 
          sum_follow_x += circle.x;
          sum_follow_y += circle.y;
      }
      this.target_x = sum_follow_x/follow_count;
      this.target_y =  sum_follow_y/follow_count;
  }

  keep_distance() {
    if (this.priority > 1) {
      let sum_distance_x = 0;
      let sum_distance_y = 0;
      const keep_distance_circles = location[this.district_x][this.district_y];
      const keep_distance_count = location[this.district_x][this.district_y].length;
      for (let i = 0; i < keep_distance_count; i++) {
        
        const circle = balls[keep_distance_circles[i]]; // Index oder Referenz zu "circles"
        const distance = Math.sqrt((this.x-circle.x)**2 + (this.y-circle.y)**2);
        if( distance < this.radius+ circle.radius){
          sum_distance_x += circle.x;
          sum_distance_y += circle.y;
        }
      }
      //console.log("distancex = ",sum_distance_x/keep_distance_count," distancey = ",sum_distance_y/keep_distance_count);
      if (keep_distance_count > 0)
        this.keepDistanceTo(
          sum_distance_x / keep_distance_count,
          sum_distance_y / keep_distance_count
        );
    }
  }

  setPosition(target) {
    const padding = 20.0; // Puffer, um den Kreis innerhalb des sichtbaren Bereichs zu halten
    if (target < padding) {
      return padding; // Setzt die Position auf den Pufferwert, wenn sie unterhalb des Puffers liegt
    } else if (target > canvasSize - padding) {
      return canvasSize - padding; // Setzt die Position auf den Pufferwert, wenn sie oberhalb des Puffers liegt
    } else {
      return target; // Gibt die Zielposition zurück, wenn sie innerhalb der Grenzen liegt
    }
  }

  static sort_cordinate(pos) {
    const canvasSize = 1000;
    const maxLevels = 6; // Maximal 2^6 = 64 Positionen
    let index = 0;

    for (let i = 0; i < maxLevels; i++) {
      const threshold = canvasSize / (2 << i); // canvasSize / 2^i
      if (pos < threshold) {
        // Wenn pos kleiner als die aktuelle Schwelle ist, bleibt der Index unverändert
        continue;
      } else {
        // Andernfalls wird die Position entsprechend verschoben
        pos -= threshold;
        index += 1 << (maxLevels - i - 1); // 2^(maxLevels-i-1)
      }
    }
    return index;
  }
}
