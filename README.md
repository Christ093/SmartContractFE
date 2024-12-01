# Starter Next/Hardhat Project

After cloning the github, you will want to do the following to get the code running on your computer.

1. Inside the project directory, in the terminal type: npm i
2. Open two additional terminals in your VS code
3. In the second terminal type: npx hardhat node
4. In the third terminal, type: npx hardhat run --network localhost scripts/deploy.js
5. Back in the first terminal, type npm run dev to launch the front-end.

After this, the project will be running on your localhost. 
Typically at http://localhost:3000/


---

# Solidity Smart Contract:

## Overview
This smart contract, `Assessment`, allows an owner to perform basic operations like depositing funds, withdrawing funds, and viewing transaction history. The contract maintains a balance and records each transaction, either as a deposit, withdrawal, or a withdrawal of all funds.

## Key Features
1. **Deposit Funds:** Allows the owner to deposit a specified amount into the contract.
2. **Withdraw Funds:** Allows the owner to withdraw a specified amount, with error handling for insufficient balance.
3. **Withdraw All Funds:** Allows the owner to withdraw all available funds at once.
4. **Transaction History:** Each transaction is recorded with a timestamp and transaction type (Deposit/Withdraw/WithdrawAll).
5. **Balance Status:** The contract provides a method to check if the account is active or empty.

## Functions

### 1. `getBalance()`
- **Description:** Returns the current balance of the contract.
- **Returns:** `uint256` - The current balance.

### 2. `deposit(uint256 _amount)`
- **Description:** Allows the owner to deposit a specified amount into the contract.
- **Input:** `uint256 _amount` - The amount to deposit.
- **Restrictions:** Only the owner can deposit.
- **Events:** Emits a `Deposit` event upon success.

### 3. `withdraw(uint256 _withdrawAmount)`
- **Description:** Allows the owner to withdraw a specified amount from the contract.
- **Input:** `uint256 _withdrawAmount` - The amount to withdraw.
- **Restrictions:** Only the owner can withdraw. The contract checks for sufficient balance before proceeding.
- **Events:** Emits a `Withdraw` event upon success.
- **Custom Error:** If there is insufficient balance, it triggers a custom `InsufficientBalance` error.

### 4. `withdrawAll()`
- **Description:** Allows the owner to withdraw all funds from the contract.
- **Restrictions:** Only the owner can execute this.
- **Events:** Emits a `WithdrawAll` event with the amount and the timestamp.

### 5. `status()`
- **Description:** Returns the status of the contract's balance.

### 6. `getTransactionHistory()`
- **Description:** Returns the transaction history of the contract, including amount, transaction type, and timestamp.
- **Returns:** An array of `Transaction` structs containing the transaction history.


