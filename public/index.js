class AudioController {
  constructor() {
    this.bgMusic = new Audio('audio/jingle.mp3');
    this.bgMusic.volume = 0.5;
    this.bgMusic.loop = true;
  }
  startMusic() {
    this.bgMusic.play();
  }
}

function ready() {
  let overlays = Array.from(document.querySelectorAll('.overlay-text'));
  let cards = Array.from(document.querySelectorAll('.card'));

  overlays.forEach(overlay => {
    overlay.addEventListener('click', () => {
      overlay.classList.remove('visible');
      //game.startGame();
      let audioController = new AudioController();
      audioController.startMusic();
    });
  });
  cards.forEach(card => {
    card.addEventListener('click', () => {
      //game.flipCard(card);
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ready());
} else {
  ready();
}
