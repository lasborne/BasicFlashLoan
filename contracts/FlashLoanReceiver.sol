//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import 'hardhat/console.sol';
import './FlashLoan.sol';

contract FlashLoanReceiver {
    FlashLoan private pool;
    address private owner;

    event LoanReceived(address token, uint256 amount);

    constructor(address _poolAddress) {
        pool = FlashLoan(_poolAddress);
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, 'Only the owner can execute Flash Loans, mate!');
        _;
    }

    modifier onlyPool() {
        require(msg.sender == address(pool), 'Sender must be the Pool contract address');
        _;
    }

    function receiveTokens(address _tokenAddress, uint256 _amount) external onlyPool() {
        // Require funds received
        require(Token(_tokenAddress).balanceOf(address(this)) == _amount, "Failed to get loan");

        // Emit event
        emit LoanReceived(_tokenAddress, _amount);

        // Do stuff with the money...

        // Return funds to the pool
        require(Token(_tokenAddress).transfer(address(pool), _amount), 'Transfer back to the pool failed');
    }
    
    function executeFlashLoan(uint256 _amount) external onlyOwner() payable {
        pool.flashLoan(_amount);
    }
}