//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import './Token.sol';
import 'hardhat/console.sol';
import '@openzeppelin/contracts/utils/math/SafeMath.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';

interface IReceiver {
    function receiveTokens(address _tokenAddress, uint256 amount) external;
}

contract FlashLoan is ReentrancyGuard {
    using SafeMath for uint256;

    Token public token;
    uint256 public poolBalance;
    address owner;

    constructor(address _tokenAddress) {
        token = Token(_tokenAddress);
    }

    function depositTokens (uint256 _amount) external payable {
        require(_amount > 0, 'Must send atleast 1 token');
        token.transferFrom(msg.sender, address(this), _amount);
        poolBalance = poolBalance.add(_amount);
    }

    function flashLoan (uint256 _borrowAmount) external payable nonReentrant {
        require(_borrowAmount > 0, "Must borrow at least 1 token");

        uint256 balanceBefore = token.balanceOf(address(this));
        require(balanceBefore >= _borrowAmount, "Insufficient amount in the pool");

        // Ensured by the protocol via the 'deposit' function
        //assert(poolBalance == balanceBefore);

        // Send tokens to the Receiver
        token.transfer(msg.sender, _borrowAmount);
        
        // Use loan, Get paid back lent tokens
        IReceiver(msg.sender).receiveTokens(address(token), _borrowAmount);

        // Ensure loan is fully paid back
        uint256 balanceAfter = token.balanceOf(address(this));
        require(balanceAfter >= balanceBefore, 'Flash loan has not been paid back');
    }
}