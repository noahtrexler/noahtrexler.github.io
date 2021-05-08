import { Game } from "./game.js"

const delay = time => new Promise(res => setTimeout(res, time));

export const renderHand = function(hand) {

    let div = document.getElementById('playerHand');
    div.innerHTML = '';
    hand.forEach(card => {
        let img = document.createElement('img');
        img.src = `./cards/${card.value}of${card.suit}.jpg`;
        div.appendChild(img);
    })

    let total = 0;
    hand.forEach(card => {
        total += card.num;
    });

    let p = document.createElement('p');
    p.innerHTML = 'Total: ' + total;
    div.appendChild(p);

}

export const renderAIHand = function(hand, initFlag) {
    console.log("ai hand" + hand.length);
    let div = document.getElementById('aiHand');
    div.innerHTML = '';

    let i = 0;

    if (initFlag) {
        let backCard = document.createElement('img');
        backCard.src = './cards/back.jpg';
        div.appendChild(backCard);
        i = 1;
    } else {
        i = 0;
    }

    for (i; i < hand.length; i++) {
        console.log("here");
        let card = hand[i];
        let img = document.createElement('img');
        img.src = `./cards/${card.value}of${card.suit}.jpg`;
        div.appendChild(img);
    }

}

export const controller = async function () {

    let game = new Game();

    textUpdate("Good day... I am a HAL 9000 computer. I've been reprogrammed to play Quantum blackjack. I also tell jokes. Generating Quantum numbers....");

    game.onWin(gameState => {
        textUpdate("I'm afraid I've lost! You had " + game.getHandTotal(game.playerHand) + "... I had " + game.getHandTotal(game.aiHand));
        renderAIHand(game.aiHand, false);
    });
    
    game.onLose(gameState => {
        textUpdate("It appears I've won. I had " + game.getHandTotal(game.aiHand) + "... and you had " + game.getHandTotal(game.playerHand));
        renderAIHand(game.aiHand, false);
    });

    await delay(3000);

    await getQuantumRandom()
            .then(res => res.json())
            .then(data => {
                textUpdate("Generating Quantum random numbers... ");
                game.buildPlayer(data.data[0], data.data[1]);
                game.buildAI(data.data[2], data.data[3]);
                game.playerHand.forEach(card => {
                    game.printCard(card);
                })
                renderAIHand(game.aiHand, true);
                renderHand(game.playerHand);
                textUpdate("Generating Quantum random numbers... " + data.data);
            }); 
    
    $('#hit').on('click', async function (e) {
        await getQuantumRandom()
            .then(res => res.json())
            .then(data => {
                //textUpdate("Generating Quantum random number... ");
                game.hitMe(data.data[0]);
                renderHand(game.playerHand);
                //textUpdate("Generating Quantum random number... " + data.data[0]);
            })
    });

    $('#reset').on('click', async function (e) {
        location.reload();
    });

    $('#stay').on('click', async function (e) {
        game.gameState.playerTurn = false;
        await getQuantumRandom()
            .then(res => res.json())
            .then(data => {
                game.playAI(data.data);
                renderAIHand(game.aiHand, false);
            })
    });

    $('#joke').on('click', async function (e) {
        await getJoke()
            .then(response => response.json())
            .then(data => {
                textUpdate(data.joke);
            })
    })

}

export const textUpdate = function (string) {
    $("#text").empty();
    $("#text").append(string);
}

export const getQuantumRandom = async function () {
    return await fetch('https://qrng.anu.edu.au/API/jsonI.php?length=11&type=uint16&size=1024');
}

export const getJoke = async function () {
    return await fetch("https://v2.jokeapi.dev/joke/Programming?type=single");
}

$(function() {
    controller();
});