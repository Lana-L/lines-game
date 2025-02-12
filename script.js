let cells = document.getElementsByTagName("td");
let allowSound = true;
let soundOption = document.getElementById("sound");
let helpButton = document.getElementById("help");
const dialog = document.getElementById("helpGuide");
const closeHelp = document.getElementById("closeHelp");
let restartGame = document.getElementById("restart");
let bounceSound = new Audio("/sounds/bounce-ball.mp3");
let timeAttack = document.getElementById("timedMode");
let idlyClick = document.getElementById("idleMode");
let idleClicks = 0;
let timedClicks = 0;
let timed = false;
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

help.addEventListener("click", () =>
{
  dialog.showModal();
});

closeHelp.addEventListener("click", () =>
{
  dialog.close();
});

restartGame.onclick = startGame;

function firstCellClicked(e)
{
  // create a variable for the clicked cell
  let firstClick = e.target;

  if (firstClick.id.includes("ball"))
    if (firstClick.classList.contains("selectedBall"))
    {
      document.getElementById(firstClick.id).classList.remove("selectedBall");
      ballSounds("");
      for (let i = 0; i < 3; i++)  //generate three more balls - this will later go to post-move area, but i just wanted to see something that works... 
      {
        generateBall();
      }
    }
    else
    {
      document.getElementById(firstClick.id).classList.add("selectedBall");
      ballSounds("selectedBall");
      secondClick();
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

function secondCellClicked(e)
{
  // create a variable for the clicked cell
  let secondClick = e.target;

  if (secondClick.id.includes("ball"))
    if (!secondClick.classList.contains("selectedBall"))
    {
      document.getElementById(firstClick.id).classList.remove("selectedBall");
      for (let i = 0; i < 3; i++)  //generate three more balls - this will later go to post-move area, but i just wanted to see something that works... 
      {
        generateBall();
      }
    }
    else
    {
      document.getElementById(firstClick.id).classList.add("selectedBall");
    }
}



function generateBall()
{
  let ball = document.createElement("figure");
  ball.classList.add("ball");
  ball.classList.add(randomColour()); // get a random colour for the ball

  let randomIndex = getRandomNumber(0, cells.length - 1);

  for (let i = 0; i < cells.length; i++) //attempt to not put multiple balls into the same cell but it's not working
  {
    ball.id = "ball" + randomIndex;
    for (let i = 0; i < cells.length; i++)
    {
      if (cells[randomIndex].classList.contains("ball"))
      {
        console.log("already ball there");
      }
    }

    cells[randomIndex].appendChild(ball);
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

  for (let i = 0; i < cells.length; i++) // I want this to clear the board if the person pressed a restart button. not working
  {
    cells[i].removeChild;

  }

  for (let i = 0; i < 5; i++)  //first time we generate five
  {
    generateBall();
  }

  for (let i = 0; i < cells.length; i++)
  {
    cells[i].onclick = firstCellClicked;
  }
}

function randomColour()
{
  //we have a set of seven ball colours and we pick one at random
  let colours = ['ballYellow', 'ballGreen', 'ballBrown', 'ballPink', 'ballBlue', 'ballLightBlue', 'ballRed'];
  let colour = colours[getRandomNumber(0, colours.length - 1)];
  return colour;
}