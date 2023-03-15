const {ethers} = require('hardhat');
const {expect} = require('chai');

const tokens = (n) => {
    return ethers.utils.parseEther(n.toString())
}

describe('Flash Loan', () => {
    let deployer, flashLoan, flashLoanReceiver, token

    beforeEach(async() => {
        // Load deployer account
        [deployer] = await ethers.getSigners()

        // Load Contracts
        let FlashLoan = await ethers.getContractFactory('FlashLoan')
        let FlashLoanReceiver = await ethers.getContractFactory('FlashLoanReceiver')
        let Token = await ethers.getContractFactory('Token')

        // Deploy contracts
        // Deploy token
        token = await Token.deploy()

        // Deploy the Flash Loan Pool
        flashLoan = await FlashLoan.deploy(token.address)

        // Check the balance of the deployer
        let bal = await token.balanceOf(deployer.address)
        expect(bal).to.eq(tokens(1000000000))

        //Approve spending tokens
        await token.connect(deployer).approve(flashLoan.address, tokens(1000000000))

        // Deposit tokens into the FlashLoan pool contract
        await flashLoan.connect(deployer).depositTokens(tokens(900000000))

        // Deploy the Flash Loan Receiver Contract
        flashLoanReceiver = await FlashLoanReceiver.deploy(flashLoan.address)
    })

    describe('Deployment', () => {

        it('deposits tokens into the Flash Loan pool', async() => {
            
            expect(await token.balanceOf(flashLoan.address)).to.equal(tokens(900000000))
            expect(await flashLoan.connect(deployer).poolBalance()).to.eq(tokens(900000000))
        })

        it('borrows fund from the flash loan pool', async() => {
            let borrowAmount = tokens(1000)
            let transaction = await flashLoanReceiver.connect(deployer).executeFlashLoan(borrowAmount)
            await transaction.wait()
            //expect(await token.balanceOf(flashLoanReceiver.address)).to.eq(tokens(1000))
            
            await expect(transaction).to.emit(flashLoanReceiver, 'LoanReceived').withArgs(token.address, borrowAmount)
        })
    })
})