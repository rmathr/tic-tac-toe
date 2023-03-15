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

    const getBoardValues = () => getAvailableCells().map(item => item.value)

    return { getBoard, gameBoard, render, getAvailableBoard, getIndexes, getBoardValues } 
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
                    e.target.textContent = `${value == '1'? 'X': 'O'}`
                    console.log(e.target.value)
                    roundSwitch.switchPlayerTurn()
                    result = getWinner(e.target.value)
                    if (value == '1'){
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
            value: 1
        },
        {
            name: "Player Two",
            value: 2
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


const getWinner = function(playerValue){
    const board = Gameboard.getBoard()
    const players = roundSwitch.players

    const values = [] 
    for(let i = 0; i < board.length; i++){
        values[i] = board[i].value 
    }
    
    const Winner = function(cellValue){
    return players.filter(player => player.value == cellValue).map(player => player.name)
    }

    if((board[0].value == playerValue && board[1].value == playerValue && board[2].value == playerValue)||
        (board[3].value == playerValue && board[4].value == playerValue && board[5].value == playerValue)||
        (board[6].value == playerValue && board[7].value == playerValue && board[8].value == playerValue)||
        (board[0].value == playerValue && board[3].value == playerValue && board[6].value == playerValue)||
        (board[1].value == playerValue && board[4].value == playerValue && board[7].value == playerValue)||
        (board[2].value == playerValue && board[5].value == playerValue && board[8].value == playerValue)||
        (board[0].value == playerValue && board[4].value == playerValue && board[8].value == playerValue)||
        (board[2].value == playerValue && board[4].value == playerValue && board[6].value == playerValue)){
        DOMinteract.userText.textContent = `${Winner(playerValue)}`
        return true
    }
    if(values.filter(value => value == '0').length === 0){
        DOMinteract.userText.textContent = "It's a draw!"
        return false
    }
}

const automaticPlayController = function(){
    
    const playerValues = roundSwitch.players.map(player => player.value)

    const automaticPlayer = function(){
        const values = Gameboard.getAvailableBoard()
        const availableCells = values.filter(item => item.value == 0).map(cell => cell.id)
        const cellPicked = Math.floor(Math.random()*availableCells.length)
        const pickedID = DOMinteract.hookDOMelement(`${availableCells[cellPicked]}`)
        if(availableCells.length > 0){
            pickedID.click()
        }
    }
    const executeAutomaticPlay = () => automaticPlayer()
    
    const bestPlayPossible = minimax(Gameboard.getBoardValues(), playerValues[2])

    return { executeAutomaticPlay, bestPlayPossible }
}

const minimax = function(availableBoard, playerValue){
    // const elem = []
    // elem[0] = availableBoard[0]    
    // return elem
    const humanValue = roundSwitch.players[0].value
    const aiValue = roundSwitch.players[1].value

    const currentBoardValues = Gameboard.getBoardValues()
    const availableCellsIndex = Gameboard.getIndexes()
    
    if(getWinner(humanValue)){
        return { score: -1 }
    } else if(getWinner(aiValue)){
        return { score: 1 }
    } else if(availableCellsIndex.length === 0){
        return { score: 0 }
    }



    const testPlaysInfo = []
    for(let i = 0; i < availableCellsIndex.length; i++){
        const currentTestPlayInfo = {}
        currentTestPlayInfo.index = currentBoardValues[availableCellsIndex[i]]
        currentBoardValues[availableCellsIndex[i]] = playerValue
        if(playerValue === aiValue){
            const result = minimax(currentBoardValues, humanValue)
            currentTestPlayInfo.score = result.score
        } else {
            const result = minimax(currentBoardValues, aiValue)
            currentTestPlayInfo.score = result.score
        }
        currentBoardValues[availableCellsIndex[i]] = currentTestPlayInfo.index
        testPlaysInfo.push(currentTestPlayInfo)
    }
    let bestTestPlay = null
    if(playerValue === aiValue){
        let bestScore = -Infinity;
        for(let i = 0; i < testPlaysInfo.length; i++){
            if(testPlaysInfo[i].score > bestScore){
                bestScore = testPlaysInfo[i].score
                bestTestPlay = i
            }
        }
    } else {
        let bestScore = Infinity
        for(let i = 0; i < testPlaysInfo.length; i++){
            if(testPlaysInfo[i].score < bestScore){
                bestScore = testPlaysInfo[i].score
                bestTestPlay = i
            }
        }
    }
    return testPlaysInfo[bestTestPlay]

}


