let player;
let playerX = 0;
const playerY = 240;

let avoid;

let score = 0;
let lives = 5;

let livesX = 20;
let livesY = 50;

let spawn_delay = 500;
let stew_spawn_frames = 0;

let playerSpeed = 5;

let effect = "none";
let effectFrames = 0;

let confusionEffect = false;
let darknessEffect = false;

function preload() {
    far_trees = loadImage("https://ik.imagekit.io/amongus/arcade_background_far_trees.png");
    snowy = loadImage("https://ik.imagekit.io/amongus/arcade_background_snow.png");
    desert = loadImage("https://ik.imagekit.io/amongus/arcade_project_desert.png");
    taiga = loadImage("https://ik.imagekit.io/amongus/arcade_project_taiga.png");
    cherry = loadImage("https://ik.imagekit.io/amongus/arcade_project_cherry.png");
    mushroom = loadImage("https://ik.imagekit.io/amongus/arcade_project_mushroom.png");
    mesa = loadImage("https://ik.imagekit.io/amongus/arcade_project_mesa.png");
    swamp = loadImage("https://ik.imagekit.io/amongus/arcade_project_swamp.png");

    playerImageLeft = loadImage("https://ik.imagekit.io/amongus/villager_left.png");
    playerImageRight = loadImage("https://ik.imagekit.io/amongus/villager_right.png");
    anvilImage = loadImage("https://ik.imagekit.io/amongus/pixel_anvil.png");
    stewImage = loadImage("https://ik.imagekit.io/amongus/suspicious_stew.png");

    deathScreen = loadImage("https://ik.imagekit.io/amongus/Arcade%20Project%20Lose%20Screen.png");

    darkness = loadImage("https://ik.imagekit.io/amongus/darkness%20effect.png");
}

function setup() {
    createCanvas(600, 400);
    noStroke();
    playerX = width/2;

    player = {
        image: playerImageLeft,
        x: width/2,
        y: playerY
    }

    avoid = {
        image: anvilImage,
        x: random(0, width),
        y: 0,
        visible: true
    }

    stew = {
        image: stewImage,
        x: random(0, width),
        visible: false
    }

    textSize(26);
    fill(255);

    backgrounds = ["far_trees","snowy","desert","taiga","cherry","mushroom","mesa","swamp"];
    random_background = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    if (random_background == "far_trees"){
        background = far_trees;
    } else if (random_background == "snowy"){
        background = snowy;
    } else if (random_background == "desert"){
        background = desert;
    } else if (random_background == "taiga"){
        background = taiga;
    } else if (random_background == "cherry"){
        background = cherry;
    } else if (random_background == "mushroom"){
        background = mushroom;
    } else if (random_background == "mesa"){
        background = mesa;
    } else if (random_background == "swamp"){
        background = swamp;
    }

}

function draw() {
    // clear the screen
    image(background, 0, 0);

    // draw the player
    image(player.image, player.x - player.image.width/2, player.y);

    //draw the avoidable
    if(avoid.visible){
        image(avoid.image, avoid.x - avoid.image.width/2, avoid.y - avoid.image.height/2);
    }

    if(stew.visible){
        image(stew.image, stew.x, 360);
    }

    if (darknessEffect){
        image(darkness, player.x - darkness.width/2, player.y + player.image.height/2 - darkness.height/2);
    }
    
    //checks for the key pressed and makes the villager face left or right
    if(keyIsDown(65) && player.x - player.image.width/2 + 1 > 0){
        if (confusionEffect && player.x + player.image.width/2 < width){
            player.x += playerSpeed;
        } else if (!confusionEffect){
            player.x -= playerSpeed;
        }
        
        player.image = playerImageLeft;
    }

    if(keyIsDown(68) && player.x + player.image.width/2 - 1 < width){
        if (confusionEffect && player.x - player.image.width/2 > 0){
            player.x -= playerSpeed;
        } else if (!confusionEffect){
            player.x += playerSpeed;
        }

        player.image = playerImageRight;
    }

    avoid.y += 7;


    //adds to your score
    if(avoid.y > height + avoid.image.height/2){
        avoid.y = -avoid.image.height;
        avoid.x = random(0, width);
        if(avoid.visible){
            score += 500;
        }
        avoid.visible = true;
    }

    //checks for collision
    if (isCollision(avoid)){
        lives -= 1;
        avoid.visible = false;
    }



    stew_spawn_frames += 1;

    if(stew_spawn_frames == 800){
        stew.visible = false;
        stew_spawn_frames = 0;
    } else if (stew_spawn_frames == 600){
        stew.visible = true;
        stew.x = random(0, width);
    }
    
    if (stewCollision(stew)){
        stew.visible = false;
        stew_spawn_frames = 0;
        applyStewEffect(randomEffect());
    }

    if (effect != "none"){
        continueEffect();
    }

    //Prints the score
    textAlign(RIGHT);
    text(score, 560, 50);

    //Prints the lives
    textAlign(LEFT);
    display_health();

    if (lives <= 0){
        textAlign(CENTER);
        //text("GAME OVER", width/2, height/2 - 45);
        image(deathScreen, 0, 0);
        throw "";
    }
}

//logic for collision
function isCollision(avoid){
    const XOverlap = player.x - player.image.width/2 < avoid.x + avoid.image.width/2 && player.x + player.image.width/2 > avoid.x - avoid.image.width/2;
    const YOverlap = player.y < avoid.y + avoid.image.height/2;

    return (XOverlap && YOverlap) && avoid.visible;
}

function stewCollision(stew){
    const stewXOverlap = player.x - player.image.width/2 < stew.x + stew.image.width/2 && player.x + player.image.width/2 > stew.x - stew.image.width/2;
    return stewXOverlap && stew.visible;
}

function display_health(){
    if (lives > 0){
        text(("❤️".repeat(lives)), livesX, livesY);
    } else {
        text("💀", livesX, livesY);
    }

    /*
    if (lives === 5){
        text("❤️❤️❤️❤️❤️", livesX, livesY);
    } else if (lives === 4) {
        text("❤️❤️❤️❤️", livesX, livesY);
    } else if (lives === 3){
        text("❤️❤️❤️", livesX, livesY);
    } else if (lives === 2){
        text("❤️❤️", livesX, livesY);
    } else if (lives === 1){
        text("❤️", livesX, livesY);
    */
}

function randomEffect(){
    let effects = ["speed","slowness","health","confusion","darkness"];
    effect = effects[Math.floor(Math.random() * effects.length)];
    return effect;
}

function applyStewEffect(effect){
    if (effect == "speed"){
        playerSpeed += 2;
        effect == "none";
    } else if (effect == "slowness"){
        if (playerSpeed - 2 < 0){
            playerSpeed = 0;
        } else {
            playerSpeed -= 2;
        }
        effect == "none";
    } else if (effect == "health"){
        lives += 1;
        effect == "none";

    } else if (effect == "confusion"){
        confusionEffect = true;
    } else if (effect == "darkness"){
        darknessEffect = true;
    }
}

function continueEffect(){
    effectFrames += 1;
    if (effect == "confusion" && effectFrames == 500){
        confusionEffect = false;
        effect = "none";
        effectFrames = 0;
    } else if (effect == "darkness" && effectFrames == 500){
        darknessEffect = false;
        effect = "none";
        effectFrames = 0;
    }
}
