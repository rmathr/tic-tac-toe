function createElementWithClass(type, className){
    const element = document.createElement(type)
    element.classList.add(`${className}`)
    return element
}

const Gameboard = (function(){
    const gameBoard = document.getElementById('gameBoard')
    const rows = 3
    const columns = 3
    const board = []
    for (let i = 0; i < rows*columns; i++){
        board[i] = createElementWithClass('button', 'cell')
        board[i].id = `button${i}`
        board[i].value = 0
        board[i].textContent = `${board[i].value}`
        gameBoard.appendChild(board[i])
    }
    const getBoard = () => board
    return { getBoard, gameBoard } 
})()

const changeValue = (function (){
    let value = 0;
    const board = Gameboard.gameBoard
    board.addEventListener('click', handleClick, false)
    function handleClick(e) {
        const { nodeName } = e.target;
        if (nodeName === 'BUTTON') {
            if(e.target.value === '0'){
                value = roundSwitch.getActivePlayer().value
                e.target.value = `${value}`
                e.target.textContent = `${value}`
                console.log(e.target.value);
                roundSwitch.switchPlayerTurn()
            }
        }
      }
    
})()


const roundSwitch = (function (){
    const board = Gameboard.getBoard()
    const players = [
        {
            name: "Player One",
            value: 1
        },
        {
            name: "Player Two",
            value: 2
        }
    ]
    let activePlayer = players[0]
    
    const switchPlayerTurn = function(){
        activePlayer = activePlayer === players[0] ? players[1] : players[0]
    }
    const getActivePlayer = () => activePlayer

    return { players, switchPlayerTurn, getActivePlayer }
})()




                                                                                      




// function Gameboard() {
//     const rows = 3
//     const columns = 3
//     const board = [...Array(rows)].map(_=>Array(columns).fill(Cell()))
//     const board = [...Array(rows)].map(_=>Array(columns))
//     const getBoard = () => board;

//     const dropToken = (column, player) => {
//         // Our board's outermost array represents the row,
//         // so we need to loop through the rows, starting at row 0,
//         // find all the rows that don't have a token, then take the
//         // last one, which will represent the bottom-most empty cell
//         const availableCells = board.filter((row) => row[column].getValue() === 0).map(row => row[column]);
    
//         // If no cells make it through the filter, 
//         // the move is invalid. Stop execution.,
        
//         if (!availableCells.length) return;
    
//         // Otherwise, I have a valid cell, the last one in the filtered array
//         const lowestRow = availableCells.length - 1;
//         board[lowestRow][column].addToken(player);
//       };
//  return getBoard
// }

// function Cell(){
//     let value = 0
//     const addValue = (player) => {value = player}
//     const getValue = () => value
//     return { addValue, getValue }
// }

function GameController(
    playerOneName = "Player One",
    playerTwoName = "Player Two"
  ) {
    const board = Gameboard();
  
    const players = [
      {
        name: playerOneName,
        token: 1
      },
      {
        name: playerTwoName,
        token: 2
      }
    ];
  
    let activePlayer = players[0];
  
    const switchPlayerTurn = () => {
      activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };
    const getActivePlayer = () => activePlayer;
  
    const printNewRound = () => {
      board.printBoard();
      console.log(`${getActivePlayer().name}'s turn.`);
    };
  
    const playRound = (column) => {
      console.log(
        `Dropping ${getActivePlayer().name}'s token into column ${column}...`
      );
      board.dropToken(column, getActivePlayer().token);
  
      /*  This is where we would check for a winner and handle that logic,
          such as a win message. */
  
      switchPlayerTurn();
      printNewRound();
    };
  
    printNewRound();
  
    return {
      playRound,
      getActivePlayer,
      getBoard: board.getBoard
    };
  }