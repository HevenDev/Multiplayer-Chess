"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
const message_1 = require("./message");
class Game {
    constructor(player1, player2) {
        this.moveCount = 0;
        this.player1 = player1;
        this.player2 = player2;
        this.board = new chess_js_1.Chess();
        this.startTime = new Date();
        this.player1.send(JSON.stringify({
            type: message_1.INIT_GAME,
            payload: {
                color: "w"
            }
        }));
        this.player2.send(JSON.stringify({
            type: message_1.INIT_GAME,
            payload: {
                color: "b"
            }
        }));
    }
    makeMove(socket, move) {
        // Chess.js will handle following things
        // Validation here :-
        //Is it this user move
        // Validate the  type of move using zod
        //Is the  move is valid
        if (this.moveCount % 2 === 0 && socket !== this.player1) {
            console.log("sent1");
            return;
        }
        if (this.moveCount % 2 === 1 && socket !== this.player2) {
            console.log("sent2");
            return;
        }
        console.log("did not early return");
        try {
            this.board.move(move);
        }
        catch (e) {
            console.log(e, "move error");
            return;
        }
        console.log("move success");
        if (this.board.isGameOver()) {
            // Send message to both the players that game has been over.
            this.player1.send(JSON.stringify({
                type: message_1.GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white"
                }
            }));
            this.player2.send(JSON.stringify({
                type: message_1.GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white"
                }
            }));
            return;
        }
        if (this.moveCount % 2 === 0 && socket === this.player1) {
            this.player2.send(JSON.stringify({
                type: message_1.MOVE,
                payload: move,
            }));
        }
        else if (this.moveCount % 2 === 1 && socket === this.player2) {
            this.player1.send(JSON.stringify({
                type: message_1.MOVE,
                payload: move,
            }));
        }
        else {
            return; // Early return if the move isn't from the expected player
        }
        this.moveCount++;
        // Update the board
        //Push the move
        //Check if the game is over
        //Send the  updated board to both the players
    }
}
exports.Game = Game;
