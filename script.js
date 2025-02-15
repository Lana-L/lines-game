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
      for (let i = 0; i < 3; i++)  //generate three more balls - this will later go to post-move area, but i just wanted to see something that works... 
      {
        generateBall();
      }
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
  let ball = document.createElement("figure");
  let randomIndex = getRandomNumber(0, 80);

  ball.classList.add("ball");
  ball.classList.add(randomColour()); // get a random colour for the ball

  let i = 1;
  while (i > 0) //keep checking so we don't put balls in a cell where there is already one
  {
    if (document.getElementsByClassName("hasBall").length > 79) // break out of the loop if there are no more free cells left.
      return;
    else 
    {
      if (document.getElementById("cell" + randomIndex).classList.contains("hasBall"))
      {
        randomIndex = getRandomNumber(0, 80);
      }
      else
      {
        ball.id = "ball" + randomIndex;
        document.getElementById("cell" + randomIndex).appendChild(ball);
        document.getElementById("cell" + randomIndex).classList.replace("noBall", "hasBall");
        i--;
      }
    }
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

    selectedBall.classList.remove("selectedBall");
  }
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

  document.getElementById("gameBoard").addEventListener("click", function (e)
  {
    cellClicked(e);
  });
}

function randomColour()
{
  //we have a set of seven ball colours and we pick one at random
  let colours = ['ballYellow', 'ballGreen', 'ballBrown', 'ballPink', 'ballBlue', 'ballLightBlue', 'ballRed'];
  let colour = colours[getRandomNumber(0, colours.length - 1)];
  return colour;
}