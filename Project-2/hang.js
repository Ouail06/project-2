let canvas;
let ctx;
let gBArrayHeight = 20; // Aantal cellen in de hoogte
let gBArrayWidth = 12; // Aantal cellen inde breedtje
let startX = 4; // Start X positie voor Tetromino
let startY = 0; // Start Y positie voor Tetromino
let score = 0; // Houd score bij
let level = 1; // Houd de huidige level bij
let winOrLose = "Playing";
// bevat de x & y positie 
// doos op de canvas
let coordinateArray = [...Array(gBArrayHeight)].map(e => Array(gBArrayWidth).fill(0));
 
let curTetromino = [[1,0], [0,1], [1,1], [2,1]];
 
// 3. Bevat alle tetrominos 
let tetrominos = [];
// 3. =De tetromino array met de kleuren afgestemd op de tetrominos array
let tetrominoColors = ['purple','cyan','blue','yellow','orange','green','red'];
// 3. Bevat de huidige tetrominos kleur
let curTetrominoColor;
 
// 4. Maak een gameboardarray zodat we weten waar andere vierkanten zijn
let gameBoardArray = [...Array(20)].map(e => Array(12).fill(0));
 
// 6. Array voor het opslaan van gestopte vormen
// Het houdt kleuren vast wanneer een vorm stopt en wordt toegevoegd
let stoppedShapeArray = [...Array(20)].map(e => Array(12).fill(0));
 
// 4. Gemaakt om de richting te volgen waarin ik de Tetromino beweeg
// zodat ik kan stoppen met proberen door muren te bewegen
let DIRECTION = {
    IDLE: 0,
    DOWN: 1,
    LEFT: 2,
    RIGHT: 3
};
let direction;
 
class Coordinates{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}
 
// SetupCanvas uitvoeren wanneer pagina's worden geladen
document.addEventListener('DOMContentLoaded', SetupCanvas); 
 
// Hiermee maakt u de array met vierkante coördinaten [Tabel opzoeken]
// [0,0] Pixels x: 11 y: 9, [1,0] pixels x: 34 Y: 9, ...
function CreateCoordArray(){
    let xR = 0, yR = 19;
    let i = 0, j = 0;
    for(let y = 9; y <= 446; y += 23){
        // 12 * 23 = 276 - 12 = 264 Max X waarde
        for(let x = 11; x <= 264; x += 23){
            coordinateArray[i][j] = new Coordinates(x,y);
            // console.log(i + ":" + j + " = " + coordinateArray[i][j].x + ":" + coordinateArray[i][j].y);
            i++;
        }
        j++;
        i = 0;
    }
}
 
function SetupCanvas(){
    canvas = document.getElementById('my-canvas');
    ctx = canvas.getContext('2d');
    canvas.width = 936;
    canvas.height = 956;
 
    // Verdubbel de grootte van elementen om op het scherm te passen
    ctx.scale(2, 2);
 
    // Kleur Canvas achtergrond
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // kleur gameboard rechthoek
    ctx.strokeStyle = 'black';
    ctx.strokeRect(8, 8, 280, 462);
 
    tetrisLogo = new Image(161, 54);
    tetrisLogo.onload = DrawTetrisLogo;
    tetrisLogo.src = "tetrislogo.png";
 
    // Lettertype instellen voor tekst en teken op scorelabel
    ctx.fillStyle = 'black';
    ctx.font = '21px Arial';
    ctx.fillText("SCORE", 300, 98);
 
    //  score rechthoek
    ctx.strokeRect(300, 107, 161, 24);
 
    // score
    ctx.fillText(score.toString(), 310, 127);
    
    // Tekst van het niveaulabel
    ctx.fillText("LEVEL", 300, 157);
 
    // level rechthoek
    ctx.strokeRect(300, 171, 161, 24);
 
    // level
    ctx.fillText(level.toString(), 310, 190);
 
    // label tekst
    ctx.fillText("WIN / LOSE", 300, 221);
 
    // Win pf verlies
    ctx.fillText(winOrLose, 310, 261);
 
    // Speel rechthoek
    ctx.strokeRect(300, 232, 161, 95);
    
    // besturingselementen labeltekst
    ctx.fillText("CONTROLS", 300, 354);
 
    // controleert rechthoek
    ctx.strokeRect(300, 366, 161, 104);
 
    // controleert tekst
    ctx.font = '19px Arial';
    ctx.fillText("A : beweeg links", 310, 388);
    ctx.fillText("D : beweeg rechts", 310, 413);
    ctx.fillText("S : beweeg naar beneden", 310, 438);
    ctx.fillText("E : Roteer naar rechts", 310, 463);
 
    // 2. Toetsenbord
    document.addEventListener('keydown', HandleKeyPress);
 
    // 3. De array van Tetromino-arrays maken
    CreateTetrominos();
    // 3. Genereer random tetromino
    CreateTetromino();
 
    // De opzoektabel voor rechthoek maken
    CreateCoordArray();
 
    DrawTetromino();
}
 
function DrawTetrisLogo(){
    ctx.drawImage(tetrisLogo, 300, 8, 161, 54);
}
 
function DrawTetromino(){
    // Blader door de x &y array voor de tetromino 
    // voor alle plaatsen zou een vierkant worden getekend
    for(let i = 0; i < curTetromino.length; i++){
 
        // Verplaats de Tetromino x &y waarden naar de tetromino
        // toont in het midden van het speelbord
        let x = curTetromino[i][0] + startX;
        let y = curTetromino[i][1] + startY;
 
        // 4. Zet Tetromino-vorm in de gameboard-array
        gameBoardArray[x][y] = 1;
        // console.log("stop 1 in [" + x + "," + y + "]");
 
        // Zoek naar de x &y-waarden in de opzoektabel
        let coorX = coordinateArray[x][y].x;
        let coorY = coordinateArray[x][y].y;
 
        // console.log("X : " + x + " Y : " + y);
        // console.log("Rect X : " + coordinateArray[x][y].x + " Rect Y : " + coordinateArray[x][y].y);
 
        // 1. Teken een vierkant op de x &y coördinaten die de zoekopdracht
        ctx.fillStyle = curTetrominoColor;
        ctx.fillRect(coorX, coorY, 21, 21);
    }
}
 
// ----- 2. Verplaatsen & Verwijder Oude Tetrimino -----
// Telkens wanneer een toets wordt ingedrukt, veranderen we het begin
// x- of y-waarde voor waar ik de nieuwe Tetromino wil tekenen
// ik verwijder ook de eerder getekende vorm en tekenen de nieuwe
function HandleKeyPress(key){
    if(winOrLose != "Game Over"){
    // a teken (LEFT)
    if(key.keyCode === 65){
        // 4. Controleer of ik de muur zal raken
        direction = DIRECTION.LEFT;
        if(!HittingTheWall() && !CheckForHorizontalCollision()){
            DeleteTetromino();
            startX--;
            DrawTetromino();
        } 
 
    // d teken (RIGHT)
    } else if(key.keyCode === 68){
        
        // 4.  Controleer of ik de muur zal raken
        direction = DIRECTION.RIGHT;
        if(!HittingTheWall() && !CheckForHorizontalCollision()){
            DeleteTetromino();
            startX++;
            DrawTetromino();
        }
 
    // s teken (DOWN)
    } else if(key.keyCode === 83){
        MoveTetrominoDown();
        // 9. e teken roept rotatie van Tetromino op
    } else if(key.keyCode === 69){
        RotateTetromino();
    }
    } 
}
 
function MoveTetrominoDown(){
    // 4.meet dat ik naar beneden wil gaan
    direction = DIRECTION.DOWN;
 
    // 5. Controleren op een verticale botsing
    if(!CheckForVerticalCollison()){
        DeleteTetromino();
        startY++;
        DrawTetromino();
    }
}
 
// 10. Roept automatisch op dat een Tetromino elke seconde valt
 
window.setInterval(function(){
    if(winOrLose != "Game Over"){
        MoveTetrominoDown();
    }
  }, 1000);
 
 
// Wist de eerder getekende Tetromino
// Doe dezelfde dingen toen we oorspronkelijk tekenden
// maar maak het vierkant deze keer wit
function DeleteTetromino(){
    for(let i = 0; i < curTetromino.length; i++){
        let x = curTetromino[i][0] + startX;
        let y = curTetromino[i][1] + startY;
 
        // 4. Delete Tetromino square from the gameboard array
        gameBoardArray[x][y] = 0;
 
        // Draw white where colored squares used to be
        let coorX = coordinateArray[x][y].x;
        let coorY = coordinateArray[x][y].y;
        ctx.fillStyle = 'white';
        ctx.fillRect(coorX, coorY, 21, 21);
    }
}
 
// 3. Generate random Tetrominos with color
// We'll define every index where there is a colored block
function CreateTetrominos(){
    // Push T 
    tetrominos.push([[1,0], [0,1], [1,1], [2,1]]);
    // Push I
    tetrominos.push([[0,0], [1,0], [2,0], [3,0]]);
    // Push J
    tetrominos.push([[0,0], [0,1], [1,1], [2,1]]);
    // Push Square
    tetrominos.push([[0,0], [1,0], [0,1], [1,1]]);
    // Push L
    tetrominos.push([[2,0], [0,1], [1,1], [2,1]]);
    // Push S
    tetrominos.push([[1,0], [2,0], [0,1], [1,1]]);
    // Push Z
    tetrominos.push([[0,0], [1,0], [1,1], [2,1]]);
}
 
function CreateTetromino(){
    // Get a random tetromino index
    let randomTetromino = Math.floor(Math.random() * tetrominos.length);
    // Set the one to draw
    curTetromino = tetrominos[randomTetromino];
    // Get the color for it
    curTetrominoColor = tetrominoColors[randomTetromino];
}
 
// 4. Check if the Tetromino hits the wall
// Cycle through the squares adding the upper left hand corner
// position to see if the value is <= to 0 or >= 11
// If they are also moving in a direction that would be off
// the board stop movement
function HittingTheWall(){
    for(let i = 0; i < curTetromino.length; i++){
        let newX = curTetromino[i][0] + startX;
        if(newX <= 0 && direction === DIRECTION.LEFT){
            return true;
        } else if(newX >= 11 && direction === DIRECTION.RIGHT){
            return true;
        }  
    }
    return false;
}
 
// 5. Check for vertical collison
function CheckForVerticalCollison(){
    // Make a copy of the tetromino so that I can move a fake
    // Tetromino and check for collisions before I move the real
    // Tetromino
    let tetrominoCopy = curTetromino;
    // Will change values based on collisions
    let collision = false;
 
    // Cycle through all Tetromino squares
    for(let i = 0; i < tetrominoCopy.length; i++){
        // Get each square of the Tetromino and adjust the square
        // position so I can check for collisions
        let square = tetrominoCopy[i];
        // Move into position based on the changing upper left
        // hand corner of the entire Tetromino shape
        let x = square[0] + startX;
        let y = square[1] + startY;
 
        // If I'm moving down increment y to check for a collison
        if(direction === DIRECTION.DOWN){
            y++;
        }
 
        // Check if I'm going to hit a previously set piece
        // if(gameBoardArray[x][y+1] === 1){
        if(typeof stoppedShapeArray[x][y+1] === 'string'){
            // console.log("COLLISON x : " + x + " y : " + y);
            // If so delete Tetromino
            DeleteTetromino();
            // Increment to put into place and draw
            startY++;
            DrawTetromino();
            collision = true;
            break;
        }
        if(y >= 20){
            collision = true;
            break;
        }
    }
    if(collision){
        // Check for game over and if so set game over text
        if(startY <= 2){
            winOrLose = "Game Over";
            ctx.fillStyle = 'white';
            ctx.fillRect(310, 242, 140, 30);
            ctx.fillStyle = 'black';
            ctx.fillText(winOrLose, 310, 261);
        } else {
 
            // 6. Add stopped Tetromino to stopped shape array
            // so I can check for future collisions
            for(let i = 0; i < tetrominoCopy.length; i++){
                let square = tetrominoCopy[i];
                let x = square[0] + startX;
                let y = square[1] + startY;
                // Add the current Tetromino color
                stoppedShapeArray[x][y] = curTetrominoColor;
            }
 
            // 7. Check for completed rows
            CheckForCompletedRows();
 
            CreateTetromino();
 
            // Create the next Tetromino and draw it and reset direction
            direction = DIRECTION.IDLE;
            startX = 4;
            startY = 0;
            DrawTetromino();
        }
 
    }
}
 
// 6. Check for horizontal shape collision
function CheckForHorizontalCollision(){
    // Copy the Teromino so I can manipulate its x value
    // and check if its new value would collide with
    // a stopped Tetromino
    var tetrominoCopy = curTetromino;
    var collision = false;
 
    // Cycle through all Tetromino squares
    for(var i = 0; i < tetrominoCopy.length; i++)
    {
        // Get the square and move it into position using
        // the upper left hand coordinates
        var square = tetrominoCopy[i];
        var x = square[0] + startX;
        var y = square[1] + startY;
 
        // Move Tetromino clone square into position based
        // on direction moving
        if (direction == DIRECTION.LEFT){
            x--;
        }else if (direction == DIRECTION.RIGHT){
            x++;
        }
 
        // Get the potential stopped square that may exist
        var stoppedShapeVal = stoppedShapeArray[x][y];
 
        // If it is a string we know a stopped square is there
        if (typeof stoppedShapeVal === 'string')
        {
            collision=true;
            break;
        }
    }
 
    return collision;
}
 
// 7. Check for completed rows
// ***** SLIDE *****
function CheckForCompletedRows(){
 
    // 8. Track how many rows to delete and where to start deleting
    let rowsToDelete = 0;
    let startOfDeletion = 0;
 
    // Check every row to see if it has been completed
    for (let y = 0; y < gBArrayHeight; y++)
    {
        let completed = true;
        // Cycle through x values
        for(let x = 0; x < gBArrayWidth; x++)
        {
            // Get values stored in the stopped block array
            let square = stoppedShapeArray[x][y];
 
            // Check if nothing is there
            if (square === 0 || (typeof square === 'undefined'))
            {
                // If there is nothing there once then jump out
                // because the row isn't completed
                completed=false;
                break;
            }
        }
 
        // If a row has been completed
        if (completed)
        {
            // 8. Used to shift down the rows
            if(startOfDeletion === 0) startOfDeletion = y;
            rowsToDelete++;
 
            // Delete the line everywhere
            for(let i = 0; i < gBArrayWidth; i++)
            {
                // Update the arrays by deleting previous squares
                stoppedShapeArray[i][y] = 0;
                gameBoardArray[i][y] = 0;
                // Look for the x & y values in the lookup table
                let coorX = coordinateArray[i][y].x;
                let coorY = coordinateArray[i][y].y;
                // Draw the square as white
                ctx.fillStyle = 'white';
                ctx.fillRect(coorX, coorY, 21, 21);
            }
        }
    }
    if(rowsToDelete > 0){
        score += 10;
        ctx.fillStyle = 'white';
        ctx.fillRect(310, 109, 140, 19);
        ctx.fillStyle = 'black';
        ctx.fillText(score.toString(), 310, 127);
        MoveAllRowsDown(rowsToDelete, startOfDeletion);
    }
}
 
// 8. Move rows down after a row has been deleted
function MoveAllRowsDown(rowsToDelete, startOfDeletion){
    for (var i = startOfDeletion-1; i >= 0; i--)
    {
        for(var x = 0; x < gBArrayWidth; x++)
        {
            var y2 = i + rowsToDelete;
            var square = stoppedShapeArray[x][i];
            var nextSquare = stoppedShapeArray[x][y2];
 
            if (typeof square === 'string')
            {
                nextSquare = square;
                gameBoardArray[x][y2] = 1; // Put block into GBA
                stoppedShapeArray[x][y2] = square; // Draw color into stopped
 
                // Look for the x & y values in the lookup table
                let coorX = coordinateArray[x][y2].x;
                let coorY = coordinateArray[x][y2].y;
                ctx.fillStyle = nextSquare;
                ctx.fillRect(coorX, coorY, 21, 21);
 
                square = 0;
                gameBoardArray[x][i] = 0; // Clear the spot in GBA
                stoppedShapeArray[x][i] = 0; // Clear the spot in SSA
                coorX = coordinateArray[x][i].x;
                coorY = coordinateArray[x][i].y;
                ctx.fillStyle = 'white';
                ctx.fillRect(coorX, coorY, 21, 21);
            }
        }
    }
}
 
// 9. Rotate the Tetromino
// ***** SLIDE *****
function RotateTetromino()
{
    let newRotation = new Array();
    let tetrominoCopy = curTetromino;
    let curTetrominoBU;
 
    for(let i = 0; i < tetrominoCopy.length; i++)
    {
        // Here to handle a error with a backup Tetromino
        // We are cloning the array otherwise it would 
        // create a reference to the array that caused the error
        curTetrominoBU = [...curTetromino];
 
        // Find the new rotation by getting the x value of the
        // last square of the Tetromino and then we orientate
        // the others squares based on it [SLIDE]
        let x = tetrominoCopy[i][0];
        let y = tetrominoCopy[i][1];
        let newX = (GetLastSquareX() - y);
        let newY = x;
        newRotation.push([newX, newY]);
    }
    DeleteTetromino();
 
    // Try to draw the new Tetromino rotation
    try{
        curTetromino = newRotation;
        DrawTetromino();
    }  
    // If there is an error get the backup Tetromino and
    // draw it instead
    catch (e){ 
        if(e instanceof TypeError) {
            curTetromino = curTetrominoBU;
            DeleteTetromino();
            DrawTetromino();
        }
    }
}
 
// Gets the x value for the last square in the Tetromino
// so we can orientate all other squares using that as
// a boundary. This simulates rotating the Tetromino
function GetLastSquareX()
{
    let lastX = 0;
     for(let i = 0; i < curTetromino.length; i++)
    {
        let square = curTetromino[i];
        if (square[0] > lastX)
            lastX = square[0];
    }
    return lastX;
}