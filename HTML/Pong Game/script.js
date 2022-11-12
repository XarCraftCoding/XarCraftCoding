// Select Canvas
const canvas = document.getElementById("pong");
const context = canvas.getContext("2d");

// Create The User Paddle
const user = {
    x : 0,
    y : canvas.height/2 - 100/2,
    width : 10,
    height : 100,
    color : "WHITE",
    score : 0
}

// Create The Computer Paddle
const com = {
    x : canvas.width - 10,
    y : canvas.height/2 - 100/2,
    width : 10,
    height : 100,
    color : "WHITE",
    score : 0
}

// Create The Ball
const ball = {
    x : canvas.width/2,
    y : canvas.height/2,
    radius : 10,
    speed : 5,
    velocityX : 5,
    velocityY : 5,
    color : "WHITE"
}

// Create The Net
const net = {
    x : canvas.width - 1,
    y : 0,
    width : 2,
    height : 10,
    color : "WHITE"
}

// Draw Rectangle
function drawRect(x, y, w, h, color){
    context.fillStyle = color;
    context.fillRect(x, y, w, h);
}

// Draw Circle
function drawCircle(x, y, r, color){
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI*2, false);
    context.closePath();
    context.fill();
}

// Draw Text
function drawText(text, x, y, color){
    context.fillStyle = color;
    context.font = "45px fantasy";
    context.fillText(text, x, y);
}

// Draw The Net
function drawNet(){
    for (let i = 0; i <= canvas.height; i+=15){
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}

// Render The Game
function render(){

    // Clear The Canvas
    drawRect(0, 0, canvas.width, canvas, height, "BLACK");

    // Draw The Net
    drawNet();

    // Draw The Score
    drawText(user.score, canvas.width/4, canvas.height/5, "WHITE");
    drawText(com.score, 3*canvas.width/4, canvas.height/5, "WHITE");

    // Draw The User and The Computer Paddle
    drawRect(user.x, user.y, user.width, user.height, user.color);
    drawRect(com.x, com.y, com.width, com.height, com.color);

    // Draw The Ball
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

// Control The User Profile
canvas.addEventListener("mousemove", movePaddle);

function movePaddle(evt){
    let rect = canvas.getBoundingClientRect();

    user.y = evt.clientY - rect.top - user.height/2;
}

// Collision Detection
function collision(b, p){
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    return b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom;
}

// Reset Ball
function resetBall(){
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;

    ball.speed = 5;
    ball.velocityX = -ball.velocityX;
}

// Update
function update(){
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // Simple AI To Control The Computer Pad
    let computerLevel = 0.1;
    com.y = (ball.y - (com.y + com.height/2)) * computerLevel;

    if(ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0){
        ball.velocityY = -ball.velocityY;
    }
    let player = (ball.x < canvas.width/2) ? user : com;

    if(collision(ball, player)){
        // Where The Ball Hit The Player
        let collidePoint = ball.y - (player.y + player.height/2);

        // Normalization
        collidePoint = collidePoint/(player.height/2);

        // Calculate Angle In Radian
        let angleRad = collidePoint * Math.PI/4;

        // X Direction Of The Ball When It's Hit
        let direction = (ball.x < canvas.width/2) ? 1 : -1;

        // Change vel X and Y
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);

        // Everytime the ball hit a paddle, we encrase ist speed.
        ball.speed += 0.5;
    }

    // Update The Score
    if(ball.x - ball.radius < 0){
        // The Computer Win
        com.score++;
        resetBall()
    }
    else if(ball.x + ball.radius > canvas.width){
        // The User Win
        user.score++;
        resetBall()
    }
}

// Game Init
function game(){
    render();
}

// Loop
const framePerSecond = 50;
setInterval(game,1000/framePerSecond);
