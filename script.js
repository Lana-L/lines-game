const soundOption = document.getElementById("sound");
const helpButton = document.getElementById("help");
const dialog = document.getElementById("helpGuide");
const gameTable = document.getElementById("gameBoard");
const closeHelp = document.getElementById("closeHelp");
const restartGame = document.getElementById("restart");

const checkGridDirections = [-1, 1, -9, 9, -8, 8, -10, 10];
const moveDirections = [-1, 1, -9, 9];

let currentBallState = "";
let currentCellState = "";

let allowSound = true;
let bounceSound = new Audio("/sounds/bounce-ball.mp3");
let playerScore = 0;
let highScores = [
  {
    name: "John",
    score: 170,
  },
  {
    name: "Jenny",
    score: 130,
  },
  {
    name: "Bob",
    score: 120,
  },
  {
    name: "Angela",
    score: 116,
  },
  {
    name: "Jim",
    score: 102,
  },
];

startGame();

soundOption.addEventListener("click", () =>
//sound option toggle
{
  allowSound = !allowSound;
  if (!allowSound) ballSounds("");
  if (currentBallState != "" && currentBallState.classList.contains("selectedBall")) ballSounds("selectedBall");

  if (allowSound === true) document.getElementById("soundText").style.color = "rgb(7, 161, 7)";
  else document.getElementById("soundText").style.color = "grey";
}
);

help.addEventListener("click", () =>
//open help
{
  dialog.showModal();
}
);

closeHelp.addEventListener("click", () =>
//close help
{
  dialog.close();
}
);

restartGame.onclick = startGame; //restart the game button handle

function cellClicked(e)
{
  // create a variable for the clicked cell
  let clickTarget = e.target;

  //this is to handle those times when the player clicks on the edge of a cell that has a ball in it but not the ball itself, we make the ball selected anyway.
  if (clickTarget.classList.contains("hasBall")) clickTarget = clickTarget.firstChild;

  if (currentBallState === "") {
    //first click - no ball selected
    if (clickTarget.id.includes("ball")) {
      clickTarget.classList.add("selectedBall");
      ballSounds("selectedBall");
      currentBallState = clickTarget;
      currentCellState = clickTarget.parentNode;
    }
  } // second click - we've clicked something before
  else {
    if (clickTarget.id.includes("ball")) {
      // check if we clicked another ball
      if (clickTarget === currentBallState) {
        // check if  we clicked the same ball
        clickTarget.classList.remove("selectedBall"); // then we deselect it
        currentBallState = "";
        ballSounds("");
      } // we clicked a different ball - we deselect the previous ball and select the new one
      else {
        if (currentBallState)
          currentBallState.classList.remove("selectedBall");
        clickTarget.classList.add("selectedBall");
        currentBallState = clickTarget;
        currentCellState = clickTarget.parentNode;
      }
    } // or if we clicked an empty cell
    else {
      currentCellState = clickTarget;

      let path = calculatePath(currentBallState, currentCellState);

      if (path) {
        moveBallAlongPath(path, currentBallState);
        currentBallState = ""; //reset the ball state for future clicks
      }
    }
  }
}

function ballSounds(ballType)
{
  // repeating bouncing ball sounds
  if (allowSound === false) {
    bounceSound.pause();
    return;
  }

  if (ballType === "selectedBall") {
    bounceSound.loop = true;
    bounceSound.play();
  } else if (ballType === "move") {
    bounceSound.currentTime = 0;
    bounceSound.play();
  }
  else {
    bounceSound.pause();
  }
}

function generateBall()
{
  let placeBallTries = 0;

  while (placeBallTries < 81) {
    //keep checking so we don't put balls in a cell where there is already one
    let randomIndex = getRandomNumber(0, 80);

    if (!document.getElementById("cell" + randomIndex).classList.contains("hasBall")) {
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

function generateBoard()
{
  //generating the board dynamically. this could have been done by hard-coding it all out in HTML I guess
  let cells = "";
  let cellID = 0;
  for (let i = 0; i < 9; i++) {
    cells += '<div class ="gameRow">';
    for (let j = 0; j < 9; j++) {
      cellID = i * 9 + j;
      cells += '<div id="cell' + cellID + '" class ="gameCell noBall"></div>';
    }
    cells += "</div>";
  }
  gameTable.innerHTML = cells;
}

function moveBallAlongPath(path, selectedBall)
{
  if (!path)
    return;

  function moveStep(i)
  {
    if (i < path.length - 1) {
      const currentCell = document.getElementById("cell" + path[i]);
      const nextCell = document.getElementById("cell" + path[i + 1]);

      ballSounds("move");

      currentCell.removeChild(selectedBall);
      nextCell.appendChild(selectedBall);

      currentCell.classList.replace("hasBall", "noBall");
      nextCell.classList.replace("noBall", "hasBall");

      setTimeout(() =>
      {
        moveStep(i + 1);
      }, 40);
    }
    else {
      checkLineCompletion(selectedBall);
      selectedBall.classList.remove("selectedBall");
      currentBallState = "";
      ballSounds("");
    }
  }
  moveStep(0);
}

function calculatePath(selectedBall, arrivingCell)
{
  let departingCell = selectedBall.parentNode.id.replace("cell", "") * 1;
  let newCell = arrivingCell.id.replace("cell", "") * 1;

  const queue = [[departingCell]];
  let queueStep = 0;
  const visited = new Set();

  while (queueStep < queue.length) {
    const currentPath = queue[queueStep];
    queueStep++;
    const currentCell = currentPath[currentPath.length - 1];

    if (currentCell === newCell) {
      return currentPath;
    }

    if (visited.has(currentCell)) continue;
    visited.add(currentCell);

    for (let direction of moveDirections) {
      const neighbour = currentCell + direction;
      if (neighbour >= 0 && neighbour <= 80 && !document.getElementById("cell" + neighbour).classList.contains("hasBall") && Math.abs(neighbour % 9 - currentCell % 9) <= 1) {
        if (!visited.has(neighbour)) {
          queue.push([...currentPath, neighbour]);
        }
      }
    }
  }
  return null;
}

function checkLineCompletion(movedBall)
{
  const newCellID = 1 * movedBall.parentNode.id.replace("cell", "");

  const selectedBallColour = movedBall.classList[1];

  let lineCompleted = false;

  checkGridDirections.forEach((direction) =>
  {
    let ballCount = 1;

    let ballCountUp = 0;
    let ballCountDown = 0;

    let checkStepUp = 1;
    let checkStepDown = 1;

    let lineCellIDs = [newCellID];

    while (true) {
      let checkCellUpID = newCellID + direction * checkStepUp;

      if (checkCellUpID < 0 || checkCellUpID > 80) break;

      let checkCellUp = document.getElementById("cell" + checkCellUpID);

      if (checkCellUp.classList.contains("hasBall") && checkCellUp.firstChild.classList.contains(selectedBallColour)) {
        lineCellIDs.push(checkCellUpID);
        ballCountUp++;
        checkStepUp++;
      } else break;
    }

    while (true) {
      let checkCellDownID = newCellID - direction * checkStepDown;

      if (checkCellDownID < 0 || checkCellDownID > 80) break;

      let checkCellDown = document.getElementById("cell" + checkCellDownID);

      if (checkCellDown.classList.contains("hasBall") && checkCellDown.firstChild.classList.contains(selectedBallColour)) {
        lineCellIDs.push(checkCellDownID);
        ballCountDown++;
        checkStepDown++;
      } else break;
    }

    //this is necessary to account for those instances when a line is completed by a ball being inserted into the middle of the line - that's why we check in both directions and add them up.
    ballCount = 1 + ballCountUp + ballCountDown;

    if (ballCount >= 5) {
      //if we complete the line, remove the balls and give the player a free turn
      lineCompleted = true;
      removeLine(lineCellIDs);
    }
  });

  if (lineCompleted == false)
    for (
      let i = 0;
      i < 3;
      i++ //generate three more balls if a line was not completed on the move.
    ) {
      generateBall();
    }
}

function removeLine(lineCellIDs)
{
  lineCellIDs.forEach((cellID) =>
  {
    document.getElementById("cell" + cellID).firstChild.remove();
    document.getElementById("cell" + cellID).classList.replace("hasBall", "noBall");
    playerScore = playerScore + 2;
  });

  updateScore();
}

function updateScore()
{
  document.getElementById("champion").style.height = highScores[0].score + 50 + "px";
  document.getElementById("championScore").innerHTML = highScores[0].score;
  document.getElementById("challengerScore").innerHTML = playerScore;
  if (playerScore < 300) document.getElementById("challenger").style.height = playerScore + 50 + "px";
  else document.getElementById("challenger").style.height = 350 + "px";
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
  playerScore = 0;

  for (
    let i = 0;
    i < 5;
    i++ //first time we generate five
  ) {
    generateBall();
  }
  updateScore();
  document.getElementById("gameBoard").addEventListener("click", cellClicked);
}

function randomColour()
{
  //we have a set of seven ball colours and we pick one at random
  let colours = ["ballYellow", "ballGreen", "ballBrown", "ballPink", "ballBlue", "ballLightBlue", "ballRed"];
  let colour = colours[getRandomNumber(0, colours.length - 1)];
  return colour;
}
