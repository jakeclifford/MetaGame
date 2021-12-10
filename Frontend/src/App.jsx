import React, {useEffect, useState} from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';
import { CONTRACT_ADDRESS, transformCharacterData } from './constants'
import { ethers } from 'ethers'
import Arena from './Components/Arena';
import LoadingIndicator from './Components/LoadingIndicator';
import meta from './assets/meta.gif'



import NftGame from './utils/NftGame.json';
import SelectCharacter from './Components/SelectCharacter'


// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App =  () => {

  const [currentAccount, setCurrentAccount] = useState(null);

  const [characterNFT, setCharacterNFT] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const checkIfWalletIsConnected = async () => {
    try {   
      
      const { ethereum } = window

      if (!ethereum) {
        console.log("Make sure you have Metamask");
        setIsLoading(false)
        return;
      } else {
        console.log("We have found ehtereum object", ethereum)

        const accounts = await ethereum.request({ method: 'eth_accounts' })

        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log("Found an authorized account", account);
          setCurrentAccount(account)
        } else {
          console.log("No authorized account found")
        }
      }
    } catch (error) {
      console.log(error)
    }
    setIsLoading(false)
  };

  const renderContent = () => {

    if (isLoading) {
      return <LoadingIndicator />
    }

    if (!currentAccount) {
      return (
        <div className="connect-wallet-container">
            <img src={meta} alt="loading..." />
            <button
              className="cta-button connect-wallet-button"
              onClick={connectWalletAction}
            >
              Connect Wallet To Get Started
        </button>
        </div>
      )
    } else if (currentAccount && !characterNFT){
      return <SelectCharacter setCharacterNFT={setCharacterNFT} />
    
    } else if (currentAccount && characterNFT) {
      return <Arena characterNFT={characterNFT} setCharacterNFT={setCharacterNFT} />
    }

  };

  const connectWalletAction = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert('Get Metamask!');
        return;
      }

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      })

      console.log('Connected', accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      consol.log(error)
    }
  };

  useEffect(() => {
    setIsLoading
    checkIfWalletIsConnected();
  }, [])

  useEffect(() => {
    const fetchNFTMetadata = async () => {
      console.log('Checking for Character NFT on address:', currentAccount)

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        NftGame.abi,
        signer
      );

      const txn = await gameContract.checkIfUserHasNFT();
      if (txn.name){
        console.log('User has character NFT');
        setCharacterNFT(transformCharacterData(txn));
      } else {
        console.log('No character NFT found');
      }
      setIsLoading(false)
    }

    if (currentAccount) {
        console.log('CurrentAccount', currentAccount);
        fetchNFTMetadata()
      }
      
  }, [currentAccount])


  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">⚔️ Meta Slayer ⚔️</p>
          <p className="sub-text">Team up to protect the Metaverse!</p>
        </div>
        {renderContent()}
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built with @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
