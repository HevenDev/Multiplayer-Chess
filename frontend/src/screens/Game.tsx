import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { ChessBoard } from "../components/ChessBoard";
import { useSocket } from "../hooks/useSocket";
import { Chess, Color } from "chess.js";

export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";

export const Game = () => {
  const socket = useSocket();

  const [started, setStarted] = useState(false);
  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [playerColor, setPlayerColor] = useState<Color | null>(null);
  useEffect(() => {
    if (!socket) return;
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case INIT_GAME:
          setStarted(true);
          setBoard(chess.board());
          setPlayerColor(message.payload.color as Color);
          break;
        case MOVE:
          const move = message.payload;
          chess.move(move);
          setBoard(chess.board());
          break;
        case GAME_OVER:
          break;
      }
    };
  }, [socket]);

  if (!socket) return <div>Connecting...</div>;

  return (
    <div className="justify-center flex text-white">
      <div className="mt-8 max-w-screen-lg w-full ">
        <div className="grid grid-cols-6 w-full  gap-4 ">
          <div className="col-span-4 w-full flex justify-center">
            <ChessBoard
              playerColor={playerColor || "w"}
              setBoard={setBoard}
              chess={chess}
              socket={socket}
              board={board}
            />
          </div>
          <div className="col-span-2 bg-slate-900 w-full flex justify-center items-center flex-col gap-8">
            <h1 className="text-2xl font-semibold">
              Play online Chess at #1 Site!
            </h1>
            {playerColor && (
              <div className="mb-4 text-lg font-bold">
                You are playing as {playerColor === "b" ? "Black" : "White"}
              </div>
            )}
            {!started && (
              <Button
                onClick={() => {
                  socket.send(
                    JSON.stringify({
                      type: INIT_GAME,
                    })
                  );
                }}
              >
                Let's Play
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
