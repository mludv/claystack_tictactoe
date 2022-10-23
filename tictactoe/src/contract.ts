/**
 * Hooks for communicating with the contract.
 */

import { useState } from "react";
import { useAppState } from "./state";
import { useAsync } from "./utils";

export enum Move {
  None,
  Player1,
  Player2,
}

export enum GameStatus {
  Lobby,
  Playing,
  Draw,
  WinPlayer1,
  WinPlayer2,
}

export function useDoMove() {
  const { account, contract } = useAppState();

  return useAsync(async (location: number) => {
    if (!account) throw Error("No account set");
    // const gas = await contract.methods.doMove(location).estimateGas();
    await contract.methods.doMove(location).send({ from: account });
  });
}

export function useJoinGame() {
  const { account, contract } = useAppState();

  return useAsync(async () => {
    if (!account) throw Error("No account set");
    // const gas = await contract.methods.joinGame().estimateGas();
    await contract.methods.joinGame().send({ from: account });
  });
}

export function useResetGame() {
  const { account, contract } = useAppState();

  return useAsync(async () => {
    if (!account) throw Error("No account set");
    // const gas = await contract.methods.resetGame().estimateGas();
    await contract.methods.resetGame().send({ from: account });
  });
}

export function useGameState() {
  const { contract } = useAppState();

  const [state, setState] = useState<{
    loading: boolean;
    error?: any;
    nextMove?: Move;
    player1?: string;
    player2?: string;
    board?: Move[];
    status?: GameStatus;
  }>({ loading: false });

  const fetchAll = async () => {
    try {
      const [board, status, nextMove, player1, player2] = await Promise.all([
        contract.methods.getBoard().call(),
        contract.methods.status().call(),
        contract.methods.nextMove().call(),
        contract.methods.player1().call(),
        contract.methods.player2().call(),
      ]);
      setState((current) => ({
        ...current,
        loading: false,
        board: board.map((val: string) => parseInt(val)),
        status: parseInt(status),
        nextMove: parseInt(nextMove),
        player1,
        player2,
      }));
    } catch (error) {
      console.error(error);
      setState({ loading: false, error });
    }
  };

  const fetchBoard = async () => {
    try {
      const [board, status, nextMove] = await Promise.all([
        contract.methods.getBoard().call(),
        contract.methods.status().call(),
        contract.methods.nextMove().call(),
      ]);
      setState((current) => ({
        ...current,
        loading: false,
        board: board.map((val: string) => parseInt(val)),
        status: parseInt(status),
        nextMove: parseInt(nextMove),
      }));
    } catch (error) {
      console.error(error);
      setState({ loading: false, error });
    }
  };

  const setup = async () => {
    setState({ loading: true });
    // Fetch initial data
    await fetchAll();
    // Set up subscriptions
    contract.events.BoardChange().on("data", () => {
      fetchBoard();
    });
    contract.events.PlayersChange().on("data", () => {
      fetchAll();
    });
    contract.events.GameReset().on("data", () => {
      fetchAll();
    });
  };
  return { ...state, setup };
}
