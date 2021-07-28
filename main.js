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
    generateObjects(percent) {
        // Create random positions for the holes
        let holes = Math.floor((this.field.length * this.field[0].length) / 100 * percent);
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
            return console.log('Oh no! You have jumped off the board! Try again!');
        } else if (this.isHole()) {
            return console.log('Opps! You fell in a hole! Better luck next time!');
        } else if (this.isHat()) {
            return console.log('Congratulations! You have found your hat!');
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
        this.currentX > this.field[this.currentY].length - 1
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
        switch(location.toUpperCase()) {
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

    // This makes sure you can not move to a previously visited place
    backtrackCheck(dirY, dirX) {
        if (this.field[dirY][dirX] !== pathCharacter) {
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
        this.field.forEach(cell => console.log(cell.join('')));
        this.nextMove = prompt('Where should we move? (R, L, U, D): ');
        this.playerMove(this.nextMove);
    }
}

// Create new game
const myField = new Field(10, 12);
// Generate game objects
myField.generateObjects(20);
// Start the game
myField.play();

