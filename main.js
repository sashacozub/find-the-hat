// Import prompt module to be able to get user's input
const prompt = require('prompt-sync')({ sigint: true });

// Create game objects
const hat = '🎓';
const hole = '⬛';
const fieldCharacter = '🟫';
const pathCharacter = '🦖';
const previouslyVisitedCharacter = '👣';
const gameRules = `
Game Rules: \n 
1. You (🦖) need to stay inside the field. \n 
2. Avoid the holes "⬛". \n 
3. Find your hat "🎓"! \n 
`;

// This will be set by the player before the start of the game
let boardSize;
let percentage;

// Make game constructor which creates the field and all the game logic
class Field {
  constructor(height, width) {
    this.field = Field.generateField(height, width);
    this.currentX = undefined;
    this.currentY = undefined;
    this.nextMove = undefined; // This will hold player's answer on next move
  }

  // Create random positions to use in generating game objects
  randomX() {
    return Math.floor(Math.random() * this.field[0].length);
  }

  randomY() {
    return Math.floor(Math.random() * this.field.length);
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
  generateObjects(percent) {
    // Create random positions for the holes
    let holes = Math.floor(
      ((this.field.length * this.field[0].length) / 100) * percent
    );
    while (holes > 0) {
      if (this.field[this.randomY()][this.randomX()] !== hole) {
        this.field[this.randomY()][this.randomX()] = hole;
        holes--;
      }
    }

    // Create random position for the hat
    let hatY = this.randomY();
    let hatX = this.randomX();
    while (this.field[hatY][hatX] === pathCharacter) {
      hatY = this.randomY();
      hatX = this.randomX();
    }
    this.field[hatY][hatX] = hat;

    // Create random position for the player
    this.currentX = this.randomX();
    this.currentY = this.randomY();
    this.field[this.currentY][this.currentX] = pathCharacter;
  }

  // Track user's movement and update the field after that
  updateField() {
    // Check if user went over the provided field
    if (this.isOffBoard()) {
      return console.log(
        '\n Oh no! You have jumped off the board! Try again! \n'
      );
    } else if (this.isHole()) {
      return console.log(
        '\n Oops! You fell in a hole! Better luck next time! \n'
      );
    } else if (this.isHat()) {
      return console.log('\n Congratulations! You have found your hat! \n');
    }
    // If none of the above then update the display with the new player position
    this.field[this.currentY][this.currentX] = pathCharacter;
    this.play();
  }

  // Check if player went over the board
  isOffBoard() {
    return (
      this.currentY < 0 ||
      this.currentX < 0 ||
      this.currentY > this.field.length - 1 ||
      this.currentX > this.field[0].length - 1
    );
  }

  // Check if player went over the hole
  isHole() {
    return this.field[this.currentY][this.currentX] === hole;
  }

  // Check if player went over the hat
  isHat() {
    return this.field[this.currentY][this.currentX] === hat;
  }

  // Change player's position depenting on his choice
  playerMove(location) {
    switch (location.toUpperCase()) {
      case 'R':
        this.backtrackCheck(this.currentY, this.currentX + 1);
        break;
      case 'L':
        this.backtrackCheck(this.currentY, this.currentX - 1);
        break;
      case 'U':
        this.backtrackCheck(this.currentY - 1, this.currentX);
        break;
      case 'D':
        this.backtrackCheck(this.currentY + 1, this.currentX);
        break;
      default:
        this.play();
        break;
    }
  }

  // This draws previously visited tiles
  backtrackCheck(dirY, dirX) {
    if (
      dirY < 0 ||
      dirX < 0 ||
      dirY > this.field.length - 1 ||
      dirX > this.field[0].length - 1
    ) {
      return console.log(
        '\n Oh no! You have jumped off the board! Try again! \n'
      );
    }

    if (this.field[dirY][dirX] !== pathCharacter) {
      this.field[this.currentY][this.currentX] = previouslyVisitedCharacter;
      this.currentX = dirX;
      this.currentY = dirY;
      this.updateField();
    } else {
      this.play();
    }
  }

  // Display the game field, get user's choice and start checking if it's a win or a lose.
  play() {
    console.clear();
    console.log(gameRules);
    this.field.forEach((cell) => console.log(cell.join('')));
    console.log(
      '\n Choose where would you like to move! (Up, Down, Left, Right)'
    );

    this.nextMove = prompt('U / D / L / R: ');
    this.playerMove(this.nextMove);
  }
}

// Get the board size from the player
boardSize = prompt('What board size would you like? (Recommended: minimum 5) ');
const newField = new Field(boardSize, boardSize);
// Get the percentage of holes on the board
percentage = prompt(
  'What percentage of the board should be filled with holes? (Recommended: 10-20) '
);
newField.generateObjects(percentage);
// Start the game
newField.play();
