/**
 * Stateless board component.
 */

import styles from "./Board.module.css";
import { Move } from "./contract";

const drawMove = (move: Move) =>
  move === Move.Player1 ? "x" : move === Move.Player2 ? "o" : "";

interface Props {
  disabled: boolean;
  state: Move[];
  yourTurn: boolean;
  onClick: (location: number) => void;
}
function Board({ state, onClick, yourTurn = false, disabled = false }: Props) {
  if (state.length !== 9) throw Error("State needs to be exactly 9 elements");
  return (
    <div className={[styles.board, disabled ? styles.disabled : ""].join(" ")}>
      {state.map((move, i) => (
        <div
          className={[
            styles.box,
            !disabled && yourTurn && move === Move.None ? styles.clickable : "",
          ].join(" ")}
          key={i}
          onClick={() => {
            yourTurn && onClick(i);
          }}
        >
          {drawMove(move)}
        </div>
      ))}
    </div>
  );
}

export default Board;
