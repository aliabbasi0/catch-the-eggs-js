var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

let bg = new Image();
bg.src = "images/house.jpg";

let basketImg = new Image();
basketImg.src = "images/basket.png";

let chickenImg = new Image();
chickenImg.src = "images/chicken.png";

let breakegg = new Image();
breakegg.src = "images/breakegg.png";

let brown = new Image();
brown.src = "images/brownegg.png";

let gold = new Image();
gold.src = "images/goldenegg.png";

let box = new Image();
box.src = "images/box-semi.png";

let black = new Image();
black.src = "images/rotten.png";

let love = new Image();
love.src = "images/love.png";

// create a chicken object with x and y position and image
function Chicken() {
    this.x = 350;
    this.y = 40;
    this.img = chickenImg;
}

let chicken = new Chicken();

// create a basket object with x and y position and image
function Basket() {
    this.x = 350;
    this.y = 600;
    this.img = basketImg;
}

let basket = new Basket();

// create an egg object with x and y position, image, score and control type
function Egg() {
    this.x;
    this.y = 100;
    this.img;
    this.score;
    this.control;
}

// check the key pressed to move the basket left or right
document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowRight" || event.key === "d" || event.key === "D") {
        // Move basket to the right
        basket.x = Math.min(basket.x + 15, 740);
    }
    else if (event.key === "ArrowLeft" || event.key === "a" || event.key === "A") {
        // Move basket to the left
        basket.x = Math.max(basket.x - 15, 0);
    }
})

let i = 0;
let time = 0;
let eggX = "";
let chickenProduce = [];
let lose = 0;
let score = 0;

// this function is to create a random egg with random type and add it to the chickenProduce array
function randomEgg(x) {
    let type = Math.round(Math.random() * 2);
    let egg = new Egg();
    egg.x = x;
    if (type == 1) {
        egg.img = brown;
        egg.score = 5;
        egg.control = 1;
    } else if (type == 2) {
        egg.img = gold;
        egg.score = 20;
        egg.control = 2;
    } else {
        egg.img = black;
        egg.score = -25;
        egg.control = 3;
    }
    chickenProduce.push(egg);
}

function start() {
    document.getElementById("loading").style.display = 'none';
    document.getElementById("chickenSound").play();

    // this interval is to make the chicken move randomly
    const timer = setInterval(function () {
        i = Math.round(Math.random() * 100000);

        ctx.clearRect(0, 0, 890, 700);
        ctx.drawImage(bg, 0, 0, 890, 700);
        ctx.drawImage(chicken.img, chicken.x, chicken.y, 90, 140);

        if (i > 50000) {
            if (chicken.x + 30 > 790) {
                chicken.x = 790;
            } else {
                chicken.x = chicken.x + 30;
            }
        }
        else {
            if (chicken.x - 30 < 0) {
                chicken.x = 0;
            } else {
                chicken.x = chicken.x - 30;
            }
        }

        if (time == 15) {
            eggX = chicken.x + 55;
            randomEgg(eggX);
            time = 0;
        }

        ctx.drawImage(basket.img, basket.x, basket.y, 150, 100);
        ctx.drawImage(box, 20, 20, 180, 50);

        // this loop is to draw the egg and make it fall
        for (let i = 0; i < chickenProduce.length; i++) {
            let egg = chickenProduce[i];
            if (egg.control == 1) {
                egg.y += 16;
            } else if (egg.control == 2) {
                egg.y += 21;
            } else if (egg.control == 3) {
                egg.y += 10;
            }
            ctx.drawImage(egg.img, egg.x, egg.y, 50, 50);
        }

        time++;

        for (let i = 0; i < chickenProduce.length; i++) {
            let egg = chickenProduce[i];
            // if egg's y position is between 580 and 610 and its x position is between the basket's left and right position, it will be counted as caught
            if (egg.y >= 580 && egg.y <= 610 && egg.x >= (basket.x - 20) && egg.x <= (basket.x + 125)) {
                chickenProduce.splice(i, 1);
                score += egg.score;
                if (egg.control == 3) {
                    lose++;
                }
                // this is the condition to check if the egg is brown and it is not caught by the basket, so it will be counted as lose
            } else if (egg.y > 700 && egg.control == 1) {
                chickenProduce.splice(i, 1);
                lose++;
                // this is when eggs fall to the ground, they will be broken
            } else if (egg.y >= 630) {
                chickenProduce[i].img = breakegg;
            }
        }

        ctx.font = "30px Georgia";
        ctx.fillText((3 - lose) + "x", 760, 50);
        ctx.drawImage(love, 803, 20, 50, 50);
        ctx.fillText("Score: " + score, 30, 55);

        // if user fails to catch 5 eggs or their score gets less than 0, the game will be over
        if (lose > 3 || score < 0) {
            clearInterval(timer);
            document.getElementById("chickenSound").pause();
            alert('Game Over! Your Score: ' + score);
            canvas.style.cursor = 'default';
            document.getElementById("start").style.display = 'none';
            document.getElementById("playAgain").style.display = 'block';
        }
    }, 75);
}

document.getElementById("start").addEventListener("click", function () {
    canvas.style.cursor = 'none';
    document.getElementById("start").style.display = 'none';
    document.getElementById("description").style.display = 'none';
    document.getElementById("loading").style.display = 'block';
    setTimeout(function () {
        start();
    }, 3000);

});

document.getElementById("playAgain").addEventListener("click", function () {
    location.reload();
});