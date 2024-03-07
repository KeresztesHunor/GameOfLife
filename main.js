import Cell from "./Cell.js";

const gridWidth = 32;

const grid = [];
const populatedCells = [];
const neighboringCellOffsets = [
    [-1, -1],
    [ 0, -1],
    [ 1, -1],
    [-1,  0],
    [ 1,  0],
    [-1,  1],
    [ 0,  1],
    [ 1,  1]
];

let continueGame = false;

$(() => {
    const playingField = $("#playing-field");
    const gridSize = gridWidth * gridWidth;
    for (let i = 0; i < gridSize; i++)
    {
        grid.push(new Cell(playingField, i));
    }
    $(window).on("clickedOnFieldEvent", event => {
        if (!continueGame)
        {
            event.detail.toggle();
            if (event.detail.populated)
            {
                populatedCells.push(event.detail);
            }
            else
            {
                let i = 0;
                while (i < grid.length && grid[i].cellNumber !== event.detail.cellNumber)
                {
                    i++;
                }
                if (i < grid.length)
                {
                    populatedCells.splice(i, 1);
                }
            }
        }
    });
    $("#start-stop").on("click", () => {
        continueGame = !continueGame;
        if (continueGame)
        {
            game();
        }
    });
});

function game()
{
    let stateChanged = false;
    const cellsToToggle = [];
    const emptyCellsToCheck = [];
    let setStateChanged = () => {
        stateChanged = true;
        setStateChanged = () => { };
    };
    populatedCells.forEach(cell => {
        const [x, y] = indexToCoords(cell.cellNumber);
        let numPopulatedNeighboringCells = 0;
        neighboringCellOffsets.forEach(offset => {
            const [xOffset, yOffset] = offset;
            const neighborX = x + xOffset;
            const neighborY = y + yOffset;
            if (neighborX >= 0 && neighborX < gridWidth && neighborY >= 0 && neighborY < gridWidth)
            {
                const neighboringCell = grid[coordsToIndex(neighborX, neighborY)];
                if (neighboringCell.populated)
                {
                    numPopulatedNeighboringCells++;
                }
                else if ((() => {
                    let i = 0;
                    while (i < emptyCellsToCheck.length && emptyCellsToCheck[i].cellNumber !== neighboringCell.cellNumber)
                    {
                        i++;
                    }
                    return i >= emptyCellsToCheck.length;
                })())
                {
                    emptyCellsToCheck.push(neighboringCell);
                }
            }
        });
        if (numPopulatedNeighboringCells <= 1 || numPopulatedNeighboringCells >= 4)
        {
            cellsToToggle.push(cell);
            setStateChanged();
        }
    });
    emptyCellsToCheck.forEach(cell => {
        const [x, y] = indexToCoords(cell.cellNumber);
        let numPopulatedNeighboringCells = 0;
        neighboringCellOffsets.forEach(offset => {
            const [xOffset, yOffset] = offset;
            const neighborX = x + xOffset;
            const neighborY = y + yOffset;
            if (neighborX >= 0 && neighborX < gridWidth && neighborY >= 0 && neighborY < gridWidth && grid[coordsToIndex(x + xOffset, y + yOffset)].populated)
            {
                numPopulatedNeighboringCells++;
            }
        });
        if (numPopulatedNeighboringCells === 3)
        {
            cellsToToggle.push(cell);
            setStateChanged();
        }
    });
    cellsToToggle.forEach(cell => {
        cell.toggle();
        if (cell.populated)
        {
            populatedCells.push(cell);
        }
        else
        {
            let i = 0;
            while (i < populatedCells.length && populatedCells[i].cellNumber !== cell.cellNumber)
            {
                i++;
            }
            if (i < populatedCells.length)
            {
                populatedCells.splice(i, 1);
            }
        }
    });
    console.log("still going");
    setTimeout(
        () => {
            if (continueGame && stateChanged)
            {
                game();
            }
            else
            {
                continueGame = false;
            }
        },
        250
    );
}

function coordsToIndex(x, y)
{
    return y * gridWidth + x;
}

function indexToCoords(index)
{
    return [index % gridWidth, Math.floor(index / gridWidth)];
}