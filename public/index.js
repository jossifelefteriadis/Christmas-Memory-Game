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

class Memory {
  constructor(totalTime, cards) {
    this.cardsArray = cards;
    this.totalTime = totalTime;
    this.timeRemaining = totalTime;
    this.timer = document.querySelector('.time-remaining');
    this.flips = document.querySelector('.flips');
    this.audioController = new AudioController();
  }
  startGame() {
    this.totalClicks = 0;
    this.timeRemaining = this.totalTime;
    this.cardToCheck = null;
    this.matchedCards = [];
    this.busy = true;
    setTimeout(() => {
      this.audioController.startMusic();
      this.shuffleCards(this.cardsArray);
      this.countDown = this.startCountDown();
      this.busy = false;
    }, 500);
    this.hideCards();
    this.timer.innerText = this.timeRemaining;
    this.flips.innerText = this.totalClicks;
  }

  startCountDown() {
    return setInterval(() => {
      this.timeRemaining--;
      this.timer.innerText = this.timeRemaining;
      if (this.timeRemaining === 0) {
        this.gameOver();
      }
    }, 1000);
  }

  gameOver() {
    clearInterval(this.countDown);
    this.audioController.gameOver();
    document.querySelector('.game-over-text').classList.add('visible');
  }

  victory() {
    clearInterval(this.countDown);
    this.audioController.victory();
    document.querySelector('.victory-text').classList.add('visible');
  }

  hideCards() {
    this.cardsArray.forEach(card => {
      card.classList.remove('visible');
      card.classList.remove('matched');
    });
  }

  flipCard(card) {
    if (this.canFlipCard(card)) {
      this.audioController.flip();
      this.totalClicks++;
      this.flips.innerText = this.totalClicks;
      card.classList.add('visible');
      if (this.cardToCheck) {
        this.checkForCardMatch(card);
      } else {
        this.cardToCheck = card;
      }
    }
  }

  checkForCardMatch(card) {
    if (this.getCardValue(card) === this.getCardValue(this.cardToCheck)) {
      this.cardMatch(card, this.cardToCheck);
    } else {
      this.cardNoMatch(card, this.cardToCheck);
    }
    this.cardToCheck = null;
  }

  cardMatch(card1, card2) {
    this.matchedCards.push(card1);
    this.matchedCards.push(card2);
    card1.classList.add('matched');
    card2.classList.add('matched');
    this.audioController.match();
    if (this.matchedCards.length === this.cardsArray.length) {
      this.victory();
    }
  }

  cardNoMatch(card1, card2) {
    this.busy = true;
    setTimeout(() => {
      card1.classList.remove('visible');
      card2.classList.remove('visible');
      this.busy = false;
    }, 1000);
  }

  shuffleCards() {
    for (let i = this.cardsArray.length - 1; i > 0; i--) {
      let randIndex = Math.floor(Math.random() * (i + 1));
      this.cardsArray[randIndex].style.order = i;
      this.cardsArray[i].style.order = randIndex;
    }
  }

  getCardValue(card) {
    return card.querySelectorAll('.card-value')[0].src;
  }

  canFlipCard(card) {
    return (
      !this.busy &&
      !this.matchedCards.includes(card) &&
      card !== this.cardToCheck
    );
  }
}

const ready = () => {
  let overlays = Array.from(document.querySelectorAll('.overlay-text'));
  let cards = Array.from(document.querySelectorAll('.card'));
  let game = new Memory(60, cards);

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
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ready());
} else {
  ready();
}
