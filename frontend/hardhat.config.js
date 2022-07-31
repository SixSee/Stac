require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
      // localhost: {
      //     url: "http://localhost:8545"
      // },
 hardhat: {
   chainId: 1337
 },
},
solidity: "0.8.9",
 paths: {
     artifacts: './client/src/artifacts',
 },
};