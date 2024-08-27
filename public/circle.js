import { sharedState, location } from './state.js';

export default class Circle {
    constructor(id,category,is_boss,name,x, y,district_x,district_y,target_x,target_y,size, content) {
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
      if(is_boss === "true"){
        this.is_boss = true;
      }else {
        this.is_boss = false;
      }
      this.color = this.set_color();
      this.parent_links = [];
      this.child_links = [];
      this.hovered = false;
      this.attraction = 800/document.getElementById("gravity").value;
      this.rejection = document.getElementById("rejection")/100*this.attraction;
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

        var distance = Math.sqrt((this.target_x-this.x)**2 + (this.target_y-this.y)**2);
        if (!this.dragging && distance > 8.0) {
            this.x = this.x - this.vx*((this.x-this.target_x)/(Math.abs(this.x-this.target_x) + Math.abs(this.y-this.target_y)));
            this.y = this.y - this.vy*((this.y-this.target_y)/(Math.abs(this.x-this.target_x) + Math.abs(this.y-this.target_y)));
        } else if (!this.dragging && distance < 8.0){
            this.x = this.target_x;
            this.y = this.target_y;
            this.in_position = true;
        }
        if (this.vx < 8){
          this.vx += 0.05;
          this.vy += 0.05;
        }
    }

    

    show_text(){
      if(this.hovered || this.dragging || this.is_boss){
          const canvas = document.getElementById("canvas");
          const ctx = canvas.getContext("2d");
          const old_color = ctx.fillStyle;
          ctx.font = '20px Arial';
          ctx.textAlign = 'center';
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

    draw_me_once(color){
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
    if(old_district_x === this.district_x && old_district_y === this.district_y){
      return;
    }
    // Entfernen der ID von der alten Position
    console.log(old_district_x,"",old_district_y);
    
    const oldDistrictArray = location[old_district_x][old_district_y];
    const indexToRemove = oldDistrictArray.indexOf(this.id);
    
    if (indexToRemove !== -1) {
        // ID aus dem alten Array entfernen
        oldDistrictArray.splice(indexToRemove, 1);
        location[this.district_x][this.district_y].push(this.id);
    } else {
        console.log('ID nicht in der alten Position gefunden.');
        return;
    }
    
    
}

    

    isPointInside(x, y) {
        const dx = x - this.x;
        const dy = y - this.y;
        this.hovered = dx * dx + dy * dy <= this.radius * this.radius;
        return this.hovered;
      }
    
    change_circle_gravity(){
        this.attraction = 800/document.getElementById("gravity").value;
    }

    change_circle_rejection(){
        this.rejection = document.getElementById("rejection")/100*this.attraction;
    }

    change_circle_size(){
        this.radius = document.getElementById("circle_size").value*(10+ this.get_child_links().length)/10;
    }
    get_child_links(){
        return this.child_links;
    }

    change_child_links(links){
        this.child_links = links;
    }

    change_parent_links(links){
        this.parent_links = links;
    }

    give_content(){
        return this.content;
    }

    set_color(){
        return sharedState.colors[this.category] || "gray"
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
              index += (1 << (maxLevels - i - 1)); // 2^(maxLevels-i-1)
          }
      }
      return index;
    }
      

  }