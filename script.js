function createElementWithClass(type, className){
    const element = document.createElement(type)
    element.classList.add(`${className}`)
    return element
}

const DOMinteract = (function(){
    const userText = document.getElementById('userText')
    const resetGameBoard = document.getElementById('resetGameBoard')
    const gameBoard = document.getElementById('gameBoard')
    const aiDifficulty = document.getElementById('aiDifficulty')

    
    const hookDOMelement = function (idName){
        const elem = document.getElementById(`${idName}`)
        return elem
    }

    return { userText, resetGameBoard, gameBoard, aiDifficulty, hookDOMelement }
})()

const Gameboard = (function(){
    const board = []

    const render = function(){
        for (let i = 0; i < 9; i++){
            board[i] = createElementWithClass('button', 'cell')
            board[i].id = `button${i}`
            board[i].value = '0'
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
            if(availableCells[i].value != '0'){
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
    return { getBoard, render, getAvailableBoard, getIndexes, getBoardValues, getEmptyCells } 
})()

const changeValue = (function (){
    let value = '0';
    let result = false
     
    DOMinteract.gameBoard.addEventListener('click', handleClick, false)

    DOMinteract.resetGameBoard.addEventListener('click', e=>{
        e.preventDefault()
        result = resetBoard()
    })

    DOMinteract.aiDifficulty.addEventListener('change', e =>{
        e.preventDefault()    
        result = resetBoard()
    })

    
    function handleClick(e) {
        const { nodeName } = e.target;
        if (nodeName === 'BUTTON') {
            if(e.target.value === '0' && !result){
                    value = roundSwitch.getActivePlayer().value
                    e.target.value = `${value}`
                    e.target.textContent = `${value}`
                    e.target.classList.add(`${roundSwitch.getActivePlayer().class}`)
                    // e.target.textContent = `${value == '1'? 'X': 'O'}`
                    console.log(e.target.value)
                    roundSwitch.switchPlayerTurn()
                    result = handleWin.verifyWin(Gameboard.getBoardValues(), e.target.value)
                    handleWin.defineWinner(e.target.value)
                    if (value == 'X'){
                        setTimeout( function() { automaticPlayController().executeAutomaticPlay(); }, 400); 
                    }
            }
        }
      } 
})()

const resetBoard = function(){
    Gameboard.getBoard().forEach(e => e.remove());
    Gameboard.render()
    DOMinteract.userText.textContent = ''
    roundSwitch.resetActivePlayer()
    return false
}

const roundSwitch = (function (){
    const players = [
        {
            name: "You",
            value: 'X',
            class: 'x-cell'
        },
        {
            name: "Computer",
            value: 'O',
            class: 'o-cell'
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


const handleWin = (function(){
    const values = []
    const verifyWin = function(currentBoard, playerValue){
        for(let i = 0; i < currentBoard.length; i++){
            values[i] = currentBoard[i].value 
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
        if(values.filter(value => value == '0').length === 0){
            // DOMinteract.userText.textContent = "It's a draw!"
            return false
        }
        return false
    }

    const defineWinner = function(cellValue){
        
        
        if(verifyWin(Gameboard.getBoardValues(), cellValue)){
            const players = roundSwitch.players
            DOMinteract.userText.textContent = `Game over! ${players.filter(player => player.value == cellValue).map(player => player.name)} won!`  
        }
        else {
            if(Gameboard.getIndexes().length === 0){
                DOMinteract.userText.textContent = "It's a draw!"
            }
        }
        }

    return { verifyWin, defineWinner }
})()

const handleDifficulty = (function (){
    const defineEasyDifficulty = function(){
        const board = Gameboard.getAvailableBoard()
        const availableCells = board.filter(item => item.value == '0').map(cell => cell.id)
        const cellPicked = Math.floor(Math.random() * availableCells.length)
        const pickedID = DOMinteract.hookDOMelement(`${availableCells[cellPicked]}`)
        if (availableCells.length > 0) {
            pickedID.click()
        }
    }
    const defineNormalDifficulty = function(){
        const board = Gameboard.getAvailableBoard()
        const availableCells = board.filter(item => item.value == '0').map(cell => cell.id)
        let cellPicked
        if(board.filter(item => item.value == '0').length === 8){
            cellPicked = handleFirstRoundLogic(board)
        }else {
            cellPicked = Gameboard.getEmptyCells(Gameboard.getBoardValues())[Math.floor(Math.random() * availableCells.length)]
        }
        if (availableCells.length > 0) {
            DOMinteract.hookDOMelement(`${board[cellPicked].id}`).click()
        }
        return cellPicked
    }
    const defineHardDifficulty = function(){
        const humanValue = roundSwitch.players[0].value
        const board = Gameboard.getAvailableBoard()
        const availableCells = board.filter(item => item.value == '0').map(cell => cell.id)
        let cellPicked
        if(board.filter(item => item.value == '0').length === 8){
            cellPicked = handleFirstRoundLogic(board)
        } else {
            const values = Gameboard.getBoardValues()
            const indexes = Gameboard.getEmptyCells(values)
            Loop:
            for(let i = 0; i < indexes.length; i++){
                let newBoard = values
                let valueHolder = newBoard[indexes[i]]
                newBoard[indexes[i]] = humanValue
                if(handleWin.verifyWin(newBoard, humanValue)){
                    cellPicked = indexes[i]
                    break Loop
                } 
                cellPicked = indexes[Math.floor(Math.random() * availableCells.length)]
                newBoard[indexes[i]] = valueHolder
            }
        }
        if (availableCells.length > 0) {
            DOMinteract.hookDOMelement(`${board[cellPicked].id}`).click()
        }
    }
    const defineImpossibleDifficulty = function(){
        const board = Gameboard.getAvailableBoard()
        const values = Gameboard.getBoardValues()
        const availableCells = Gameboard.getIndexes()
        const cellPicked = minimax(values, roundSwitch.players[1].value).index
        // console.log(cellPicked)
        if(availableCells.length > 0){
            const pickedID = DOMinteract.hookDOMelement(`${board[cellPicked].id}`)
            pickedID.click()
        }
    }

    const executeEasy = () => defineEasyDifficulty()
    const executeNormal = () => defineNormalDifficulty()
    const executeHard = () => defineHardDifficulty()
    const executeImpossible = () => defineImpossibleDifficulty()

    return { executeEasy, executeNormal, executeHard, executeImpossible }
})()


function handleFirstRoundLogic(board){
    const availableCells = board.filter(item => item.value == '0').map(cell => cell.id)
    if(board[0].value != '0' || board[2].value != '0' || board[6].value != '0' || board[8].value != '0'){
       return cellPicked = board[4].ref
    } else if(board[4].value != '0'){
        return cellPicked = Math.floor(Math.random() * availableCells.length)
    } else {
        for(let x = 0; x < board.length; x++){
            if(board[x].value != '0'){
               return cellPicked = x == 1 ? board[7].ref :
                x == 3 ? board[5].ref : 
                x == 5 ? board[3].ref :
                board[1].ref
            }
        }
    }  
}



const automaticPlayController = function(){
  
    const automaticPlayer = function(){
        if (DOMinteract.aiDifficulty.value === 'easy') {
            handleDifficulty.executeEasy()
        }
        if (DOMinteract.aiDifficulty.value === 'normal') {
            handleDifficulty.executeNormal()
        }
        if (DOMinteract.aiDifficulty.value === 'hard') {
            handleDifficulty.executeHard()
        }
        if (DOMinteract.aiDifficulty.value === 'impossible') {
            handleDifficulty.executeImpossible()
        }   
    }

    const executeAutomaticPlay = () => automaticPlayer()

    return { executeAutomaticPlay }
}

function minimax(availableBoard, playerValue){
        const humanValue = 'X'
        const aiValue = 'O'
    
        let availableCellsIndex = Gameboard.getEmptyCells(availableBoard)
        
        if(handleWin.verifyWin(availableBoard, humanValue)){
            return { score: -10 }
        } else if(handleWin.verifyWin(availableBoard, aiValue)){
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

