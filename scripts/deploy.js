const { ethers } = require('hardhat');

const dusdTokenAddress = '0xf591297fA547374CD9dFE4C0F21E44be220f8c45'
const flashLoanPoolAddress = '0x6EfeAAA6C73C96a1dF80d23eF990Fd85B25604B3'
const flashLoanReceiverAddress = '0x633d606E1d33768542E238e9bd192Bc9d551D978'

let FlashLoanDeploy = {

    /** 
     * @dev Deploy the Flash Loan Pool contract.
     * This is the Flash Loan pool and must be implemented first. 
     * It allows storage of tokens, flash borrowing by a customised user flashloan receiver contract.
     * 
     * Requirements:
     *  - Takes in the token address.
     * 
     */
    flashLoan: async function funcFlashLoan() {
        let deployer, flashLoan
        [deployer] = await ethers.getSigners()

        let FlashLoan = await ethers.getContractFactory('FlashLoan', deployer)
        
        flashLoan = await FlashLoan.deploy(dusdTokenAddress)
        await flashLoan.deployed()
        return flashLoan
    },

    /** 
     * @dev Deploy the flashLoan Receiver contract.
     * This is the Flash Loan Receiver contract, user-defined. 
     * It borrows funds from the flash loan pool, and must pay back within the same transaction.
     * Here, the borrower can borrow, exchange tokens in different exchanges, and pay back to flashLoan pool.
     * 
     * Requirements:
     *  - Takes in the Flash Loan Pool address as argument
     * 
     */
    flashLoanReceiver: async function funcFlashLoanReceiver() {
        let deployer, flashLoanReceiver
        [deployer] = await ethers.getSigners()

        let FlashLoanReceiver = await ethers.getContractFactory('FlashLoanReceiver', deployer)
        flashLoanReceiver = await FlashLoanReceiver.deploy(flashLoanPoolAddress)
        await flashLoanReceiver.deployed()
        return flashLoanReceiver
    }
}

let FlashLoanApp = {
    
    /** 
     * @dev Execute Flash Loan. 
     * It calls the flash loan function in the pool, the flash loan calls back the receiveTokens function,
     * the funds are transferred to and fro, and must be returned to the flash loan pool contract.
     * Here, the borrower can borrow, exchange tokens in different exchanges, and pay back to flashLoan pool.
     * 
     * Requirements:
     *  - Takes in the amount to be borrowed as an argument.
     * 
     */
    executeFlashLoan: async function funcExecuteFlashLoan() {
        let deployer, flashLoanReceiver
        [deployer] = await ethers.getSigners()

        flashLoanReceiver = await FlashLoanDeploy.flashLoanReceiver()
        await flashLoanReceiver.functions.executeFlashLoan(ethers.utils.parseEther('1000'), {
            gasLimit: 6700000, gasPrice: Number(await ethers.provider.getGasPrice())
        })
    }
}

Main = async() => {
    // Call whatever function is required by the developer
    
    //await FlashLoanDeploy.flashLoan()
    //await FlashLoanDeploy.flashLoanReceiver()
    await FlashLoanApp.executeFlashLoan()
}

Main()
