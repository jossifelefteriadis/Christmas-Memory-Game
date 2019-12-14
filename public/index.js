class AudioController {
  constructor() {
    this.bgMusic = new Audio('audio/jingle.mp3');
    this.flipSound = new Audio('audio/flip.mp3');
    this.matchSound = new Audio('audio/match.mp3');
    this.victorySound = new Audio('audio/victory.wav');
    this.gameOverSound = new Audio('audio/gameover.wav');
    this.bgMusic.volume = 0.5;
    this.bgMusic.loop = true;
    this.flipSound.playbackRate = 3.5;
  }
  startMusic() {
    this.bgMusic.play();
  }
  stopMusic() {
    this.bgMusic.pause();
    this.bgMusic.currentTime = 0;
  }
  flip() {
    this.flipSound.play();
  }
  match() {
    this.matchSound.play();
  }
  victory() {
    this.stopMusic();
    this.victorySound.play();
  }
  gameOver() {
    this.stopMusic();
    this.gameOverSound.play();
  }
}

class MixOrMatch {
  constructor(totalTime, cards) {
    this.cardsArray = cards;
    this.totalTime = totalTime;
    this.timeRemaining = totalTime;
    this.timer = document.querySelector('.time-remaining');
    this.ticker = document.querySelector('.flips');
    this.audioController = new AudioController();
  }
  startGame() {
    this.cardToCheck = null;
    this.totalClicks = 0;
    this.timeRemaining = this.totalTime;
    this.matchedCards = [];
    this.busy = true;
    setTimeout(() => {
      this.audioController.startMusic();
      this.shuffleCards();
      this.countdown = this.startCountdown();
      this.busy = false;
    }, 500);
    this.hideCards();
    this.timer.innerText = this.timeRemaining;
    this.ticker.innerText = this.totalClicks;
  }

  flipCard(card) {
    if (this.canFlipCard(card)) {
      this.audioController.flip();
      this.totalClicks++;
      this.ticker.innerText = this.totalClicks;
      card.classList.add('visible');
    }
  }

  shuffleCards() {
    for (let i = this.cardsArray.length - 1; i > 0; i--) {
      let randIndex = Math.floor(Math.random() * (i + 1));
      this.cardsArray[randIndex].style.order = i;
      this.cardsArray[i].style.order = randIndex;
    }
  }

  canFlipCard(card) {
    return true;
    /*return (
      !this.busy &&
      !this.matchedCards.includes(card) &&
      card !== this.cardToCheck
    );*/
  }
}

function ready() {
  let overlays = Array.from(document.querySelectorAll('.overlay-text'));
  let cards = Array.from(document.querySelectorAll('.card'));
  let game = new MixOrMatch(100, cards);

  overlays.forEach(overlay => {
    overlay.addEventListener('click', () => {
      overlay.classList.remove('visible');
      game.startGame();
    });
  });
  cards.forEach(card => {
    card.addEventListener('click', () => {
      game.flipCard(card);
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ready());
} else {
  ready();
}

let audioController = new AudioController();
audioController.startMusic();
