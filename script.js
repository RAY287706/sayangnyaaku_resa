const bird = document.getElementById('bird');
const startBtn = document.getElementById('startBtn');
const startScreen = document.getElementById('startScreen');
const overlay = document.getElementById('overlay');
const giftSelection = document.getElementById('giftSelection');
const birthdaySong = document.getElementById('birthdaySong');
const gameOver = document.getElementById('gameOver');
const hearts = document.getElementById('hearts');
const fireworks = document.getElementById('fireworks');
const scoreElement = document.getElementById('score');
const finalScoreElement = document.getElementById('finalScore');
const gameContainer = document.querySelector('.game-container');

let birdY = 250;
let birdVelocity = 0;
let gravity = 0.5;
let isPlaying = false;
let pipes = [];
let score = 0;
let gameSpeed = 2;
let frameCount = 0;

class Pipe {
    constructor(x) {
        this.x = x;
        this.gapSize = 180;
        this.topHeight = Math.random() * (window.innerHeight - 300 - this.gapSize) + 50;
        this.bottomY = this.topHeight + this.gapSize;
        this.width = 60;
        this.passed = false;
        this.createElement();
    }

    createElement() {
        // Top pipe
        this.topElement = document.createElement('div');
        this.topElement.className = 'pipe pipe-top';
        this.topElement.style.left = this.x + 'px';
        this.topElement.style.height = this.topHeight + 'px';
        gameContainer.appendChild(this.topElement);

        // Bottom pipe
        this.bottomElement = document.createElement('div');
        this.bottomElement.className = 'pipe pipe-bottom';
        this.bottomElement.style.left = this.x + 'px';
        this.bottomElement.style.height = (window.innerHeight - this.bottomY - 80) + 'px';
        gameContainer.appendChild(this.bottomElement);
    }

    update() {
        this.x -= gameSpeed;
        this.topElement.style.left = this.x + 'px';
        this.bottomElement.style.left = this.x + 'px';

        // Check score
        if (!this.passed && this.x + this.width < 100) {
            this.passed = true;
            score++;
            scoreElement.textContent = 'Score: ' + score;
            
            // Speed up slightly
            if (score % 3 === 0) {
                gameSpeed += 0.2;
            }
        }
    }

    checkCollision() {
        const birdLeft = 100;
        const birdRight = 135;
        const birdTop = birdY;
        const birdBottom = birdY + 35;

        if (birdRight > this.x && birdLeft < this.x + this.width) {
            if (birdTop < this.topHeight || birdBottom > this.bottomY) {
                return true;
            }
        }
        return false;
    }

    remove() {
        if (this.topElement && this.topElement.parentNode) {
            this.topElement.parentNode.removeChild(this.topElement);
        }
        if (this.bottomElement && this.bottomElement.parentNode) {
            this.bottomElement.parentNode.removeChild(this.bottomElement);
        }
    }
}

function startGame() {
    startScreen.style.display = 'none';
    isPlaying = true;
    birdY = 250;
    birdVelocity = 0;
    pipes = [];
    score = 0;
    gameSpeed = 2;
    frameCount = 0;
    scoreElement.textContent = 'Score: 0';
    
    createHearts();
    gameLoop();
}

function gameLoop() {
    if (!isPlaying) return;

    frameCount++;

    // Bird physics
    birdVelocity += gravity;
    birdY += birdVelocity;

    // Bird rotation based on velocity
    const rotation = Math.min(Math.max(birdVelocity * 3, -30), 90);
    bird.style.top = birdY + 'px';
    bird.style.transform = `rotate(${rotation}deg)`;

    // Generate pipes
    if (frameCount % 120 === 0) {
        pipes.push(new Pipe(window.innerWidth));
    }

    // Update pipes
    for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].update();

        // Check collision
        if (pipes[i].checkCollision()) {
            endGame();
            return;
        }

        // Remove off-screen pipes
        if (pipes[i].x < -80) {
            pipes[i].remove();
            pipes.splice(i, 1);
        }
    }

    // Check ground/ceiling collision
    if (birdY < 0 || birdY > window.innerHeight - 115) {
        endGame();
        return;
    }

    // Check finish line
    if (score >= 10) { // Win condition: score 1 point
        winGame();
        return;
    }

    requestAnimationFrame(gameLoop);
}

function jump() {
    if (isPlaying) {
        birdVelocity = -8;
    }
}

function endGame() {
    isPlaying = false;
    
    // Collision effect
    const collisionEffect = document.createElement('div');
    collisionEffect.className = 'collision-effect';
    collisionEffect.textContent = '💥';
    collisionEffect.style.left = '100px';
    collisionEffect.style.top = birdY + 'px';
    collisionEffect.style.fontSize = '50px';
    gameContainer.appendChild(collisionEffect);

    setTimeout(() => {
        if (collisionEffect.parentNode) {
            collisionEffect.parentNode.removeChild(collisionEffect);
        }
    }, 500);

    finalScoreElement.textContent = 'Score: ' + score;
    overlay.classList.add('show');
    gameOver.classList.add('show');
}

function winGame() {
    isPlaying = false;
    createFireworks();
    overlay.classList.add('show');
    giftSelection.classList.add('show');
}

function createHearts() {
    const heartInterval = setInterval(() => {
        if (!isPlaying && !overlay.classList.contains('show')) {
            clearInterval(heartInterval);
            return;
        }
        
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.textContent = ['💕', '💖', '💗', '💝', '💘'][Math.floor(Math.random() * 5)];
        heart.style.left = Math.random() * window.innerWidth + 'px';
        heart.style.animationDelay = Math.random() * 2 + 's';
        heart.style.fontSize = Math.random() * 8 + 15 + 'px';
        hearts.appendChild(heart);

        setTimeout(() => {
            if (hearts.contains(heart)) {
                hearts.removeChild(heart);
            }
        }, 3000);
    }, 800);
}

function createFireworks() {
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const firework = document.createElement('div');
            firework.className = 'firework';
            firework.style.left = Math.random() * window.innerWidth + 'px';
            firework.style.top = Math.random() * (window.innerHeight - 100) + 'px';
            firework.style.width = Math.random() * 30 + 15 + 'px';
            firework.style.height = firework.style.width;
            
            const colors = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff', '#5f27cd'];
            firework.style.background = colors[Math.floor(Math.random() * colors.length)];
            
            fireworks.appendChild(firework);

            setTimeout(() => {
                if (fireworks.contains(firework)) {
                    fireworks.removeChild(firework);
                }
            }, 1500);
        }, i * 50);
    }
}

function selectGift(gift) {
    giftSelection.classList.remove('show');
    
    setTimeout(() => {
        document.getElementById('selectedGift').innerHTML = 
            `<strong>🎁 Hadiah pilihan: ${gift} 🎁</strong><br>
             <em>Score akhir: ${score} poin! Amazing!</em>`;
        birthdaySong.classList.add('show');
        playSong();
    }, 500);
}

function playSong() {
    const songText = document.querySelector('.song-text');
    songText.style.animation = 'rainbow 2s infinite';
}

function resetGame() {
    // Hide all modals
    overlay.classList.remove('show');
    giftSelection.classList.remove('show');
    birthdaySong.classList.remove('show');
    gameOver.classList.remove('show');
    startScreen.style.display = 'block';
    
    // Reset bird position
    birdY = 250;
    birdVelocity = 0;
    bird.style.top = birdY + 'px';
    bird.style.transform = 'rotate(0deg)';
    
    // Clear all pipes
    pipes.forEach(pipe => pipe.remove());
    pipes = [];
    
    // Clear effects
    hearts.innerHTML = '';
    fireworks.innerHTML = '';
    
    // Reset game state
    score = 0;
    gameSpeed = 2;
    frameCount = 0;
    isPlaying = false;
}

// Event listeners
startBtn.addEventListener('click', startGame);

// Click/touch to jump
document.addEventListener('click', jump);
document.addEventListener('touchstart', (e) => {
    e.preventDefault();
    jump();
});

// Spacebar to jump
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        jump();
    }
});

// Auto-start background effects
window.addEventListener('load', () => {
    // Background hearts
    setInterval(() => {
        if (isPlaying) return;
        
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.textContent = ['💕', '💖', '💗', '💝'][Math.floor(Math.random() * 4)];
        heart.style.left = Math.random() * window.innerWidth + 'px';
        heart.style.animationDelay = Math.random() * 2 + 's';
        heart.style.fontSize = Math.random() * 10 + 15 + 'px';
        heart.style.opacity = '0.3';
        hearts.appendChild(heart);

        setTimeout(() => {
            if (hearts.contains(heart)) {
                hearts.removeChild(heart);
            }
        }, 3000);
    }, 2000);
});