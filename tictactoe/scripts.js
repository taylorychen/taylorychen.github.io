const squares = document.getElementsByClassName('square');

const turnTracker = document.querySelector('#turnAnnounce .turn');
const winnerAnnounce = document.getElementById('winnerAnnounce');
const turnAnnounce = document.getElementById('turnAnnounce');

let turn = true;    
const X = 'X';
const O = 'O';
let shape = turn ? X : O;

/**
 * [0] [1] [2]
 * [3] [4] [5]
 * [6] [7] [8]
 */
const WIN_CONDITIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

reset();

function reset() {
    turn = true;    //true = x, false = o
    shape = turn ? X : O;
    turnAnnounce.style.display = 'inherit';
    turnTracker.classList.toggle(X, true);
    turnTracker.classList.remove(O);
    turnTracker.innerHTML = X;
    winnerAnnounce.style.display = 'none';
    
    for(let square of squares) {
        square.classList.remove(X);
        square.classList.remove(O);
        square.innerHTML = "";
        square.addEventListener('click', clicked, { once: true });
    }
}

function clicked(e) {
    const square = e.target;
    
    drawGraphics(square, shape);

    if(checkWin(shape)) {
        finishGame(true);
        return;
    }
    else if(checkDraw()) {
        finishGame(false);
        return;
    }

    turn = !turn;
    shape = turn ? X : O;
}

function drawGraphics(square, shape) {
    let notShape = !turn ? X : O;
    square.classList.add(shape);
    square.innerHTML = shape;


    turnTracker.classList.toggle(shape);
    turnTracker.classList.toggle(notShape);
    turnTracker.innerHTML = notShape;
}

//returns true if someone won
function checkWin(shape) {
    for(let condition of WIN_CONDITIONS) {
        let count = 0;
        for(let i of condition) {
            if(!squares[i].classList.contains(shape))
                break;
            count++;
            if(count === 3)
                return true;
        }
    }
    return false;
}

//returns true if the game is a draw
function checkDraw() {
    let count = 0;
    for(let square of squares) {
        if(square.classList.contains(X) || square.classList.contains(O))
            count++;
    }
    return count === 9;
}

//if winOrDraw is true, the game was won, otherwise it was a draw
function finishGame(winOrDraw) {
    turnAnnounce.style.display = 'none';
    winnerAnnounce.style.display = 'inherit';

    for(let square of squares) {
        square.removeEventListener('click', clicked);
    }

    if(winOrDraw){
        const winner = document.querySelector('#winnerAnnounce .turn');
        winner.classList.add(shape);
        winner.innerHTML = shape;
    }
    else {
        winnerAnnounce.innerHTML = "Draw!";
    }
}