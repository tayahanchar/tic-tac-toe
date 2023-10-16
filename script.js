'use strict';

const container = document.querySelector('.container');
const box = document.querySelectorAll('.box');
const cross = `<svg class="cross">
<line class="line__first" x1="15" y1="15" x2="100" y2="100" stroke="white" stroke-width="12" fill="none" stroke-linecap="round" />
<line class="line__second" x1="100" y1="15" x2="15" y2="100" stroke="white" stroke-width="12" fill="none" stroke-linecap="round" />
</svg>`;
const circle = `<svg class="circle">
<circle r="45" cx="58" cy="58" stroke="indigo" stroke-width="12" fill="none" stroke-linecap="round" />
</svg>`;
let step = 0;
let result;
let scoreArray = [];
let crossesCount = 0;
let zerosCount = 0;
let drawCount = 0;
const newGameModal = document.querySelector('.result');
const gameEnd = document.querySelector('.game__end');
const nemberSteps = document.querySelector('.text__steps');
const titleResults = document.querySelector('.text__result');
const resultGame = document.querySelector('.result__game');
const game = document.querySelector('.game');
const resultGameButton = document.querySelector('.button__result');
let crossesPoints = document.querySelector('.crosses__points');
let zerosPoints = document.querySelector('.zeros__points');
let isStepAvailalbe = true;

initCountState();

container.addEventListener('click', displayFigure);

function displayFigure (event) {
  if(event.target.classList.contains('box') && isStepAvailalbe) {
    isStepAvailalbe = false;
   if(step % 2 === 0) {
    event.target.innerHTML = cross;
    step++;
    event.target.classList.add('add__cross');
    playSoundCross();
    win();
   } else {
    event.target.innerHTML = circle;
    step++;
    event.target.classList.add('add__circle');
    playSoundCircle();
    win();
   }
  }

  setTimeout(() => {
    isStepAvailalbe = true;
  }, 1200);
}

let playSoundCircle = () => {
  let circleAudio = new Audio(`assets/sounds/circle.mp3`);
  circleAudio.play();
};

let playSoundCross = () => {
  let crossAudio = new Audio(`assets/sounds/cross.mp3`);
  crossAudio.play();
};

const win = () => {
  const winCombination = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  
  for(let i = 0; i < winCombination.length; i++) {
    if(box[winCombination[i][0]].classList.contains('add__cross') && box[winCombination[i][1]].classList.contains('add__cross') && box[winCombination[i][2]].classList.contains('add__cross') && result !== 'zeros') {
      box[winCombination[i][0]].classList.add('active');
      box[winCombination[i][1]].classList.add('active');
      box[winCombination[i][2]].classList.add('active');
      result = 'crosses';
      setTimeout(showResult, 1000);
    } else if (box[winCombination[i][0]].classList.contains('add__circle') && box[winCombination[i][1]].classList.contains('add__circle') && box[winCombination[i][2]].classList.contains('add__circle') && result !== 'crosses') {
      box[winCombination[i][0]].classList.add('active');
      box[winCombination[i][1]].classList.add('active');
      box[winCombination[i][2]].classList.add('active');
      result = 'zeros';
      setTimeout(showResult, 1000);
    }
  }

  if (step === 9 && result !== 'zeros' && result !== 'crosses') {
    result = 'draw';
    setTimeout(showResult, 1000);
  } 

};


const showResult = () => {
  saveStepScore();

  if (scoreArray.length < 10) {
    titleResults.textContent = `Won ${result}!!!`;
    nemberSteps.textContent = `Steps: ${step}.`;
    newGameModal.style.display = 'block';
    container.style.display = 'none';
    console.log(crossesCount, zerosCount);
  } else {
    if(zerosCount == crossesCount) {
      resultGame.textContent = `Game over! Draw!!!`;
    } else if (crossesCount > zerosCount) {
      resultGame.textContent = `Game over! Won crosses!!!`;
    } else if (zerosCount > crossesCount) {
      resultGame.textContent = `Game over! Won zeros!!!`;
    } 
    container.style.display = 'none';
    gameEnd.style.display = 'block';
    resetGame();
  }
};

const startNewGame = () => {
  location.reload();
};

resultGameButton.addEventListener('click', startNewGame);

game.addEventListener('click', startNewGame);

function initCountState() {
  scoreArray = JSON.parse(localStorage.getItem('counter')) || [];

  updateGameCount();
}

function updateGameCount() {
  scoreArray.forEach(element => {
    if (element === 'crosses') {
      crossesCount += 1;
    } else if (element === 'zeros') {
      zerosCount += 1;
    } else if (element === 'draw') {
      drawCount += 1;
    }
  });
  
  crossesPoints.textContent = crossesCount;
  zerosPoints.textContent = zerosCount;
}

function saveStepScore() {
  if(result == 'crosses') {
    scoreArray.push('crosses');

    crossesCount += 1;
  } else if (result === 'zeros') {
    scoreArray.push('zeros');

    zerosCount += 1;
  } else if (result === 'draw') {
    scoreArray.push('draw');
  }

  localStorage.setItem('counter', JSON.stringify(scoreArray));
}

function resetGame() {
  zerosCount = 0;
  crossesCount = 0;
  scoreArray = [];
  crossesPoints.textContent = crossesCount;
  zerosPoints.textContent = zerosCount;
  localStorage.setItem('counter', JSON.stringify(scoreArray));
}


