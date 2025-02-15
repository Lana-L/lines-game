const soundOption = document.getElementById("sound");
const helpButton = document.getElementById("help");
const dialog = document.getElementById("helpGuide");
const gameTable = document.getElementById("gameBoard");
const closeHelp = document.getElementById("closeHelp");
const restartGame = document.getElementById("restart");

let gameCells = [];
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

function firstCellClicked(e)
{
  // create a variable for the clicked cell
  let firstClick = e.target;
  console.log(e.target);
  console.log(e.target.id);

  if (firstClick.id.includes("ball"))
    if (firstClick.classList.contains("selectedBall"))
    {
      document.getElementById(firstClick.id).classList.remove("selectedBall");
      ballSounds("");
      for (let i = 0; i < 3; i++)  //generate three more balls - this will later go to post-move area, but i just wanted to see something that works... 
      {
        generateBall();
      }
      currentBallState = firstClick;
      currentCellState = firstClick.parentNode;
    }
    else
    {
      document.getElementById(firstClick.id).classList.add("selectedBall");
      ballSounds("selectedBall");
      currentBallState = firstClick;
      currentCellState = firstClick.parentNode;
    }

}

function secondCellClicked(e)
{
  // create a variable for the clicked cell
  let secondClick = e.target;
  if (secondClick.id.includes("ball"))
  {
    if (secondClick === currentBallState)
    {
      secondClick.classList.remove("selectedBall");
      currentBallState = "";
    }
    else
    {
      if (secondClick.classList.contains("selectedBall"))
      {
        currentBallState.classList.remove("selectedBall");
        document.getElementById(secondClick.id).classList.add("selectedBall");
      }
      else
      {
        currentBallState.classList.remove("selectedBall");
        document.getElementById(secondClick.id).classList.add("selectedBall");
      }
      currentBallState = secondClick;
      for (let i = 0; i < 3; i++)  //generate three more balls - this will later go to post-move area, but i just wanted to see something that works... 
      {
        generateBall();
      }
    }
  }
  else
  {
    currentCellState = secondClick;
    console.log(currentCellState);
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
    if (document.getElementsByClassName("hasBall").length > 79)
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


// let i = 5;
// while (i > 0)
// {
//   if (gameCell[randomIndex] === 0)
//   {
//     setCell(randomIndex, randomColour());
//     i--;
//   }
// }
// selectNextBalls();
//}


// function setCell(cellNumber, newColour)
// {
//   gameCell[cellNumber] = newColour;
//   setCellState(cellNumber, newColour);
// }


// function setCellState(cellNumber, colour, selected)
// {

//   let cellChecked = document.getElementById("cell" + cellNumber);
//   let ballChecked = document.getElementById("ball" + cellNumber);
//   if (!cellChecked.classList.contains(colour))
//     cellChecked.classList.add(colour);
//   else
//     cellChecked.classList.remove(colour);

//   // if (!ballChecked.classList.contains(selected))
//   //   ballChecked.classList.add("selectedBall");
//   // else
//   //   ballChecked.classList.remove("selectedBall");
// }

function generateBoard()
{
  let cells = '';
  let cellId = 0;
  for (let i = 0; i < 9; i++)
  {
    cells += '<div class ="gameRow">';
    for (let j = 0; j < 9; j++)
    {
      cellId = i * 9 + j;
      cells += '<div id="cell' + cellId + '" class ="gameCell noBall"></div>';
    }
    cells += '</div>';
  }
  gameTable.innerHTML = cells;
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
    if (currentBallState === "")
      firstCellClicked(e);
    else
      secondCellClicked(e);
  }
  );
}

function randomColour()
{
  //we have a set of seven ball colours and we pick one at random
  let colours = ['ballYellow', 'ballGreen', 'ballBrown', 'ballPink', 'ballBlue', 'ballLightBlue', 'ballRed'];
  let colour = colours[getRandomNumber(0, colours.length - 1)];
  return colour;
}