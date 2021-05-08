
const suits = ["spades", "hearts", "diamonds", "clubs"];
const values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king", "ace"];

export class Game {

    gameState = {
        over: false,
        won: false,
        playerTurn: true
    }

    moveListeners = [];
    winListeners = [];
    loseListeners = [];

    constructor() {
        this.deck = new Array();
        this.playerHand = new Array();
        this.aiHand = new Array();
        this.gameState.over = false;
        this.gameState.won = false;
        this.gameState.playerTurn = true;
        this.buildDeck();
    }

    buildDeck() {
        for (let i = 0; i < values.length; i++) {
            for (let j = 0; j < suits.length; j++) {
                let num = parseInt(values[i])
                if (values[i] === "jack" || values[i] === "queen" || values[i] === "king") {
                    num = 10;
                } else if (values[i] === "ace") {
                    num = 11;
                }
                let card = { 
                    value: values[i],
                    suit: suits[j],
                    num: num
                }
                this.deck.push(card);
            }
        }
    }

    buildPlayer(random1, random2) {
        this.hitMe(random1);
        this.hitMe(random2);
    }

    buildAI(random1, random2) {
        this.hitAI(random1);
        this.hitAI(random2);
    }

    hitMe(random) {
        if (this.gameState.over) return;

        random = Math.floor(random % this.deck.length);
        this.playerHand.push(this.deck.splice(random, 1)[0]);

        let total = 0;
        this.playerHand.forEach(card => {
            total += card.num;
        });
        if (this.getHandTotal(this.playerHand) > 21) {
            this.gameState.over = true;
            this.gameState.won = false;
            this.loseListeners.forEach(callback => callback(this.gameState));
        } else if (this.getHandTotal(this.playerHand) === 21) {
            this.gameState.over = true;
            this.gameState.won = true;
            this.winListeners.forEach(callback => callback(this.gameState));
        }
    }

    hitAI(random) {
        random = Math.floor(random % this.deck.length);
        this.aiHand.push(this.deck.splice(random, 1)[0]);
    }

    playAI(randomArray) {

        let i = 0;
        let total = this.getHandTotal(this.aiHand);

        while (this.gameState.over === false && this.gameState.playerTurn === false &&  total < 17) {
            this.hitAI(randomArray[i]);
            if (this.getHandTotal(this.aiHand) > 21) {
                this.gameState.over = true;
                this.gameState.won = true;
                this.winListeners.forEach(callback => callback(this.gameState));
            } else if (this.getHandTotal(this.aiHand) >= 17) {
                if (this.playerWon()) {
                    this.gameState.over = true;
                    this.gameState.won = true;
                    this.winListeners.forEach(callback => callback(this.gameState));
                } else {
                    this.gameState.over = true;
                    this.gameState.won = false;
                    this.loseListeners.forEach(callback => callback(this.gameState));
                }
            }
            i++;
        }

        if (this.gameState.won) {
            this.winListeners.forEach(callback => callback(this.gameState));
        } else {
            this.loseListeners.forEach(callback => callback(this.gameState));
        }
    }

    playerWon() {
        let playerTotal = this.getHandTotal(this.playerHand);
        let aiTotal = this.getHandTotal(this.aiHand);

        if (playerTotal === 21) {
            return true;
        } else if (playerTotal > 21) {
            return false;
        } else if (playerTotal > aiTotal) {
            return true;
        } else {
            return false;
        }
    }

    printCard(card) {
        console.log(card.value + " of " + card.suit + " : " + card.num);
    }

    getFileName(card) {
        let str = ""
        return card.value + "of" + card.suit;
    }

    getHandTotal(hand) {
        let total = 0;
        hand.forEach(card => {
            total += card.num;
        });
        return total;
    }

    onMove(callback) {
        this.moveListeners[this.moveListeners.length] = callback;
    }

    onWin(callback) {
        this.winListeners[this.winListeners.length] = callback;
    }

    onLose(callback) {
        this.loseListeners[this.loseListeners.length] = callback;
    }

}
/*
let game = new Game();
game.buildPlayer(50, 40);
game.buildAI(0, 1);
console.log(game.playerHand[0].num + " " + game.aiHand[0].num);
for (let i = 0; i < game.deck.length; i++) {
    console.log(game.deck[i].value + " " + game.deck[i].suit);
}
*/