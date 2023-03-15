# Basic FlashLoan Contract

This is a basic Flash Loan Project deployed on the Matic Mumbai testnet. It contains 3 smart contracts, FlashLoan (the Pool contract of Tokens from which the user can take a flash loan), FlashLoanReceiver (the contract by the user that executes the flash loan including borrowing, using tokens, and returning them back all in one transaction), and Token (which is a simple representation of ERC-20 Token which is used for the flash loan), a test for that contract (FlashLoan.js), and a script that deploys that contract, and can also execute the flash loan.

dusdTokenAddress = '0xf591297fA547374CD9dFE4C0F21E44be220f8c45'
flashLoanPoolAddress = '0x6EfeAAA6C73C96a1dF80d23eF990Fd85B25604B3'
flashLoanReceiverAddress = '0x633d606E1d33768542E238e9bd192Bc9d551D978'

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test test/FlashLoan.js --network hardhat
npx hardhat node
npx hardhat run scripts/deploy.js --network maticmum
```
