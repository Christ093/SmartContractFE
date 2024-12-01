// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Assessment {
    address payable public owner;
    uint256 public balance;

    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);
    event WithdrawAll(uint256 amount, uint256 timestamp);

    struct Transaction {
        uint256 amount;
        string transactionType;
        uint256 timestamp;
    }

    Transaction[] public transactionHistory;

    constructor(uint256 initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;
    }

    function getBalance() public view returns (uint256) {
        return balance;
    }

    function deposit(uint256 _amount) public payable {
        uint256 _previousBalance = balance;

        // Make sure this is the owner
        require(msg.sender == owner, "You are not the owner of this account");

        // Perform transaction
        balance += _amount;

        // Record transaction
        recordTransaction(_amount, "Deposit");

        // Assert transaction completed successfully
        assert(balance == _previousBalance + _amount);

        // Emit the event
        emit Deposit(_amount);
    }

    // Custom error
    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

    function withdraw(uint256 _withdrawAmount) public {
        require(msg.sender == owner, "You are not the owner of this account");
        uint256 _previousBalance = balance;

        if (balance < _withdrawAmount) {
            revert InsufficientBalance({balance: balance, withdrawAmount: _withdrawAmount});
        }

        // Withdraw the given amount
        balance -= _withdrawAmount;

        // Record transaction
        recordTransaction(_withdrawAmount, "Withdraw");

        // Assert the balance is correct
        assert(balance == (_previousBalance - _withdrawAmount));

        // Emit the event
        emit Withdraw(_withdrawAmount);
    }

    function withdrawAll() public {
        require(msg.sender == owner, "You are not the owner of this account");
        uint256 _previousBalance = balance;

        // Set balance to 0
        balance = 0;

        // Record transaction
        recordTransaction(_previousBalance, "WithdrawAll");

        // Assert all funds are withdrawn
        assert(balance == 0);

        // Emit the event with timestamp
        emit WithdrawAll(_previousBalance, block.timestamp);
    }

    function status() public view returns (string memory, uint256) {
        if (balance > 0) {
            return ("Account is Active", block.timestamp);
        } else {
            return ("Account is Empty", block.timestamp);
        }
    }

    // Private function to record transactions
    function recordTransaction(uint256 _amount, string memory _type) private {
        transactionHistory.push(Transaction(_amount, _type, block.timestamp));
    }

    // Function to retrieve transaction history
    function getTransactionHistory() public view returns (Transaction[] memory) {
        return transactionHistory;
    }
}

