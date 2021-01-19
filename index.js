
const GRID_COLS = 7; // number of columns
const GRID_ROWS = 6; // number of rows

let iCurCell = 0;
let iCurFilledCell = 0;

function drawDivGrid(){

    var htmlElements = "";
    for (var i = 0; i < GRID_ROWS; i++)
        for (var j = 0; j < GRID_COLS; j++)
        {
            var data = 'data-row=' + i + ' data-column=' + j;
            htmlElements += '<div ' + data + ' style="border-width:1px;border-color:black;border-style:solid;"></div>';
        }

    var container = document.getElementById("grid");
    container.innerHTML = htmlElements;
}

document.addEventListener('DOMContentLoaded', ()=> { // Arrow function
    const cells = document.querySelectorAll('.grid div')
    const result = document.querySelector('#result')
    const displayCurrentPlayer = document.querySelector('#current-player')
    let currentPlayer = 1
    displayCurrentPlayer.style.color = (currentPlayer === 1) ? "green" : "blue";

    // define anonymous "self-invoking" function expressions for each grid cell to be invokded on click event
    for (var i = 0; i < cells.length; i++)
    {
        ((index)=> // Arrow function-short syntax for writing function expressions instead of function(index)
        {
            //add onclick event function in each cell
            cells[i].onclick = ()=> {   // Arrow function
                if(result.innerHTML)
                    return;

                // Fill the last unoccupied cell in the column of current index 
                for (let k = 5; k >= 0; k--)
                {
                    var iEmptyCell = index + 7*k;
                    if(iEmptyCell > 41)
                        continue;
                        
                    var cellClasses = cells[iEmptyCell].classList;
                    if (cellClasses.length == 0)
                    {
                        iCurCell = index;
                        console.log(iEmptyCell + " is empty...filling up");
                        iCurFilledCell = iEmptyCell;

                        cellClasses.add('Player' + currentPlayer);
                        // See if current player wins with this move
                        checkWinner();
                        if(result.innerHTML)
                            return;

                        //toggle the player
                        currentPlayer = (currentPlayer === 1)? 2: 1;
                        displayCurrentPlayer.innerHTML = 'Player' + currentPlayer;
                        displayCurrentPlayer.style.color = (currentPlayer === 1) ? "green" : "blue";                 
                        break;
                    }
                    else
                        console.log(iEmptyCell + " is filled...checking next empty cell.");
                }
            }
        })(i);
    }

    function updateResults(strCellPlayers)
    {
        if(!strCellPlayers.length)
            return;

        if(currentPlayer === 1 && strCellPlayers.includes("Player1Player1Player1Player1") ||
           currentPlayer === 2 && strCellPlayers.includes("Player2Player2Player2Player2"))
                result.innerHTML = "Player" + currentPlayer + " wins!";
    }

    /**
     * This function is called on each user action and try to see if this player is winner by 
     * concatinating player tags in the current row/column/forward diag/reverse diagonal cells.
     */
    function checkWinner()
    {
        if(result.innerHTML)
            return;

        let row = cells[iCurFilledCell].dataset.row;
        let col = cells[iCurFilledCell].dataset.column;
        row = parseInt(row);
        col = parseInt(col);

        console.log("Filling up emtpty cell "+ row + col);

        let strRowPlayers="";
        // check the current row for win
        for (var i = 0; i < GRID_COLS; i++)
        {
            let index = row * GRID_COLS + i;
            let cellTag = cells[index].className;
            strRowPlayers += cellTag.length ? cellTag : "-";
            console.log("strCellPlayers "+ strRowPlayers);

            if(updateResults(strRowPlayers))
                return;
        }
        let strColPlayers="";
        // check the current column for win
        for (let i = 0; i < GRID_ROWS; i++)
        {
            let index = col + i*GRID_COLS;
            let cellTag = cells[index].className;
            strColPlayers += cellTag.length ? cellTag : "-";
            console.log("strCellPlayers "+ strColPlayers);

            if(updateResults(strColPlayers))
                return;
        }
        let strFwdDiagPlayers="", strBwdDiagPlayers="";
        // check the diagonals for win
        for (let i = 0; i < GRID_ROWS; i++) 
        {
            for (let j = 0; j < GRID_COLS; j++) 
            {
                let index = i*7+j; // conver row x col to index
                
                // Forward diagonal - top left to bottom right
                if (i - j == row - col)
                    strFwdDiagPlayers += cells[index].className;

                // Backward diagonal - top right to bottom left
                if (i + j == row + col)
                    strBwdDiagPlayers += cells[index].className;
            }
        }
        if (updateResults(strFwdDiagPlayers) || updateResults(strBwdDiagPlayers))
            return;
    }
})