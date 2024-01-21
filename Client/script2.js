document.addEventListener('DOMContentLoaded', () => {
    const bird = document.getElementById('bird');
    const gameContainer = document.getElementById('gameContainer');
    const scoreDisplay = document.getElementById('score');
    const gameOverMessage = document.getElementById('gameOverMessage');
    const restartButton = document.getElementById('restartButton');
    let level = 0;
    let birdBottom = window.innerHeight / 2;
    let gravity = 3.5;
    let isGameOver = false;
    let score = 0;
    let gameTimerId = null;
    let gameStarted = false;
    let previousScore = 0; 
    const highScoreDisplay = document.getElementById('highScoreDisplay');
    let highScore = 0;
    let highScorer = 'None';
    const usernameInput = document.getElementById('usernameInput');
    const startButton = document.getElementById('startButton');
    const loginContainer = document.getElementById('loginContainer');



    restartButton.style.display = 'none';
    scoreboardButton.style.display = 'none';

    // Mobile controls
    const isMobileOrTablet = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const mobileControls = document.getElementById('mobileControls');

    // if (isMobileOrTablet) {
    //     mobileControls.style.display = 'block';

    //     gameContainer.addEventListener('touchstart', function(event) {
    //         if (event.target.tagName !== 'BUTTON') {
    //             jump();
    //         }
    //     }, false);

    //     document.getElementById('shootButtonQ').addEventListener('touchstart', shootBeam);
    //     document.getElementById('shootButtonW').addEventListener('touchstart', shootSecondBeam);
    //     document.getElementById('shootButtonE').addEventListener('touchstart', shootThirdBeam);
    // }



        // Mobile controls touch event listeners
        if (isMobileOrTablet) {
            document.getElementById('shootButtonQ').addEventListener('touchstart', (event) => {
                if (controlsEnabled) shootBeam();
            });
            document.getElementById('shootButtonW').addEventListener('touchstart', (event) => {
                if (controlsEnabled) shootSecondBeam();
            });
            document.getElementById('shootButtonE').addEventListener('touchstart', (event) => {
                if (controlsEnabled) shootThirdBeam();
            });
            gameContainer.addEventListener('touchstart', function(event) {
                if (event.target.tagName !== 'BUTTON' && controlsEnabled) {
                    jump();
                }
            }, false);
        }

        


    function hideLoginContainer() {
        loginContainer.style.display = 'none';
    }

    restartButton.disabled = true;

    // startButton.addEventListener('click', () => {
    //     const username = usernameInput.value.trim();
    //     if (username) {
    //         localStorage.setItem('currentUsername', username);
    //         gameStarted = true;
    //         hideLoginContainer();
    //         startGame();
    //         restartButton.disabled = false; 
    //     } else {
    //         alert('Please enter a username to start the game');
    //     }
    // });



    let controlsEnabled = false; // Flag to enable or disable game controls

    startButton.addEventListener('click', () => {
        const username = usernameInput.value.trim();
        if (username) {
            localStorage.setItem('currentUsername', username);
            gameStarted = true;
            controlsEnabled = true; // Enable controls after starting the game
            hideLoginContainer();
            startGame();
            restartButton.disabled = false;
        } else {
            alert('Please enter a username to start the game');
        }
    });



    function startGame() {
        if (!gameTimerId) {
            gameTimerId = setInterval(function () {
                birdBottom -= gravity;
                bird.style.bottom = birdBottom + 'px';
                if (birdBottom <= 0 || checkOtherConditions()) {
                    gameOver();
                }
            }, 20);
            generateAsteroid();
        }
    }

    function control(e) {
        if (!isGameOver && gameStarted) {
            if (e.key === ' ' || e.key === 'Spacebar') {
                if (gameTimerId === null) {
                    startGame();
                } else {
                    jump();
                }
            } else if (e.key === 'q' || e.key === 'Q') {
                shootBeam();
            } else if (e.key === 'w' || e.key === 'W') {
                shootSecondBeam(); 
            } else if (e.key === 'e' || e.key === 'E') {
                shootThirdBeam(); 
            }
        }
    }

    function jump() {
        if (birdBottom < window.innerHeight - bird.clientHeight) {
            birdBottom += 50;
            bird.style.bottom = birdBottom + 'px';
        }
    }


function shootBeam() {
    const beam = document.createElement('div');
    beam.classList.add('beam');
    gameContainer.appendChild(beam);
    let beamLeft = bird.offsetLeft + bird.clientWidth;
    let beamBottom = birdBottom + bird.clientHeight / 2;
    beam.style.left = beamLeft + 'px';
    beam.style.bottom = beamBottom + 'px';


    bird.src = 'images /hd2.png';
    setTimeout(() => bird.src = 'images /hd1.png', 1000);

    function moveBeam() {
        beamLeft += 4;
        beam.style.left = beamLeft + 'px';

        document.querySelectorAll('.asteroid').forEach(asteroid => {
            if (checkCollision(beam, asteroid)) {
                if (!asteroid.isHit) { 
                    asteroid.isHit = true; 
                    asteroid.style.backgroundImage = "url('images /ca1.png')";
                  

                    setTimeout(() => {
                        gameContainer.removeChild(asteroid);
                    }, 500); // 500 milliseconds delay

                    score++;
                    scoreDisplay.textContent = `Score: ${score}`;
                    checkLevelUp();
                }
                gameContainer.removeChild(beam);
                clearInterval(beamMoveInterval);
            }
        });

        if (beamLeft > window.innerWidth) {
            clearInterval(beamMoveInterval);
            beam.remove();
        }

    }

    let beamMoveInterval = setInterval(moveBeam, 20);
}






function shootSecondBeam() {
    const beam = document.createElement('div');
    // beam.classList.add('beam');
    beam.classList.add('second-beam');
    gameContainer.appendChild(beam);
    let beamLeft = bird.offsetLeft + bird.clientWidth;
    let beamBottom = birdBottom + bird.clientHeight / 2;
    beam.style.left = beamLeft + 'px';
    beam.style.bottom = beamBottom + 'px';


    bird.src = 'images /hd2.png';
    setTimeout(() => bird.src = 'images /hd1.png', 1000);

    function moveBeam() {
        beamLeft += 4;
        beam.style.left = beamLeft + 'px';

        document.querySelectorAll('.asteroid').forEach(asteroid => {
            if (checkCollision(beam, asteroid)) {
                if (!asteroid.isHit) { 
                    asteroid.isHit = true; 
                    asteroid.style.backgroundImage = "url('images /ca1.png')";
                  

                    setTimeout(() => {
                        gameContainer.removeChild(asteroid);
                    }, 500); // 500 milliseconds delay

                    score++;
                    scoreDisplay.textContent = `Score: ${score}`;
                    checkLevelUp();
                }
                gameContainer.removeChild(beam);
                clearInterval(beamMoveInterval);
            }
        });

        if (beamLeft > window.innerWidth) {
            clearInterval(beamMoveInterval);
            beam.remove();
        }

    }

    let beamMoveInterval = setInterval(moveBeam, 20);
}

function shootThirdBeam() {
    const beam = document.createElement('div');
    // beam.classList.add('beam');
    beam.classList.add('third-beam');
    gameContainer.appendChild(beam);
    let beamLeft = bird.offsetLeft + bird.clientWidth;
    let beamBottom = birdBottom + bird.clientHeight / 2;
    beam.style.left = beamLeft + 'px';
    beam.style.bottom = beamBottom + 'px';


    bird.src = 'images /hd2.png';
    setTimeout(() => bird.src = 'images /hd1.png', 1000);

    function moveBeam() {
        beamLeft += 4;
        beam.style.left = beamLeft + 'px';

        document.querySelectorAll('.asteroid').forEach(asteroid => {
            if (checkCollision(beam, asteroid)) {
                if (!asteroid.isHit) { 
                    asteroid.isHit = true; 
                    asteroid.style.backgroundImage = "url('images /ca1.png')";
                  

                    setTimeout(() => {
                        gameContainer.removeChild(asteroid);
                    }, 500); // 500 milliseconds delay

                    score++;
                    scoreDisplay.textContent = `Score: ${score}`;
                    checkLevelUp();
                }
                gameContainer.removeChild(beam);
                clearInterval(beamMoveInterval);
            }
        });

        if (beamLeft > window.innerWidth) {
            clearInterval(beamMoveInterval);
            beam.remove();
        }

    }

    let beamMoveInterval = setInterval(moveBeam, 20);
}


function generateAsteroid() {
const asteroid = document.createElement('div');
asteroid.classList.add('asteroid');
gameContainer.appendChild(asteroid);
asteroid.isHit = false;

const asteroidImageIndex = Math.floor(Math.random() * 6) + 1;
asteroid.style.backgroundImage = `url('images /sa${asteroidImageIndex}.png')`;

let asteroidLeft = gameContainer.clientWidth;
let asteroidBottom = Math.random() * (window.innerHeight - 30);
asteroid.style.left = asteroidLeft + 'px';
asteroid.style.bottom = asteroidBottom + 'px';

const size = Math.random() * 20 + 60;
asteroid.style.width = `${size}px`;
asteroid.style.height = `${size}px`;
asteroid.hitsRemaining = Math.ceil(size / 10);

let asteroidSpeed = 2 + Math.floor(score / 3); 

function moveAsteroid() {
    asteroidLeft -= asteroidSpeed; 
    asteroid.style.left = asteroidLeft + 'px';

    if (asteroidLeft < -asteroid.offsetWidth) {
        clearInterval(asteroidMoveInterval);
        asteroid.remove();
    }

    if (checkCollision(bird, asteroid)) {
        gameOver();
    }
}

let asteroidMoveInterval = setInterval(moveAsteroid, 20);
let nextAsteroidTimeout = 2000 - (score > 10 ? score % 10 * 100 : 0); 
if (!isGameOver) setTimeout(generateAsteroid, nextAsteroidTimeout);
}


function checkCollision(element1, element2) {
const rect1 = element1.getBoundingClientRect();
const rect2 = element2.getBoundingClientRect();

return (
    rect1.left < rect2.right &&
    rect1.right > rect2.left &&
    rect1.top < rect2.bottom &&
    rect1.bottom > rect2.top
);

}



function gameOver() {
if (!isGameOver) {
    clearInterval(gameTimerId);
    gameTimerId = null;
    isGameOver = true;
    scoreboardButton.style.display = 'block'; // Show the scoreboard button
    gameOverMessage.style.display = 'block';
    restartButton.style.display = 'block';
    // controlsEnabled = false; 
    bird.src = 'images /hd3.png';

    const currentUsername = localStorage.getItem('currentUsername');
    if (score > highScore) {


        

        fetch('http://localhost:3000/submit-score', {
        // fetch('https://lsd-r8ez.onrender.com/submit-score', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: currentUsername, score: score }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Score submitted:', data);
            // Update high score display
            highScoreDisplay.textContent = `High Score: ${score} by ${currentUsername}`;
        })
        .catch(error => console.error('Error submitting score:', error));
    }

    scoreDisplay.textContent = `Score: ${score} | Previous: ${previousScore}`;
}
}

document.getElementById('scoreboardButton').addEventListener('click', displayScoreboard);



function displayScoreboard() {
fetch('http://localhost:3000/high-scores')
// fetch('https://lsd-r8ez.onrender.com/high-scores')
    .then(response => response.json())
    .then(scores => {

        renderScoreboard(scores);
    })
    .catch(error => console.error('Error fetching high scores:', error));
}

function renderScoreboard(scores) {
const scoreboardTable = document.getElementById('scoreboardTable');

scoreboardTable.innerHTML = `<tr><th> Lonely Stoner Doggs </th><th> Score </th></tr>`;


scores.forEach(score => {
    const row = scoreboardTable.insertRow(-1);
    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);
    cell1.textContent = score.username;
    cell2.textContent = score.score;
});


document.getElementById('scoreboardContainer').style.display = 'block';
}


function closeScoreboard() {
document.getElementById('scoreboardContainer').style.display = 'none';
}


document.getElementById('closeScoreboardButton').addEventListener('click', closeScoreboard);


function restartGame() {
if (gameStarted) {
    previousScore = score;
    isGameOver = false;
    gameOverMessage.style.display = 'none';
    score = 0;
    birdBottom = window.innerHeight / 2;
    bird.style.bottom = birdBottom + 'px';
    restartButton.style.display = 'none'; // Hide the restart button
    scoreboardButton.style.display = 'none'; 
    
    bird.src = 'images /hd1.png'; 


    scoreDisplay.textContent = `Score: 0 | Previous: ${previousScore}`;


    document.querySelectorAll('.asteroid').forEach(asteroid => asteroid.remove());


    if (!gameTimerId) {
        gameTimerId = setInterval(function () {
            birdBottom -= gravity;
            bird.style.bottom = birdBottom + 'px';

            if (birdBottom <= 0) {
                gameOver();
            }
        }, 20);

        generateAsteroid();
    }
}
}

restartButton.disabled = true; 
restartButton.addEventListener('click', restartGame);
document.addEventListener('keydown', control);
});





