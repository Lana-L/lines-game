let cells = document.getElementsByTagName("td");
let bounceSound = new Audio("");
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

// timeAttack.onclick = timedGame;

startGame();

function cellClicked(e)
{
  // create a variable for the clicked cell
  let firstClick = e.target;

  console.log(firstClick);
  console.log(cells);

  if (firstClick.id.includes("ball"))
    if (firstClick.classList.contains("selectedBall"))
    {
      console.log(firstClick.click.id);
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
// if (timed)
// {
//   timedClicks++;
//   displayMole();
//   document.getElementById("timedClicks").innerHTML = "You clicked " + timedClicks + " times while the timer was running";
//   return;
// }
// else
// {
//   idleClicks++;
//   displayMole();
//   document.getElementById("idleClicks").innerHTML = "You idly clicked " + idleClicks + " times";
// }



function generateBall()
{
  let ball = document.createElement("figure");
  ball.classList.add("ball");
  ball.classList.add(randomColour()); // get a random colour for the ball

  let randomIndex = getRandomNumber(0, cells.length - 1);

  for (let i = 0; i < cells.length; i++)
  {
    ball.id = "ball" + randomIndex;
    console.log(ball);
    console.log(cells[randomIndex].parentNode.children);
    console.log(cells[randomIndex].children.length);
    for (let i = 0; i < cells.length; i++)
    {
      if (cells[randomIndex].children.length > 0)
      {
        console.log("already ball there");
        randomIndex = getRandomNumber(0, cells.length - 1);
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
  for (let i = 0; i < 5; i++)  //first time we generate five
  {
    generateBall();
  }

  for (let i = 0; i < cells.length; i++)
  {
    cells[i].onclick = cellClicked;
  }
}

function randomColour()
{
  //we have a set of seven ball colours and we pick one at random
  let colours = ['ballYellow', 'ballGreen', 'ballBrown', 'ballPink', 'ballBlue', 'ballLightBlue', 'ballRed'];
  let colour = colours[getRandomNumber(0, colours.length - 1)];
  return colour;
}