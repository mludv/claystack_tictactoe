# Tic Tac Toe

- This is the code for Tic Tac Toe on the blockchain.
- I've tried to use minimal dependencies in order to keep the code clean.
- The solidity contract was developed in Remix using a ganache test network locally.
- Right now the game only allows one concurrent game, you can observe if there is no seats left.

## Test it
I've deployed the frontend to [github pages](https://mludv.github.io/claystack_tictactoe/) and the contract is deployed to the Goerli test network, so make sure your metamask wallet is connected there. I haven't done much testing.

## Next steps
- I didn't implement betting yet. Should be straightforward to add though.
- Multiple games. Could have a separate contract which allows the user to deploy their own game contract in order to support multiple games. Or store all games within the same contract.
- Test. No tests has been written. Edge cases hasn't really been tested either.

## Code
- The `contracts` folder contains the solidity contract.
- The `tictactoe` contains the react frontend.
