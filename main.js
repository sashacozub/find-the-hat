// Import prompt module to be able to get user's input
const prompt = require('prompt-sync')({sigint: true});

// Create game objects
const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';


// Make game constructor which creates the field and all the game logic
class Field {
  constructor(height, width) {
    this.field = Field.generateField(height, width);
    this.currentX;
    this.currentY;
    this.nextMove = undefined; // This will hold player's answer on next move
  }

  // This auto-generates the game field when creating the field object
  static generateField(height, width) {
    let fieldY = []; // The container array aka height of the field
    for (let i = 0; i < height; i++) {
        let fieldX = []; // The container subarray aka width of the field
        for (let j = 0; j < width; j++) {
            fieldX.push(fieldCharacter);
        }
        fieldY.push(fieldX);
    }
    return fieldY;
  }

  // Generate holes, hat and random player position
  generateObjects(percent) {
    let holes = Math.floor((this.field.length * this.field[0].length) / 100 * percent);
    let totalHats = 1;
    while (holes > 0) {
        const randY = Math.floor(Math.random() * this.field.length);
        const randX = Math.floor(Math.random() * this.field[0].length);
        if (this.field[randY][randX] !== hole) {
            this.field[randY][randX] = hole;
            holes--;
        }
    }

    this.currentX = Math.floor(Math.random() * this.field[0].length);
    this.currentY = Math.floor(Math.random() * this.field.length);
    this.field[this.currentY][this.currentX] = pathCharacter;

    let hatY = Math.floor(Math.random() * this.field[0].length);
    let hatX = Math.floor(Math.random() * this.field.length);
    while (totalHats > 0) {
        if (this.field[hatY][hatX] !== pathCharacter) {
            this.field[hatY][hatX] = hat;
            totalHats--;
        }
    }
  }

  

  // Track user's movement and update the field after that
  updateField() {
    // Check if user went over the provided field
    if (this.currentY < 0 || this.currentX < 0) {
        console.clear();
        return console.log('Oh no! You have jumped off the board! Try again!');
    } else if (this.currentY > this.field.length - 1 || this.currentX > this.field[this.currentY].length - 1) {
        console.clear();
        return console.log('Oh no! You have jumped off the board! Try again!');
    // Check if user went over the hole
    } else if (this.field[this.currentY][this.currentX] === hole) {
        console.clear();
        return console.log('Opps! You fell in a hole! Better luck next time!');
    // Check if user went over the hat, that's a win
    } else if (this.field[this.currentY][this.currentX] === hat) {
        return console.log('Congratulations! You have found your hat!');
    }

    // If none of the above then update the display with the new player position
    this.field[this.currentY][this.currentX] = pathCharacter;
    this.play();
  }

  /*
  isOffBoard() {
      return (
        this.currentY < 0 || 
        this.currentX < 0 || 
        this.currentY > this.field.length - 1 || 
        this.currentX > this.field[this.currentY].length - 1
    );
  }
  */

  // This updates player's next move depending on his choice
  playerMove(location) {
    switch(location.toUpperCase()) {
        case 'R':
            this.currentX += 1;
            // This makes sure you don't go back the same way you came from
            if (this.field[this.currentY][this.currentX] === pathCharacter) {
                this.currentX -= 1;
            }
            this.updateField();
            break;
        case 'L':
            this.currentX -= 1;
            if (this.field[this.currentY][this.currentX] === pathCharacter) {
                this.currentX += 1;
            }
            this.updateField();
            break;
        case 'U':
            this.currentY -= 1;
            if (this.field[this.currentY][this.currentX] === pathCharacter) {
                this.currentY += 1;
            }
            this.updateField();
            break;
        case 'D':
            this.currentY += 1;
            if (this.field[this.currentY][this.currentX] === pathCharacter) {
                this.currentY -= 1;
            }
            this.updateField();
            break;
        default:
            this.play();
            break;
    }
  }

  // Display the game field, get user's choice and start checking if it's a win or a lose.
  play() {
    console.clear();
    this.field.forEach(cell => console.log(cell.join('')));
    this.nextMove = prompt('Where should we move? (R, L, U, D): ');
    this.playerMove(this.nextMove);
  }
}

const myField = new Field(10, 12);
myField.generateObjects(20);
myField.play();



