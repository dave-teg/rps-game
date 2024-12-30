import Game from "./Game.js";

const game = new Game();

const initApp = () => {
  //1. get the all time score.
  initAllTimeScore();
  //2. update the scoreboard
  updateScoreboard();
  //3. accept player choice
  listenPlayerChoice();
  listenPlayAgain();
  listenEnterKey();
};

document.addEventListener("DOMContentLoaded", initApp);

const initAllTimeScore = () => {
  game.setP1AllTime(parseInt(localStorage.getItem("P1AllTime")) || 0);
  game.setCPAllTime(parseInt(localStorage.getItem("CPAllTime")) || 0);
};

const updateScoreboard = () => {
  const p1ATScore = document.getElementById("P1_all_time");
  const p1AT = game.getP1AllTime();
  p1ATScore.textContent = `${p1AT}`;
  p1ATScore.ariaLabel = `Player one has ${p1AT} all time wins`;

  const cPATScore = document.getElementById("CP_all_time");
  const cpAT = game.getCPAllTime();
  cPATScore.textContent = `${cpAT}`;
  cPATScore.ariaLabel = `Computer has ${cpAT} all time wins`;

  const p1SessionScore = document.getElementById("P1_session");
  const p1Se = game.getP1Session();
  p1SessionScore.textContent = `${p1Se}`;
  p1SessionScore.ariaLabel = `Player one has ${p1Se} wins this session`;

  const cPSessionScore = document.getElementById("CP_session");
  const cpSe = game.getCPSession();
  cPSessionScore.textContent = `${cpSe}`;
  cPSessionScore.ariaLabel = `Computer has ${cpSe} wins this session`;
};

const listenEnterKey = () => {
  const p1Img = document.querySelectorAll(
    ".player-board .gameBoard__square img"
  );
  p1Img.forEach((img) => {
    img.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        img.click();
      }
    });
  });
};

const listenPlayerChoice = () => {
  const p1Img = document.querySelectorAll(
    ".player-board .gameBoard__square img"
  );
  p1Img.forEach((img) => {
    img.addEventListener("click", (event) => {
      if (game.getStatus()) return;
      game.startGame();
      const playerChoice = event.target.parentElement.id;
      updateP1msg(playerChoice);
      p1Img.forEach((img) => {
        if (img === event.target) {
          img.parentElement.classList.add("selected");
        } else {
          img.parentElement.classList.add("notSelected");
        }
      });
      computerAnimationSequence(playerChoice);
    });
  });
};

const computerAnimationSequence = (playerChoice) => {
  let interval = 1000;
  setTimeout(() => computerAnimation("cp-rock", "1"), interval);
  setTimeout(() => computerAnimation("cp-paper", "2"), (interval += 750));
  setTimeout(() => computerAnimation("cp-scissors", "3"), (interval += 750));
  setTimeout(() => fadeOut(), (interval += 750));
  setTimeout(() => {
    deleteP();
    gameFlow(playerChoice);
  }, (interval += 750));
  setTimeout(() => displayPlayAgain(), (interval += 750));
};

const computerAnimation = (id, index) => {
  const cpSquare = document.getElementById(id);
  cpSquare.firstElementChild.remove();
  const p = document.createElement("p");
  p.textContent = index;
  cpSquare.appendChild(p);
};

const fadeOut = () => {
  const pElem = document.querySelectorAll(
    ".computer-board .gameBoard__square p"
  );
  pElem.forEach((el) => {
    el.className = "fadeOut";
  });
};

const deleteP = () => {
  const pElem = document.querySelectorAll(
    ".computer-board .gameBoard__square p"
  );
  pElem.forEach((el) => {
    el.remove();
  });
};

const gameFlow = (playerChoice) => {
  const computer = computerChoice();
  const winner = determineWinner(computer, playerChoice);
  //display the computer choice
  displayComputerChoice(computer);
  //display the action message
  displayActionMessage(playerChoice, computer, winner);
  //display the winner
  displayWinner(winner);
  //update the score
  updateScore(winner);
  //update the scoreboard
  updateScoreboard();
};

//listen to the playAgain button
//reset the game

const computerChoice = () => {
  const random = Math.floor(Math.random() * 3);
  const rpsArray = ["rock", "paper", "scissors"];
  return rpsArray[random];
};

const determineWinner = (computer, player) => {
  if (computer === player) return "Tie game";
  else if (
    (computer === "rock" && player === "scissors") ||
    (computer === "paper" && player === "rock") ||
    (computer === "scissors" && player === "paper")
  )
    return "computer";
  else return "player";
};

const displayComputerChoice = (computerChoice) => {
  const parent = document.getElementById("cp-paper");
  createComputerImg(computerChoice, parent);
};

const createComputerImg = (icon, parent) => {
  const cpImg = document.createElement("img");
  cpImg.src = `./images/${icon}.png`;
  cpImg.alt = `${icon}`;
  parent.appendChild(cpImg);
};

const displayActionMessage = (player, computer, winner) => {
  const cpMsg = document.getElementById("computer-msg");
  const msg = buildActionMessage(player, computer, winner);
  cpMsg.textContent = `${msg}`;
};

const buildActionMessage = (player, computer, winner) => {
  if (winner === "Tie game") return "Tie game";
  else if (winner === "computer") {
    return `${properCase(computer)} ${getActionMsg(computer)} ${properCase(
      player
    )}`;
  } else {
    return `${properCase(player)} ${getActionMsg(player)} ${properCase(
      computer
    )}`;
  }
};

const getActionMsg = (winner) => {
  const winnerMsg =
    winner === "paper" ? "wraps" : winner === "rock" ? "smashes" : "cuts";
  return properCase(winnerMsg);
};

const displayWinner = (winner) => {
  if (winner === "Tie game") return;
  const msg = createWinnerMsg(winner);
  const p1msg = document.getElementById("player-msg");
  p1msg.textContent = `${msg}`;
};

const createWinnerMsg = (winner) => {
  if (winner === "computer") {
    return "🤖Computer Wins!🤖";
  } else return "🔥🏆You Win!!🏆🔥";
};

const updateScore = (winner) => {
  if (winner === "Tie game") return;
  winner === "computer" ? game.cpWin() : game.p1win();
  setStorage(winner);
};

const setStorage = (winner) => {
  if (winner === "computer") {
    localStorage.setItem("CPAllTime", game.getCPAllTime());
  } else {
    localStorage.setItem("P1AllTime", game.getP1AllTime());
  }
};

const displayPlayAgain = () => {
  const btn = document.querySelector(".playAgain");
  btn.classList.toggle("hidden");
  btn.focus();
};

const updateP1msg = (playerChoice) => {
  let p1msg = document.getElementById("player-msg").textContent;
  p1msg += `${properCase(playerChoice)}`;
  document.getElementById("player-msg").textContent = p1msg;
};

const properCase = (string) => {
  let properWord = string[0].toUpperCase();
  properWord += string.slice(1);
  return properWord;
};

const listenPlayAgain = () => {
  const form = document.querySelector("form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    game.endGame();
    resetGame();
  });
};

const resetGame = () => {
  const cp_rock = document.getElementById("cp-rock");
  const cp_paper = document.getElementById("cp-paper");
  const cp_scissors = document.getElementById("cp-scissors");

  createComputerImg("rock", cp_rock);
  cp_paper.removeChild(cp_paper.firstElementChild);
  createComputerImg("paper", cp_paper);
  createComputerImg("scissors", cp_scissors);

  const squares = document.querySelectorAll(
    ".player-board .gameBoard__wrapper div"
  );
  squares.forEach((square) => {
    square.className = "gameBoard__square";
  });

  const p1msg = document.getElementById("player-msg");
  p1msg.textContent = "Player One Chooses...";

  const cpMsg = document.getElementById("computer-msg");
  cpMsg.textContent = "Computer Chooses...";

  const btn = document.querySelector(".playAgain");
  btn.classList.toggle("hidden");
};
