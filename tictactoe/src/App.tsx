/**
 * Main code for the application.
 */

import { useEffect, useRef, useState } from "react";
import { useAppState } from "./state";
import { useAsync } from "./utils";
import Board from "./Board";

import styles from "./App.module.css";
import {
  GameStatus,
  Move,
  useDoMove,
  useGameState,
  useJoinGame,
  useResetGame,
} from "./contract";

function App() {
  const { web3, account } = useAppState();

  return (
    <div className={styles.app}>
      <ConnectionStatus />
      <div className={styles.container}>
        {!account && (
          <div className={styles.cover}>Please connect your wallet</div>
        )}
        <h1>Tic Tac Toe</h1>
        <Game />
      </div>
    </div>
  );
}

function Game() {
  const { account } = useAppState();
  const gameState = useGameState();
  const resetGame = useResetGame();
  const joinGame = useJoinGame();
  const doMove = useDoMove();

  useEffect(() => {
    if (account) gameState.setup();
  }, [account]);

  const isPlayer1 = !!account && account === gameState.player1;
  const isPlayer2 = !!account && account === gameState.player2;
  const isPlayer = isPlayer1 || isPlayer2;
  const yourTurn =
    (isPlayer1 && gameState.nextMove == Move.Player1) ||
    (isPlayer2 && gameState.nextMove == Move.Player2);
  const youWin =
    (isPlayer1 && gameState.status === GameStatus.WinPlayer1) ||
    (isPlayer2 && gameState.status === GameStatus.WinPlayer2);
  const otherWin =
    (isPlayer2 && gameState.status === GameStatus.WinPlayer1) ||
    (isPlayer1 && gameState.status === GameStatus.WinPlayer2);

  return (
    <div className={styles.game}>
      <Board
        disabled={gameState.loading}
        state={gameState.board || [0, 0, 0, 0, 0, 0, 0, 0, 0]}
        onClick={(location) => {
          doMove.run(location);
        }}
        yourTurn={yourTurn}
      />
      {gameState.status == GameStatus.Lobby && !isPlayer && (
        <div className={styles.statusText}>
          <span>Waiting for players...</span>
          <button disabled={joinGame.loading} onClick={joinGame.run}>
            {joinGame.loading ? "Loading..." : "Join game"}
          </button>
        </div>
      )}
      {gameState.status == GameStatus.Lobby && isPlayer && (
        <div className={styles.statusText}>
          <span>Waiting for an opponent.</span>
        </div>
      )}
      {gameState.status == GameStatus.Playing && (
        <div className={styles.statusText}>
          <span>
            {isPlayer1
              ? "You are playing as X."
              : isPlayer2
              ? "You are playing as O."
              : "You are observing someone else's game."}
          </span>
          {yourTurn && <span>It's your turn.</span>}
        </div>
      )}
      {gameState.status == GameStatus.Draw && (
        <div className={styles.statusText}>
          <span>Game ended in a draw...</span>
          <button disabled={resetGame.loading} onClick={resetGame.run}>
            {resetGame.loading ? "Loading..." : "Reset game"}
          </button>
        </div>
      )}
      {youWin && (
        <div className={styles.statusText}>
          <span>Congrats!! You won!</span>
          <button disabled={resetGame.loading} onClick={resetGame.run}>
            {resetGame.loading ? "Loading..." : "Reset game"}
          </button>
        </div>
      )}
      {otherWin && (
        <div className={styles.statusText}>
          <span>Oh no... Your opponent won.</span>
          <button disabled={resetGame.loading} onClick={resetGame.run}>
            {resetGame.loading ? "Loading..." : "Reset game"}
          </button>
        </div>
      )}
      {gameState.status === GameStatus.WinPlayer1 && !youWin && !otherWin && (
        <div className={styles.statusText}>
          <span>Seems like X won...</span>
          <button disabled={resetGame.loading} onClick={resetGame.run}>
            {resetGame.loading ? "Loading..." : "Reset game"}
          </button>
        </div>
      )}
      {gameState.status === GameStatus.WinPlayer2 && !youWin && !otherWin && (
        <div className={styles.statusText}>
          <span>Seems like O won...</span>
          <button disabled={resetGame.loading} onClick={resetGame.run}>
            {resetGame.loading ? "Loading..." : "Reset game"}
          </button>
        </div>
      )}
    </div>
  );
}

function ConnectionStatus() {
  const state = useAppState();
  const selectRef = useRef<HTMLSelectElement>(null);
  const [accounts, setAccounts] = useState<string[]>([]);
  const { run, data, loading, error } = useAsync(async () => {
    const accounts = await state.web3.eth.getAccounts();
    // In development we can choose from several accounts
    // show a drop down to chose one.
    // In production, metamask will only return one, so we
    // can take that directly.
    if (accounts.length > 1) {
      setAccounts(accounts);
    } else if (accounts.length === 1) {
      state.setAccount(accounts[0]);
    } else {
      console.error("Unable to fetch account");
    }
  });

  const selectAccount = () => {
    if (!selectRef || !selectRef.current) return;
    state.setAccount(selectRef.current.value);
  };

  return (
    <div className={styles.status}>
      {error && <span style={{ color: "red" }}>{error.message}</span>}
      {state.account ? (
        state.account
      ) : accounts.length > 1 ? (
        <>
          <select ref={selectRef}>
            {accounts.map((acc) => (
              <option key={acc}>{acc}</option>
            ))}
          </select>
          <button onClick={selectAccount}>Select</button>
        </>
      ) : (
        <button disabled={loading} onClick={run}>
          {loading ? "Loading..." : "Connect"}
        </button>
      )}
    </div>
  );
}

export default App;
