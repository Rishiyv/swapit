require('@nomiclabs/hardhat-waffle');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  networks: {
    rinkeby: {
      url: 'https://eth-rinkeby.alchemyapi.io/v2/Ex6PuxSDjJZTPLexZSIOhQ-fEfgXZ0zJ',
      accounts: [
        'ef93defe9bd775f2e3d5fcc32c8c555331c5c4b995199cedfaa878d9c7e1629f',
      ],
    },
  },
};
