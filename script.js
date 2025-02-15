const soundOption = document.getElementById("sound");
const helpButton = document.getElementById("help");
const dialog = document.getElementById("helpGuide");
const gameTable = document.getElementById("gameBoard");
const closeHelp = document.getElementById("closeHelp");
const restartGame = document.getElementById("restart");

let currentBallState = "";
let currentCellState = "";

let allowSound = true;
let bounceSound = new Audio("/sounds/bounce-ball.mp3");
let playerScore = 0;
let highScores = [
  {
    name: "John",
    score: 170
  },
  {
    name: "Jenny",
    score: 130
  },
  {
    name: "Bob",
    score: 120
  },
  {
    name: "Angela",
    score: 116
  },
  {
    name: "Jim",
    score: 102
  },
];

startGame();

soundOption.addEventListener("click", () => //sound option toggle
{
  allowSound = !allowSound;
});

help.addEventListener("click", () => //open help
{
  dialog.showModal();
});

closeHelp.addEventListener("click", () => //close help
{
  dialog.close();
});

restartGame.onclick = startGame; //restart the game button handle

function cellClicked(e)
{
  // create a variable for the clicked cell
  let clickTarget = e.target;

  //this is to handle those times when the player clicks on the edge of a cell that has a ball in it but not the ball itself, we make the ball selected anyway.
  if (clickTarget.classList.contains('hasBall'))
    clickTarget = clickTarget.firstChild;

  if (currentBallState === "") //first click - no ball selected
  {
    if (clickTarget.id.includes("ball"))
    {
      clickTarget.classList.add("selectedBall");
      ballSounds("selectedBall");
      currentBallState = clickTarget;
      currentCellState = clickTarget.parentNode;
    }
  }
  else // second click - we've clicked something before
  {
    if (clickTarget.id.includes("ball")) // check if we clicked another ball
    {
      if (clickTarget === currentBallState) // check if  we clicked the same ball
      {
        clickTarget.classList.remove("selectedBall"); // then we deselect it
        currentBallState = "";
        ballSounds("");
      }
      else // we clicked a different ball - we deselect the previous ball and select the new one
      {
        currentBallState.classList.remove("selectedBall");
        clickTarget.classList.add("selectedBall");
        currentBallState = clickTarget;
        currentCellState = clickTarget.parentNode;
      }
    }
    else // or if we clicked an empty cell
    {
      currentCellState = clickTarget;

      moveBall(currentBallState, currentCellState);

      currentBallState = ""; //reset the ball state for future clicks
    }
  }
}


function ballSounds(ballType) // repeating bouncing ball sounds
{
  if (!allowSound)
    return;
  if (ballType === "selectedBall")
  {
    bounceSound.loop = true;
    bounceSound.play();
  }
  else 
  {
    bounceSound.pause();
  }
}


function generateBall()
{
  let placeBallTries = 0;
  let maxPlaceBallTries = 81 - document.getElementsByClassName("hasBall").length;

  while (placeBallTries < maxPlaceBallTries) //keep checking so we don't put balls in a cell where there is already one
  {
    let randomIndex = getRandomNumber(0, 80);

    if (!document.getElementById("cell" + randomIndex).classList.contains("hasBall"))
    {
      let ball = document.createElement("figure");
      ball.classList.add("ball");
      ball.classList.add(randomColour()); // get a random colour for the ball
      ball.id = "ball" + randomIndex;
      document.getElementById("cell" + randomIndex).appendChild(ball);
      document.getElementById("cell" + randomIndex).classList.replace("noBall", "hasBall");
      return;
    }
    placeBallTries++;
  }
}

function generateBoard() //generating the board dynamically. this could have been done by hard-coding it all out in HTML I guess
{
  let cells = '';
  let cellID = 0;
  for (let i = 0; i < 9; i++)
  {
    cells += '<div class ="gameRow">';
    for (let j = 0; j < 9; j++)
    {
      cellID = i * 9 + j;
      cells += '<div id="cell' + cellID + '" class ="gameCell noBall"></div>';
    }
    cells += '</div>';
  }
  gameTable.innerHTML = cells;
}

function moveBall(selectedBall, arrivingCell)
{
  let departingCell = selectedBall.parentNode;

  if (currentCellState.classList.contains("noBall"))
  {
    departingCell.removeChild(selectedBall);
    departingCell.classList.replace("hasBall", "noBall");

    arrivingCell.appendChild(selectedBall);
    arrivingCell.classList.replace("noBall", "hasBall");

    checkLineCompletion(selectedBall);

    selectedBall.classList.remove("selectedBall");
  }
  for (let i = 0; i < 3; i++)  //generate three more balls if a line was not completed on the move. this should be line completion but doesn't work there yet. TO DO
  {
    generateBall();
  }
}

function checkLineCompletion(movedBall)
{
  let newCellID = 1 * (movedBall.parentNode.id.replace("cell", ""));
  let checkGridDirections = [-1, 1, -9, 9, -8, 8, -10, 10]; // left, right, up, down, diagonal left up, diagonal left down, diagonal right up, diagonal right down 
  let selectedBallColour = movedBall.classList[1];

  console.log(selectedBallColour);
  console.log(newCellID);
  checkGridDirections.forEach(direction =>
  {
    let ballCount = 1;

    let ballCountUp = 0;
    let ballCountDown = 0;

    let checkStepUp = 1;
    let checkStepDown = 1;

    let lineCellIDs = [newCellID];

    while (true)
    {
      let checkCellUpID = newCellID + (direction * checkStepUp);

      if (checkCellUpID < 0 || checkCellUpID > 80) break;

      let checkCellUp = document.getElementById("cell" + checkCellUpID);

      if (checkCellUp.classList.contains("hasBall") && checkCellUp.firstChild.classList.contains(selectedBallColour))
      {
        lineCellIDs.push(checkCellUpID);
        ballCountUp++;
        checkStepUp++;
      }
      else break;

    }

    while (true)
    {
      let checkCellDownID = newCellID - (direction * checkStepDown);

      if (checkCellDownID < 0 || checkCellDownID > 80) break;

      let checkCellDown = document.getElementById("cell" + checkCellDownID);

      if (checkCellDown.classList.contains("hasBall") && checkCellDown.firstChild.classList.contains(selectedBallColour))
      {
        lineCellIDs.push(checkCellDownID);
        ballCountDown++;
        checkStepDown++;
      }
      else break;
    }

    //this is necessary to account for those instances when a line is completed by a ball being inserted into the middle of the line - that's why we check in both directions and add them up.
    ballCount = 1 + ballCountUp + ballCountDown;

    if (ballCount >= 5) //if we complete the line, remove the balls and give the player a free turn
    {
      console.log("Line completed!");
      removeLine(lineCellIDs);
    }
    else
    {

    }

  });
}

function removeLine(lineCellIDs)
{
  lineCellIDs.forEach(cellID =>
  {
    document.getElementById("cell" + cellID).firstChild.remove();
    document.getElementById("cell" + cellID).classList.replace("hasBall", "noBall");
    playerScore = playerScore + 2;
  });
  document.getElementById("playerScore").innerHTML = playerScore;
  console.log(lineCellIDs);
}

function getRandomNumber(min, max)
{
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function startGame()
{

  generateBoard();

  for (let i = 0; i < 5; i++)  //first time we generate five
  {
    generateBall();
  }

  document.getElementById("gameBoard").addEventListener("click", cellClicked);

}

function randomColour()
{
  //we have a set of seven ball colours and we pick one at random
  let colours = ['ballYellow', 'ballGreen', 'ballBrown', 'ballPink', 'ballBlue', 'ballLightBlue', 'ballRed'];
  let colour = colours[getRandomNumber(0, colours.length - 1)];
  return colour;
}