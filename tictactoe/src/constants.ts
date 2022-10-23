export const ADDRESS = "0xcD0143D91BE69CF736F65485AbfB4774A070482b";
export const ABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [],
    name: "BoardChange",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [],
    name: "GameReset",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [],
    name: "PlayersChange",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "location",
        type: "uint8",
      },
    ],
    name: "doMove",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getBoard",
    outputs: [
      {
        internalType: "enum TicTacToe.Move[9]",
        name: "",
        type: "uint8[9]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "joinGame",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "nextMove",
    outputs: [
      {
        internalType: "enum TicTacToe.Move",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "player1",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "player2",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "resetGame",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "status",
    outputs: [
      {
        internalType: "enum TicTacToe.GameStatus",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
