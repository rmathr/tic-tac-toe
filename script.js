function createElementWithClass(type, className){
    const element = document.createElement(type)
    element.classList.add(`${className}`)
    return element
}

const DOMinteract = (function(){
    const userText = document.getElementById('userText')
    const resetGameBoard = document.getElementById('resetGameBoard')
    const gameBoard = document.getElementById('gameBoard')
    
    const hookDOMelement = function (idName){
        const elem = document.getElementById(`${idName}`)
        return elem
    }

    return { userText, resetGameBoard, gameBoard, hookDOMelement }
})()

const Gameboard = (function(){
    const gameBoard = document.getElementById('gameBoard')
    const rows = 3
    const columns = 3
    const board = []

    const render = function(){
        for (let i = 0; i < rows*columns; i++){
            board[i] = createElementWithClass('button', 'cell')
            board[i].id = `button${i}`
            board[i].value = 0
            board[i].textContent = `${board[i].value == 0? '': board[i].value}`
            DOMinteract.gameBoard.appendChild(board[i])
        }
    }
    render()

    
    const getAvailableCells = function(){
        const availableBoard = []
        
        for(let i = 0; i < board.length; i++){
            availableBoard[i] = {
                            value: board[i].value,
                            id: board[i].id,
                            ref: i
                        }
                    }
        return availableBoard
    }

    const getAvailableCellsIndex = function (){
        let indexes = Gameboard.getAvailableBoard().filter(item => item.value == '0')
        .map(item => item.ref)
        return indexes
    }

    const getBoard = () => board

    const getAvailableBoard = () => getAvailableCells()

    const getIndexes = () => getAvailableCellsIndex()

    const getBoardValues = function() {
        const availableBoard = []
        const availableCells = getAvailableCells()
        for(let i = 0; i < availableCells.length; i++){
            if(availableCells[i].value != 0){
                availableBoard[i] = availableCells[i].value
            } else{
                availableBoard[i] = availableCells[i].ref
            }
        }
        return availableBoard
    } 

    const getAllEmptyCellsIndex = function(currentBoard){
        return currentBoard.filter(i => i != 'X' && i != 'O' )
    }
    const getEmptyCells = (currentBoard) => getAllEmptyCellsIndex(currentBoard)
    // getAvailableCells().map(item => item.value)
    return { getBoard, gameBoard, render, getAvailableBoard, getIndexes, getBoardValues, getEmptyCells } 
})()

const changeValue = (function (){
    let value = '0';
    let result = false
     
    const resetBoard = (function(){
        DOMinteract.resetGameBoard.addEventListener('click', e=>{
            e.preventDefault()
            Gameboard.getBoard().forEach(e => e.remove());
            Gameboard.render()
            DOMinteract.userText.textContent = ''
            roundSwitch.resetActivePlayer()
            result = false
        })
    })()

    DOMinteract.gameBoard.addEventListener('click', handleClick, false)
    
    function handleClick(e) {
        const { nodeName } = e.target;
        if (nodeName === 'BUTTON') {
            if(e.target.value === '0' && !result){
                    value = roundSwitch.getActivePlayer().value
                    e.target.value = `${value}`
                    e.target.textContent = `${value}`
                    // e.target.textContent = `${value == '1'? 'X': 'O'}`
                    console.log(e.target.value)
                    roundSwitch.switchPlayerTurn()
                    result = getWinner(Gameboard.getBoardValues(), e.target.value)
                    if (value == 'X'){
                        setTimeout( function() { automaticPlayController().executeAutomaticPlay(); }, 500); 
                    }
            }
        }
      } 
})()

const roundSwitch = (function (){
    const players = [
        {
            name: "Player One",
            value: 'X'
        },
        {
            name: "Player Two",
            value: 'O'
        }
    ]
    let activePlayer = players[0]
    
    const resetActivePlayer = function(){
        activePlayer = players[0]
        return activePlayer
    }
    
    const switchPlayerTurn = function(){
        activePlayer = activePlayer === players[0] ? players[1] : players[0]
    }
    const getActivePlayer = () => activePlayer

    return { players, switchPlayerTurn, getActivePlayer, resetActivePlayer }
})()


const getWinner = function(currentBoard, playerValue){
   
    const players = roundSwitch.players

    const values = [] 
    for(let i = 0; i < currentBoard.length; i++){
        values[i] = currentBoard[i].value 
    }
    
    const Winner = function(cellValue){
    return players.filter(player => player.value == cellValue).map(player => player.name)
    }

    if((currentBoard[0] == playerValue && currentBoard[1] == playerValue && currentBoard[2] == playerValue)||
        (currentBoard[3] == playerValue && currentBoard[4] == playerValue && currentBoard[5] == playerValue)||
        (currentBoard[6] == playerValue && currentBoard[7] == playerValue && currentBoard[8] == playerValue)||
        (currentBoard[0] == playerValue && currentBoard[3] == playerValue && currentBoard[6] == playerValue)||
        (currentBoard[1] == playerValue && currentBoard[4] == playerValue && currentBoard[7] == playerValue)||
        (currentBoard[2] == playerValue && currentBoard[5] == playerValue && currentBoard[8] == playerValue)||
        (currentBoard[0] == playerValue && currentBoard[4] == playerValue && currentBoard[8] == playerValue)||
        (currentBoard[2] == playerValue && currentBoard[4] == playerValue && currentBoard[6] == playerValue)){
        // DOMinteract.userText.textContent = `${Winner(playerValue)}`
        return true
    }
    // if(values.filter(value => value == '0').length === 0){
    //     DOMinteract.userText.textContent = "It's a draw!"
    //     return false
    // }
    return false
}

const automaticPlayController = function(){
  
    const automaticPlayer = function(){
    const board = Gameboard.getAvailableBoard()
    const values = Gameboard.getBoardValues()
    const availableCells = Gameboard.getIndexes()
    const playerValues = roundSwitch.players.map(player => player.value)

    const cellPicked = minimax(values, 'O').index
    console.log(cellPicked)
    const pickedID = DOMinteract.hookDOMelement(`${board[cellPicked].id}`)
    if(availableCells.length > 0){
        pickedID.click()
    }
}


    const executeAutomaticPlay = () => automaticPlayer()

    return { executeAutomaticPlay }
}



function minimax(availableBoard, playerValue){
        const humanValue = 'X'
        const aiValue = 'O'
    
        let availableCellsIndex = Gameboard.getEmptyCells(availableBoard)
        
        if(getWinner(availableBoard, humanValue)){
            return { score: -10 }
        } else if(getWinner(availableBoard, aiValue)){
            return { score: 10 }
        } 
        else if(availableCellsIndex.length === 0){
            return { score: 0 }
        }
    
        let testPlaysInfo = []
    
        for(let i = 0; i < availableCellsIndex.length; i++){
            let currentTestPlayInfo = {}
            currentTestPlayInfo.index = availableBoard[availableCellsIndex[i]]
            availableBoard[availableCellsIndex[i]] = playerValue
            
            if(playerValue == aiValue){
                let result = minimax(availableBoard, humanValue)
                currentTestPlayInfo.score = result.score
            } else {
                let result = minimax(availableBoard, aiValue)
                currentTestPlayInfo.score = result.score
            }
            availableBoard[availableCellsIndex[i]] = currentTestPlayInfo.index
            testPlaysInfo.push(currentTestPlayInfo)
        }
        
        let bestTestPlay
        if(playerValue == aiValue){
            let bestScore = -10000;
            for(let i = 0; i < testPlaysInfo.length; i++){
                if(testPlaysInfo[i].score > bestScore){
                    bestScore = testPlaysInfo[i].score
                    bestTestPlay = i
                }
            }
        } else {
            let bestScore = 10000
            for(let i = 0; i < testPlaysInfo.length; i++){
                if(testPlaysInfo[i].score < bestScore){
                    bestScore = testPlaysInfo[i].score
                    bestTestPlay = i
                }
            }
        }
        return testPlaysInfo[bestTestPlay]
    }

