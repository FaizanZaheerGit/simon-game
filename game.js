let capSKeyPressed = false;
let buttonColors = ["red", "blue", "green", "yellow"];
let gamePattern = [];
let userClickedPattern = [];
let level = 1;
let idx = 0;

async function nextSequence() {
    let randomNumber = Math.floor(Math.random() * 4);
    let randomChosenColor = buttonColors[randomNumber];
    await addNewColorToPattern(randomChosenColor);
    level++;
}

$(document).keydown(async function (event) {
    if (!capSKeyPressed) {
        if (event.key == 'S') {
            handleButtons("enable");
            restartGame();
            $("h1").text(`Level ${level}`).fadeOut(140).fadeIn(170);
            capSKeyPressed = true;
            await nextSequence();
        }
    }
})

$(".btn").on("click", function () {
    let userChosenColor = $(this).attr("id");
    playSound(userChosenColor);
    userClickedPattern.push(userChosenColor);
    animatePress(userChosenColor);
    if (userClickedPattern.length == gamePattern.length) {
        let patternCheck = matchPattern(idx);
        if (!patternCheck) {
            handleButtons("disable");
            playSound("wrong");
            $("body").addClass("game-over");
            $("h1").text("Game Over!\nPress S to Restart.\n");
            capSKeyPressed = false;
        }
        else {
            setTimeout(function(){}, 200);
            playSound("correct");
            $("h1").text("CORRECT!");
            idx = 0;
            setTimeout(function () {
                $("h1").text(`Level ${level}`);
                userClickedPattern = [];
                nextSequence();
            }, 1000);
        }
    }
    else {
        let patternCheck = matchPattern(idx);
        idx++;
        if (!patternCheck) {
            playSound("wrong");
            $("body").addClass("game-over");
            handleButtons("disable");
            $("h1").text("Game Over!\nPress S to Restart.\n");
            capSKeyPressed = false;
        }
    }
})

async function addNewColorToPattern(color) {
    gamePattern.push(color);
    for (const pattern of gamePattern) {
        await new Promise((resolve) => {
          setTimeout(() => {
            playSound(pattern);
            $(`#${pattern}`).fadeOut(90).fadeIn(90).fadeOut(90).fadeIn(90, resolve);
          }, 300);
        });
    }
}

function playSound(name) {
    let audio = new Audio(`./sounds/${name}.mp3`);
    audio.play();
}

function animatePress(currentColour) {
    $(`#${currentColour}`).addClass("pressed");
    setTimeout(function() {
        $(`#${currentColour}`).removeClass("pressed");
    }, 160);
}

function matchPattern(index) {
    return userClickedPattern[index] == gamePattern[index];
}

function restartGame() {
    $("body").removeClass("game-over");
    gamePattern = [];
    userClickedPattern = [];
    level = 1;
}

function handleButtons(action) {
    if (action == 'enable') {
        $(".btn").css("pointer-events", "all");
        $(".btn").css("cursor", "pointer");
    }
    else if(action == 'disable') {
        $(".btn").css("pointer-events", "none");
        $(".btn").css("cursor", "auto");
    }
}
