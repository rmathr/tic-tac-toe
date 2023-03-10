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
            board[i].textContent = `${board[i].value}`
            DOMinteract.gameBoard.appendChild(board[i])
        }
    }
    render()
    const getBoard = () => board
    return { getBoard, gameBoard, render } 
})()

const changeValue = (function (){
    let value = 0;
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
                    console.log(e.target.value);
                    roundSwitch.switchPlayerTurn()
                    result = getWinner()
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


const getWinner = function(){
    const board = Gameboard.getBoard()
    const players = roundSwitch.players

    const Winner = function(cellValue){
    return players.filter(player => player.value == cellValue).map(player => player.name)
    }

    const equal = function(a,b,c){
        return a === b && b === c && a !== '0';
    }
    if(equal(board[0].value, board[1].value, board[2].value)){
        DOMinteract.userText.textContent = `${Winner(board[0].value)}`
        return true
    }
    if(equal(board[3].value, board[4].value, board[5].value)){
        DOMinteract.userText.textContent = `${Winner(board[3].value)}`
        return true
    }
    if(equal(board[6].value, board[7].value, board[8].value)){
        DOMinteract.userText.textContent = `${Winner(board[6].value)}`
        return true
    }
    if(equal(board[0].value, board[3].value, board[6].value)){
        DOMinteract.userText.textContent = `${Winner(board[0].value)}`
        return true
    }
    if(equal(board[1].value, board[4].value, board[7].value)){
        DOMinteract.userText.textContent = `${Winner(board[1].value)}`
        return true
    }
    if(equal(board[2].value, board[5].value, board[8].value)){
        DOMinteract.userText.textContent = `${Winner(board[2].value)}`
        return true
    }
    if(equal(board[0].value, board[4].value, board[8].value)){
        DOMinteract.userText.textContent = `${Winner(board[0].value)}`
        return true
    }
    if(equal(board[2].value, board[4].value, board[6].value)){
        DOMinteract.userText.textContent = `${Winner(board[2].value)}`
        return true
    }
}

const automaticPlayController = function(){
    const board = Gameboard.getBoard()
    const values = []
    for(let i = 0; i < board.length; i++){
        values[i] = {
                        ref: i,
                        value: board[i].value,
                        id: board[i].id
                    }
    }
    
    const test = DOMinteract.hookDOMelement('button1')
    
    return values[0].id
}

