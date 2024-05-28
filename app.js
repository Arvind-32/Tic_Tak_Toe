const editPlayer1BtnElement = document.getElementById("edit-player1-btn");
const editPlayer2BtnElement = document.getElementById("edit-player2-btn");

// Overlay and Backdrop Variables
const overlayElement = document.getElementById("config-overlay");
const backdropElement = document.getElementById("backdrop");

const overlayCancelBtnElement = document.getElementById("config-overlay-cancel-btn");


// Editing Player Name
let editedPlayer = 0


//For choosing the players dynamically
let activePlayer = 0

let currentRound = 1

let gameIsOver = false // initally

const players = [
    {
        name:"",
        symbol:"X"
    },

    {
        name:"",
        symbol:"O"
    }
];


// For storing the game data

const gameData = [
    [0,0,0],
    [0,0,0],
    [0,0,0]
]



// Open Overlay and Backdrop Function
function openOverlayElement(event){
    editedPlayer = +event.target.dataset.playerid;
    overlayElement.style.display = "block";
    backdropElement.style.display = "block";
}

editPlayer1BtnElement.addEventListener("click", openOverlayElement)
editPlayer2BtnElement.addEventListener("click", openOverlayElement)




// Close Overlay and Backdrop Function
function closeOverlayElement(){
    overlayElement.style.display = "none";
    backdropElement.style.display = "none";

    // removes the error message shown 
    formElement.firstElementChild.classList.remove("error");
    errorOutputElement.textContent = "";

    // clears the input field
    document.getElementById("playername").value = "";
}


overlayCancelBtnElement.addEventListener("click", closeOverlayElement)
backdropElement.addEventListener("click", closeOverlayElement)



//Changing the active player name used in Game Field Elements
const activePlayerNameElement = document.getElementById("active-player-name");




// Form 

const formElement = document.querySelector("form");
const errorOutputElement = document.getElementById("config-errors")

function savePlayerConfig(event){
    event.preventDefault();
    const formData = new FormData(event.target);
    const enteredPlayerName = formData.get("playername").trim();

    if(enteredPlayerName.length === 0){
        event.target.firstElementChild.classList.add("error");
        errorOutputElement.textContent = "Please enter a valid name!";
        return;
    }

    const updatedPlayerDataElement = document.getElementById("player-" + editedPlayer + "-data");
    updatedPlayerDataElement.children[1].textContent =  enteredPlayerName;

    if(editedPlayer === 1){
        players[0].name = enteredPlayerName;
    }
    else{
        players[1].name = enteredPlayerName;
    }

    closeOverlayElement()
}

formElement.addEventListener("submit", savePlayerConfig)



// Reset Game Button
function resetGameStatus(){
    activePlayer = 0;
    currentRound = 1;
    gameIsOver = false;
    gameOverElement.firstElementChild.innerHTML = 'You Won <span id="winner-name">PLAYER NAME</span>!';
    gameOverElement.style.display = 'none';

    let gameBoardIndex = 0;
    for(i=0; i<=2; i++){
        for(j=0; j<=2; j++){
            gameData[i][j] = 0;
            const gameBoardItemElement = gameBoardElements.children[gameBoardIndex];
            gameBoardItemElement.textContent = "";
            gameBoardItemElement.classList.remove("default");
            gameBoardIndex++;
        }
    }
}



// Start Game Button
const startNewGameBtnElement = document.getElementById("start-game-btn");
const gameAreaElement = document.getElementById("active-game");

function startNewGame(){
    if(players[0].name === "" || players[1].name === ""){
        alert("Please enter the player names first!");
        return;
    }

    resetGameStatus();

    activePlayerNameElement.textContent = players[activePlayer].name;
    gameAreaElement.style.display = "block";
}

startNewGameBtnElement.addEventListener("click", startNewGame)




// Game Field Elements
const gameFieldElements = document.querySelectorAll("#game-board li")
const gameBoardElements = document.getElementById("game-board")


function switchPlayer(){
    if(activePlayer === 0){
        activePlayer = 1;
    }
    else{
        activePlayer = 0;
    }
    activePlayerNameElement.textContent = players[activePlayer].name;
}


function selectGameField(event){

    if(event.target.tagName !== 'LI' || gameIsOver){
        return;
    }

    const selectedField = event.target;
    selectedColumn = selectedField.dataset.col -1; // as array starts from 0
    selectedRow = selectedField.dataset.row -1; // as array starts from 0

    if(gameData[selectedRow][selectedColumn]>0){
        alert("Please select an empty field")
        return;
    }

    selectedField.textContent = players[activePlayer].symbol;
    selectedField.classList.add("default");

    gameData[selectedRow][selectedColumn] = activePlayer + 1;
    
    const winnerId = checkForGameOver();
    
    if(winnerId !==0){
        endGame(winnerId);
    }

    currentRound++;

    switchPlayer();
}

for(const gameFieldElement of gameFieldElements){
    gameFieldElement.addEventListener("click", selectGameField)
}




// Game Winner Logic

function checkForGameOver(){

    // Checking the rows
    for(let i=0; i<=2; i++){
        if(gameData[i][0] > 0 && 
            gameData[i][0] === gameData[i][1] && 
            gameData[i][1] === gameData[i][2])
            {
            return gameData[i][0];
            }
    }

    // Checking the columns
    for(let i=0; i<=2; i++){
        if(gameData[0][i] > 0 && 
            gameData[0][i] === gameData[1][i] && 
            gameData[0][i] === gameData[2][i])
            {
            return gameData[0][i];
            }
    }
    
    // Checking the diagonals: Top left to bottom right
    if(gameData[0][0] > 0 && 
        gameData[0][0] === gameData[1][1] && 
        gameData[1][1] === gameData[2][2])
        {
        return gameData[0][0];
    }

    // Checking the diagonals: Bottom left to top right
    if(gameData[2][0] > 0 && 
        gameData[2][0] === gameData[1][1] && 
        gameData[1][1] === gameData[0][2])
        {
        return gameData[2][0];
    }

    if(currentRound === 9){
        return -1;
    }

    return 0;
}


// Outputing the Game over 

const gameOverElement = document.getElementById("game-over");

function endGame(winnerId){
    gameIsOver = true;
    gameOverElement.style.display = "block";

    if(winnerId > 0){
        const winnerName = players[winnerId-1].name;
        gameOverElement.children[0].children[0].textContent = winnerName;
    }

    else{
        gameOverElement.children[0].textContent = "It's a Draw";
    }
    
}