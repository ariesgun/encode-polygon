import React, { useEffect, useState } from "react";
import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import {ethers} from "ethers";

import contractAbi from './utils/contractABI.json';

// At the very top of the file, after the other imports
import polygonLogo from './assets/polygonlogo.png';
import ethLogo from './assets/ethlogo.png';
import { networks } from './utils/networks';
import { Notification, NotificationError, NotificationSuccess } from "./components/Notification/Notification";
import { toast } from "react-toastify";

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const CONTRACT_ADDRESS = '0xAD5F953c42E5dEE6d93A916d5F4803C46CB81853';


const App = () => {
	const [currentAccount, setCurrentAccount] = useState('');
	// Create a stateful variable to store the network next to all the others
	const [network, setNetwork] = useState('');

	const [voteOpen, setVoteOpen] = useState(true);
	const [proposal, setProposal] = useState('');
	const [voters, setVoters] = useState([]);
	const [totalVotes, setTotalVotes] = useState([])

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask -> https://metamask.io/");
        return;
      }
			
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

	const checkIfWalletIsConnected = async () => {
		const { ethereum } = window;

		if (!ethereum) {
			console.log('Make sure you have metamask!');
			return;
		} else {
			console.log('We have the ethereum object', ethereum);
		}

		const accounts = await ethereum.request({ method: 'eth_accounts' });

		if (accounts.length !== 0) {
			const account = accounts[0];
			console.log('Found an authorized account:', account);
			setCurrentAccount(account);
		} else {
			console.log('No authorized account found');
		}

		// This is the new part, we check the user's network chain ID
    const chainId = await ethereum.request({ method: 'eth_chainId' });
    setNetwork(networks[chainId]);

    ethereum.on('chainChanged', handleChainChanged);
    
    // Reload the page when they change networks
    function handleChainChanged(_chainId) {
      window.location.reload();
    }
	};

	const voteYes = async() => {
		try {
			const { ethereum } = window;
			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer);

				let tx = await contract.voteYes();
				const receipt = await tx.wait();

				// Check if the transaction was successfully completed
				if (receipt.status === 1) {
					totalVotes['yes'] += 1;
					setTotalVotes(totalVotes);
					toast(<NotificationSuccess text="You've successfully voted!" />);
					console.log("Vote casted! https://mumbai.polygonscan.com/tx/"+tx.hash);
				}
				else {
					alert("Transaction failed! Please try again");
				}
			}
		}
		catch(error){
			const msg = "Failed to vote: " + error.message.slice(0,73); 
			toast(<NotificationError text={msg} />);
			console.log(error);
		}
	}

	const voteNo = async() => {
		try {
			const { ethereum } = window;
			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer);

				let tx = await contract.voteNo();
				const receipt = await tx.wait();

				// Check if the transaction was successfully completed
				if (receipt.status === 1) {
					totalVotes['no'] += 1;
					setTotalVotes(totalVotes);
					toast(<NotificationSuccess text="You've successfully voted!" />);
					console.log("Vote casted! https://mumbai.polygonscan.com/tx/"+tx.hash);
				}
				else {
					alert("Transaction failed! Please try again");
				}
			}
		}
		catch(error){
			const msg = "Failed to vote: " + error.message.slice(0,73); 
			toast(<NotificationError text={msg} />);
			console.log(error);
		}
	}

	const voteAbstain = async() => {
		try {
			const { ethereum } = window;
			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer);

				let tx = await contract.voteAbstain();
				const receipt = await tx.wait();

				// Check if the transaction was successfully completed
				if (receipt.status === 1) {
					totalVotes['abstain'] += 1;
					setTotalVotes(totalVotes);
					toast(<NotificationSuccess text="You've successfully voted!" />);
					console.log("Vote casted! https://mumbai.polygonscan.com/tx/"+tx.hash);
				}
				else {
					alert("Transaction failed! Please try again");
				}
			}
		}
		catch(error) {
			const msg = "Failed to vote: " + error.message.slice(0,73);
			toast(<NotificationError text={msg} />);
			console.log(error);
		}
	}

	const openVote = async() => {
		try {
			const { ethereum } = window;
			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer);

				let tx = await contract.startVote();
				const receipt = await tx.wait();

				// Check if the transaction was successfully completed
				if (receipt.status === 1) {
					setVoteOpen(true);
					toast(<NotificationSuccess text="Vote is open!" />);
					console.log("Vote opened! https://mumbai.polygonscan.com/tx/"+tx.hash);
				}
				else {
					toast(<NotificationError text="Failed to start Vote. Please try again!" />);
					alert("Transaction failed! Please try again");
				}
			}
		}
		catch(error) {
			const msg = "Failed to vote: " + error.message.slice(0,73); 
			toast(<NotificationError text={msg} />);
			console.log(error);
		}
	}

	// Add this function anywhere in your component (maybe after the mint function)
	const fetchMints = async () => {
		try {
			const { ethereum } = window;
			if (ethereum) {
				// You know all this
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi.abi, signer);

				const votesTotal = await contract.votesTotal();
				const proposal = await contract.proposalUri();
				const choices = await contract.choices(currentAccount);
				const voters = await contract.getAllVoters();
				const isOpen = await contract.isOpen();

				console.log(votesTotal['abstain'].toNumber());
				console.log(proposal);

				setVoteOpen(isOpen);
				setProposal(proposal);
				setTotalVotes(votesTotal);
				setVoters(voters);
				
				console.log(voters);
				console.log(choices);
					
				// // Get all the domain names from our contract
				// const names = await contract.getAllNames();
					
				// // For each name, get the record and the address
				// const mintRecords = await Promise.all(names.map(async (name) => {
				// const mintRecord = await contract.records(name);
				// const owner = await contract.domains(name);
				// return {
				// 	id: names.indexOf(name),
				// 	name: name,
				// 	record: mintRecord,
				// 	owner: owner,
				// };
				// }
			// ));

			// console.log("MINTS FETCHED ", mintRecords);
			// setMints(mintRecords);
			}
		} catch(error){
			console.log(error);
		}
	}

	const switchNetwork = async () => {
		if (window.ethereum) {
			try {
				// Try to switch to the Mumbai testnet
				await window.ethereum.request({
					method: 'wallet_switchEthereumChain',
					params: [{ chainId: '0x13881' }], // Check networks.js for hexadecimal network ids
				});
			} catch (error) {
				// This error code means that the chain we want has not been added to MetaMask
				// In this case we ask the user to add it to their MetaMask
				if (error.code === 4902) {
					try {
						await window.ethereum.request({
							method: 'wallet_addEthereumChain',
							params: [
								{	
									chainId: '0x13881',
									chainName: 'Polygon Mumbai Testnet',
									rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
									nativeCurrency: {
											name: "Mumbai Matic",
											symbol: "MATIC",
											decimals: 18
									},
									blockExplorerUrls: ["https://mumbai.polygonscan.com/"]
								},
							],
						});
					} catch (error) {
						console.log(error);
					}
				}
				console.log(error);
			}
		} else {
			// If window.ethereum is not found then MetaMask is not installed
			alert('MetaMask is not installed. Please install it to use this app: https://metamask.io/download.html');
		} 
	}

	// Render methods
	const renderNotConnectedContainer = () => (
		<div className="connect-wallet-container">
			<img src="https://media.giphy.com/media/3ohhwytHcusSCXXOUg/giphy.gif" alt="Ninja donut gif" />
      {/* Call the connectWallet function we just wrote when the button is clicked */}
			<button onClick={connectWallet} className="cta-button connect-wallet-button">
				Connect Wallet
			</button>
		</div>
	);
	
	// Form to enter domain name and data
	const renderInputForm = () =>{

		if (network !== 'Polygon Mumbai Testnet') {
			return (
				<div className="connect-wallet-container">
					<p>Please connect to the Polygon Mumbai Testnet</p>
					{/* This button will call our switch network function */}
      	  <button className='cta-button mint-button' onClick={switchNetwork}>Click here to switch</button>
				</div>
			);
		}

		return (
			<>
				<Notification />
				<div className="form-container">
					<h1>Proposal</h1>
					<div className="container">
						<div className="proposed-container">
							<p>By: {currentAccount}</p>
						</div>
						<div className="proposal-container">
							<p>{proposal}</p>
						</div>
					</div>

					<div className="button-container">
						{voteOpen && 
							<>
								<button className='cta-button mint-button' disabled={null} onClick={voteYes}>
									Yes
								</button>
								<button className='cta-button mint-button' disabled={null} onClick={voteNo}>
									No
								</button>  
								<button className='cta-button mint-button' disabled={null} onClick={voteAbstain}>
									Abstain
								</button>  
							</>
						}
						{!voteOpen && 
							<>
								<br/>
								<p>Vote is not started yet!</p>
								<button className='cta-button mint-button' disabled={null} onClick={openVote}>
									Start Vote
								</button>
							</>
						}
					</div>
				</div>
			</>
		);
	}

	const renderVoters = () => {

		return (
			<>
				<div>
					<p className="subtitle">Total Votes</p>
					<div className="total-vote">
						<p>Yes</p>
						<p>{(totalVotes['yes'] ? totalVotes['yes'].toNumber(): 0)}</p> 
					</div>
					<div className="total-vote">
						<p>No</p>
						<p>{(totalVotes['no'] ? totalVotes['no'].toNumber(): 0)}</p> 
					</div>
					<div className="total-vote">
						<p>Abstain</p>
						<p>{(totalVotes['abstain'] ? totalVotes['abstain'].toNumber(): 0)}</p> 
					</div>
					<br />
				</div>
				<div>
					<p className="subtitle"> Those who have casted their choices... </p>
					<div>
						{voters.map((voter) => {
							console.log(voter);
							return (
								<div className="voter-container">
									<p>{voter.slice(0, 10)}...{voter.slice(-8)}</p>
									<p>Yes</p>
								</div>
							);
							}
						)}
					</div>
				</div>
			</>
		)
			
	}
  
	useEffect(() => {
		checkIfWalletIsConnected();
	}, []);

	// This will run any time currentAccount or network are changed
	useEffect(() => {
		if (network === 'Polygon Mumbai Testnet') {
			fetchMints();
		}
	}, [currentAccount, network]);

	return (
		<div className="App">
			<div className="container">
				<div className="header-container">
					<header>
						<div className="left">
							<p className="title">🐱‍👤 Ninja d-Voting</p>
							<p className="subtitle">Because Your Voice Matters...!</p>
						</div>
						{/* Display a logo and wallet connection status*/}
						<div className="right">
							<img alt="Network logo" className="logo" src={ network.includes("Polygon") ? polygonLogo : ethLogo} />
							{ currentAccount ? <p> Wallet: {currentAccount.slice(0, 6)}...{currentAccount.slice(-4)} </p> : <p> Not connected </p> }
						</div>
					</header>
				</div>
				
				{!currentAccount && renderNotConnectedContainer()}
				{/* Render the input form if an account is connected */}
				{currentAccount && renderInputForm()}
				{currentAccount && voteOpen && renderVoters()}
				
				<div className="footer-container">
					<img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
					<a
						className="footer-text"
						href={TWITTER_LINK}
						target="_blank"
						rel="noreferrer"
					>{`credits to @${TWITTER_HANDLE}`}</a>
				</div>
			</div>
		</div>
	);
};

export default App;