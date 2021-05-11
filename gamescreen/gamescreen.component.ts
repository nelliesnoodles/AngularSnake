import { Component, OnInit, HostListener } from '@angular/core';


@Component({
  selector: 'app-gamescreen',
  templateUrl: './gamescreen.component.html',
  styleUrls: ['./gamescreen.component.css']
})
export class GamescreenComponent implements OnInit {
  ROWS = 30;
  COLUMNS = 30;
  Player = [15, 29];
  MATRIX: any = [];
  HEART = '&#9829;';
  HEAD = '&#10808;';
  HEADCOLOR = 'lime';
  BODYCOLOR = 'green';
  HEARTCOLOR = 'red';
  PANTRY = 1;
  DIRECTION = 'ArrowUp';
  VALIDDIRECTIONS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
  TAIL: any = [];
  LENGTH = 0;
  SPEED = 200;
  INTERVAL: any;
  GAMEOVER = false;
  SCORE = 0;
  POINTS = 100;
  FOODCOUNT = 0;




  setListener() {
    document.addEventListener('keyup', event => {
      const key = event.key;
      if (this.VALIDDIRECTIONS.includes(key)) {
        this.DIRECTION = key;
      }
    });
  }

  populate() {
    for (let i = 0; i < this.ROWS; i++) {
      const row: any = [];
      for (let j = 0; j < this.COLUMNS; j++) {
        const column: any = [];
        const contents = {
          typeof: 'empty',
          empty: true,
          edible: false,

        };
        column.push(contents);
        row.push(column);
      }
      this.MATRIX.push(row);
    }
  }


  randomNumber(min: number, max: number) {
    const num = Math.random() * (max - min) + min;
    return Math.ceil(num);
  }

  update_score() {
    this.SCORE = this.SCORE +  this.POINTS;
    const element = document.getElementById('score');
    if (element !== undefined && element !== null) {
      element.innerHTML = this.SCORE.toString();
    }
    
  }

  update_game() {
    const old = this.move_head();
    this.update_matrix(old);
  }

  gameOver() {
    this.GAMEOVER = true;
    clearInterval(this.INTERVAL);
    const hidden = document.getElementById('hidden');
    if (hidden !== undefined && hidden !== null) {
      hidden.classList.remove('hidden');
    }
  }


  start() {
    if (this.GAMEOVER === false) {
      this.setListener();

      this.INTERVAL = setInterval(() => {

          this.update_game();


      }, this.SPEED);
    }
  }




  placefood() {
    // if length of FOOD is less than 3, add food, always keep it at 3
    const pantry = this.PANTRY;
    const toadd = 4 - pantry;

    if (toadd > 0) {

      for (let i = 0; i < toadd; i++) {
        const coords = this.get_empty();
        if (coords !== null) {
          const x = coords[0];
          const y = coords[1];
          const plot = this.MATRIX[x][y];
          const cell = plot[0];
          cell.empty = false;
          cell.edible = true;
          cell.typeof = 'food';
          this.food_in_html(x, y);
          this.PANTRY += 1;
        }

      }
    }
  }


  food_in_html(x: number, y: number) {
    const cellCoords =  x + ':' + y;
    const element = document.getElementById(cellCoords);

    if (element !== undefined && element !== null) {
      element.classList.add('white');
    }

  }

  get_empty () {
    const x = this.randomNumber(0, this.ROWS - 1);
    const y = this.randomNumber(0, this.COLUMNS - 1);
    const cell = this.MATRIX[x][y];
    const object = cell[0];
    
    // limit attempts at placement by 3
   
      if (object.empty === true) {
        return [x, y];
      }
    return null;
   }
  createGameBoard() {

    const FIELD = document.querySelector('#FIELD');
    for (let i = 0; i < this.ROWS; i++) {
      const row = document.createElement('div');
      row.classList.add('row');


      for (let j = 0; j < this.COLUMNS; j++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        // this id will help us locate the cell or data in the matrix
        const cellCoords = i + ':' + j;
        cell.id = cellCoords;
        cell.setAttribute('value', cellCoords);
        row.appendChild(cell);
      }
      if (FIELD !== undefined && FIELD !== null) {
        FIELD.appendChild(row);
      }

    }
  }


  check_empty(coords: any) {
    const x = coords[0];
    const y = coords[1];
    const cell = this.MATRIX[x][y];
    const obj = cell[0];
    if (obj.empty === false) {
      if (obj.edible === false) {
        this.gameOver();
      }
    }

  }

  pop_tail() {

    const coords = this.TAIL.pop();
    const xy = coords.split(':');
    const x = parseInt(xy[0]);
    const y = parseInt(xy[1]);
    const cell = this.MATRIX[x][y];
    const obj = cell[0];
    const element = document.getElementById(coords);
    if (element !== undefined && element !== null) {
      element.classList.remove('green');
      element.classList.add('none');
    }
    obj.empty = true;
    obj.typeof = 'empty';
    obj.edible = false;

  }


  update_matrix(old_coords: any) {

    const oldx = old_coords[0];
    const oldy = old_coords[1];
    const cell = this.MATRIX[oldx][oldy];
    const obj = cell[0];
    const id = oldx + ':' + oldy;
    const element = document.getElementById(id);

    if (this.TAIL.length > this.LENGTH) {
      this.pop_tail();
    }
    this.TAIL.unshift(id);




    if (element !== undefined && element !== null) {
      if (this.TAIL.includes(id)) {
        element.classList.remove('lime');
        element.classList.add('green');
      }
      else {
        element.classList.remove('lime');
        element.classList.add('none');
      }
    }

    obj.empty = false;
    obj.edible = false;
    obj.typeof = 'empty';
    const newx = this.Player[0];
    const newy = this.Player[1];
    const newID = newx + ':' + newy;
    const newcoords = [newx, newy];
    this.check_empty(newcoords);
    const newcell = this.MATRIX[newx][newy];
    const newobj = newcell[0];
    const newelement = document.getElementById(newID);
    if (newelement !== undefined && newelement !== null) {
      // newelement.classList.remove('green')
      newelement.classList.add('lime');
    }
    this.check_food();
    newobj.empty = false;
    newobj.edible = false;
    newobj.typeof = 'head';

  }


  check_food() {
    const matx = this.Player[0];
    const maty = this.Player[1];
    const cell = this.MATRIX[matx][maty];
    const obj = cell[0];
    const id = matx + ':' + maty;
    const element = document.getElementById(id);


    if (obj.edible === true ) {
      this.LENGTH += 1;
      this.PANTRY -= 1;
      this.FOODCOUNT += 1;
      this.update_score();
      this.TAIL.unshift(id);
      if (element !== undefined && element !== null) {
        element.classList.remove('white');
      }
      this.placefood();
    }
    if (this.FOODCOUNT === 3) {
      this.POINTS += 10;


    }
    else if (this.FOODCOUNT === 6) {
      this.POINTS += 20;


    }
    else if (this.FOODCOUNT === 14) {
      this.POINTS += 70;


    }
    else if (this.FOODCOUNT === 28) {
      this.POINTS += 100;

    }
    else if (this.FOODCOUNT === 42) {
      this.POINTS += 300;
    }
  }


  move_head() {
    const min = 0;
    const max = 29;
    // if you do temp = this.Player, the temp numbers change just as Player does.
    const tempx = this.Player[0];
    const tempy = this.Player[1];
    const temp = [tempx, tempy];


    if (this.DIRECTION === 'ArrowUp') {
      const newx = this.Player[1] - 1;

      if (newx >= min) {
        this.Player[1] = newx;
      }
      else {
        this.gameOver();
      }

    }
    else if (this.DIRECTION === 'ArrowDown') {
      const newx = this.Player[1] + 1;

      if (newx <= max) {
        this.Player[1] = newx;
      }
      else {
        this.gameOver();
      }

    }
    else if (this.DIRECTION === 'ArrowLeft') {
      const newy = this.Player[0] - 1;

      if (newy >= min) {
        this.Player[0] = newy;
      }
      else {
        this.gameOver();
      }
    }
    else if (this.DIRECTION === 'ArrowRight') {
      const newy = this.Player[0] + 1;

      if (newy <= max) {
        this.Player[0] = newy;
      }
      else {
        this.gameOver();
      }

    }
    else {
      console.log(`Input DIRECTION not found: ${this.DIRECTION}`);
    }
    const oldcoords = tempx + ':' + tempy;

    return temp;
  }


  place_head() {
    const x = this.Player[0];
    const y = this.Player[1];
    const id = x + ':' + y;
    const start = document.getElementById(id);
    const cell = this.MATRIX[x][y];
    const obj = cell[0];
    obj.empty = false;
    obj.typeof = 'head';
    obj.edible = false;
    if (start !== undefined && start !== null) {
      start.classList.add('lime');
    }
  }

  ngOnInit(): void {
    this.populate();
    this.createGameBoard();
    this.placefood();
    this.place_head();


  }

}
