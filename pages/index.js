import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [transactions, setTransactions] = useState([]);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(account);
    }
  };

  const handleAccount = (account) => {
    if (account) {
      console.log("Account connected: ", account);
      setAccount(account);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  };

  const getTransactionHistory = async () => {
    if (atm) {
      const history = await atm.getTransactionHistory();
      setTransactions(
        history.map((tx) => ({
          amount: tx.amount.toNumber(),
          type: tx.transactionType,
          date: new Date(tx.timestamp * 1000).toLocaleString(),
        }))
      );
    }
  };

  const deposit = async (amount) => {
    if (atm) {
      let tx = await atm.deposit(amount);
      await tx.wait();
      getBalance();
      getTransactionHistory();
    }
  };

  const withdraw = async (amount) => {
    if (atm) {
      let tx = await atm.withdraw(amount);
      await tx.wait();
      getBalance();
      getTransactionHistory();
    }
  };

  const withdrawAll = async () => {
    if (atm) {
      let tx = await atm.withdrawAll();
      await tx.wait();
      getBalance();
      getTransactionHistory();
    }
  };

  const initUser = () => {
    if (!ethWallet) {
      return <p>Please install MetaMask to use this ATM.</p>;
    }

    if (!account) {
      return (
        <button onClick={connectAccount}>
          Please connect your MetaMask wallet
        </button>
      );
    }

    if (balance === undefined) {
      getBalance();
    }

    return (
      <div>
        <p>Your Account: {account}</p>
        <p>Your Balance: {balance}</p>
        <button onClick={() => deposit(1)}>Deposit 1 ETH</button>
        <button onClick={() => deposit(500)}>Deposit 500 ETH</button>
        <button onClick={() => withdraw(1)}>Withdraw 1 ETH</button>
        <button onClick={() => withdraw(500)}>Withdraw 500 ETH</button>
        <button onClick={withdrawAll}>Withdraw All</button>
        <h3>Transaction History:</h3>
        <ul>
          {transactions.map((tx, index) => (
            <li key={index}>
              {tx.type} of {tx.amount} ETH on {tx.date}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header>
        <h1>Welcome to the Metacrafters ATM!</h1>
      </header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center;
        }
      `}</style>
    </main>
  );
}
