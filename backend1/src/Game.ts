import { WebSocket } from "ws";
import { Chess } from 'chess.js'
import { GAME_OVER, INIT_GAME, MOVE } from "./message";

export class Game {
  public player1: WebSocket;
  public player2: WebSocket;
  public board: Chess;
  private startTime: Date;
  private moveCount = 0;

  constructor(player1: WebSocket, player2: WebSocket) {
    this.player1 = player1;
    this.player2 = player2;
    this.board = new Chess();
    this.startTime = new Date();
    this.player1.send(JSON.stringify({
      type: INIT_GAME,
      payload: {
        color: "w"
      }
    }));
    this.player2.send(JSON.stringify({
      type: INIT_GAME,
      payload: {
        color: "b"
      }
    }));
  }

  makeMove(socket: WebSocket, move:{
    from: string;
    to:string;
  }) {
    // Chess.js will handle following things
    // Validation here :-
    //Is it this user move
    // Validate the  type of move using zod
    //Is the  move is valid

    if (this.moveCount % 2 === 0 && socket !== this.player1) {
      return;
    }
    if (this.moveCount % 2 === 1 && socket !== this.player2) {
      return;
    }

    try {
      this.board.move(move);
    } catch (e) {
      return;
    }
    
    if(this.board.isGameOver()) {
      // Send message to both the players that game has been over.
      this.player1.send(JSON.stringify({
        type: GAME_OVER,
        payload:{
          winner: this.board.turn() === "w" ? "black" : "white"
        }
      }))
      this.player2.send(JSON.stringify({
        type: GAME_OVER,
        payload:{
          winner: this.board.turn() === "w" ? "black" : "white"
        }
      }))
      return;
    }

    if (this.moveCount % 2 === 0 && socket === this.player1) {
      this.player2.send(JSON.stringify({
        type: MOVE,
        payload: move,
      }));
    } else if (this.moveCount % 2 === 1 && socket === this.player2) {
      this.player1.send(JSON.stringify({
        type: MOVE,
        payload: move,
      }));
    } else {
      return; // Early return if the move isn't from the expected player
    }
    this.moveCount++;
    // Update the board
    //Push the move

    //Check if the game is over

    //Send the  updated board to both the players
  }
}
