const puzzleBoard = document.querySelector('#puzzle')
const solveButton = document.querySelector('#solve-button')
const solutionDisplay = document.querySelector("#solution")
const squares = 81
let submission = []

for (let i = 0; i < squares; i++){
    // Inputs can only be 0 to 9
    const inputElement = document.createElement('input')
    inputElement.setAttribute('type', 'number')
    inputElement.setAttribute('min', 1)
    inputElement.setAttribute('max', 9)
    if (
        ((i % 9 == 0 || i % 9 == 1 || i % 9 == 2) && i < 21) ||
        ((i % 9 == 6 || i % 9 == 7 || i % 9 == 8) && i < 27) ||
        ((i % 9 == 3 || i % 9 == 4 || i % 9 == 5) && (i > 27 && i < 53)) ||
        ((i % 9 == 0 || i % 9 == 1 || i % 9 == 2) && i > 53) ||
        ((i % 9 == 6 || i % 9 == 7 || i % 9 == 8) && i > 53)
        )
        {
            inputElement.classList.add("odd-section")
        }
    puzzleBoard.appendChild(inputElement)
}

// Find each value on the board and put it into an array
const findValues = () => {
    const inputs = document.querySelectorAll("input")
    inputs.forEach(input => {
        if (input.value){
            submission.push(input.value)
        }
        else{
            submission.push(".")
        }
    })
    console.log(submission)
}

// A function to populate Sudoku board
const populateValues = (isSolvable, solution) => {
    const inputs = document.querySelectorAll('input')
    if (isSolvable && solution){
        inputs.forEach((input, i) => {
            input.value = solution[i]
        })
        solutionDisplay.innerHTML = "This is the answer"
    }
    else{
        solutionDisplay.innerHTML = "This is not solvable"
    }

}

const solve = () => {
    findValues()
    const data = {numbers: submission.join("")}
    console.log("data", data)

    // Allows request to RapidAPI to be done in the backend
    // Visit URL below as a POST request
    fetch("http://localhost:8000/solve", {
        method: 'POST',
        header: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(data)
    })  .then(response => response.json())
        .then(data => {
            console.log(data)
            // Put the solution onto the Sudoku board with data returned back to us
            populateValues(data.solvable, data.solution)
            submission = []
        })
        .catch((error) => {
            console.error("Error:", error)
        })
}

// If click button, run the function findValues
solveButton.addEventListener("click", solve)