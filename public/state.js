export const sharedState = {
    running: false,
    all_loaded: false,
    grid_size:64,
    rotation_pos: 0,
    counter: 0,
    lines_disappear_animation_done: false,
    starting_animation_done: false,
    animation_color: 150,
    colors: {
        "C++": 0x7fffd4,        //"Aquamarine"
        "Docker": 0x1e90ff,     //"DodgerBlue"
        "CSS": 0x00ffff,        //"aqua"
        "Java": 0xff0000,       //"red"
        "SpringBoot": 0xbc2200, //"rgb(188, 34, 0)"
        "HTML": 0xff7f50,       //"coral"
        "MongoDB": 0x7fff00,    //"Chartreuse"
        "AWS": 0x696969,        //"DimGrey"
        "Web Development": 0x808080, //"grey"
        "Javascript": 0x006400, //"DarkGreen"
        "TypeScript": 0x4884c8, //"rgb(72, 132, 200)"
        "GIT": 0x808000,        //"Olive"
        "SQL": 0x8b008b,        //"DarkMagenta"
        "Shell": 0x000000,      //"black"
        "Python": 0x0000ff,     //"blue"
        "Machine Learning": 0xffff00, //"yellow"
        "Visual Basic for Application": 0x008000, //"green"
        "Apache Kafka": 0xc8c8c8, //"rgb(200, 200, 200)"
      }
};
export const canvasSize = 1000;
export const balls = [];
export const map = new Map();
export const matrix = [];
export const location = Array(sharedState.grid_size).fill().map(() => Array(sharedState.grid_size).fill().map(() => []));
export class ApiService {
  constructor() {
      this.threeJs = null;
  }

  setThreeJsHandler(threeJs) {
    this.threeJs = threeJs;
  }

  getThreeJsHandler() {
      return this.threeJs;
  }
}
