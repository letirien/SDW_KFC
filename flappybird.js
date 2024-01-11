//board
let board;
let boardWidth = window.innerWidth;
let boardHeight = window.innerHeight;
let context;

//bird
let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImg;

let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
}

//pipes
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//physics
let velocityX = -2;
let velocityY = 0;
let gravity = 0.4;

let gameStart = false;
let pressFirstSpace = [false, 0];
let gameOver = false;
let gameStarted = false; // Ajout de la variable pour suivre l'état du jeu
let score = 0;

window.onload = function () {
    let startBtn = document.querySelector('#start-btn')
    let homePage = document.querySelector('.parent-home')

    startBtn.addEventListener('click', (e) => {
        homePage.style.display = "none";
        initializeGame();
    });
}

function initializeGame() {
    // Initialise le canvas et le contexte
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");
    context.font = "23px 'fontKFC', sans-serif";

    // Initialise l'image de l'oiseau
    birdImg = new Image();
    birdImg.src = "./chicken.png";
    birdImg.onload = function () {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }

    // Initialise les images des tuyaux
    topPipeImg = new Image();
    topPipeImg.src = "./toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./bottompipe.png";

    // Gère les événements de clavier et de toucher
    document.addEventListener("keydown", handleKeyPress);
    document.addEventListener("touchstart", handleTouchStart);

    // Démarre la boucle de mise à jour et le placement des tuyaux
    requestAnimationFrame(update);
    setInterval(placePipes, 1500);
}

function handleKeyPress(e) {
    if (!gameStarted) {
        // Le jeu n'a pas encore commencé, commencez le jeu lorsqu'une touche est enfoncée
        startGame();
    } else {
        // Le jeu a commencé, permet au joueur de contrôler l'oiseau
        moveBird(e);
    }
}

function handleTouchStart() {
    if (!gameStarted) {
        // Le jeu n'a pas encore commencé, commencez le jeu lorsqu'un toucher est détecté
        startGame();
    } else {
        // Le jeu a commencé, permet au joueur de contrôler l'oiseau
        jumpBird();
    }
}

function startGame() {
    gameStarted = true;
    gameStart = true;
    pressFirstSpace[0] = true;
}

function update() {
    requestAnimationFrame(update);

    if (!gameStarted) {
        context.clearRect(0, 0, board.width, board.height);
        context.fillStyle = "white";
        context.fillText("Press any key to start", boardWidth / 4, boardHeight / 2);
        return;
    }

    if (gameOver) {
        context.clearRect(0, 0, board.width, board.height);
        context.fillStyle = "white";
        context.fillText("GAME OVER", 5, 90);
        return;
    }

    context.clearRect(0, 0, board.width, board.height);

    //bird
    velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY, 0);
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height) {
        gameOver = true;
    }

    //pipes
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5;
            pipe.passed = true;
        }

        if (detectCollision(bird, pipe)) {
            gameOver = true;
        }
    }

    //clear pipes
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift();
    }

    //score
    context.fillStyle = "white";
    context.fillText(score, 5, 45);
}

function placePipes() {
    if (gameOver) {
        return;
    }

    let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
    let openingSpace = board.height / 4;

    let topPipe = {
        img: topPipeImg,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }
    pipeArray.push(topPipe);

    let bottomPipe = {
        img: bottomPipeImg,
        x: pipeX,
        y: randomPipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }
    pipeArray.push(bottomPipe);
}

function moveBird(e) {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
        velocityY = -6;

        if (gameOver) {
            bird.y = birdY;
            pipeArray = [];
            score = 0;
            gameOver = false;
        }
    }
}

function jumpBird() {
    velocityY = -6;

    if (gameOver) {
        bird.y = birdY;
        pipeArray = [];
        score = 0;
        gameOver = false;
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
}
