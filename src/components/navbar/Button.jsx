import './navbar.scss';
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/solid'
import React, {useRef, useContext, useEffect, useState} from 'react'
import metamask from '../../images/metamask.png'
import trustwallet from '../../images/trustwallet.png'
import {provider, setProvider, signer, setSigner} from '../../App';
import Web3Modal from "web3modal";
import {ethers,  providers } from "ethers";
import values from "../../values.json"
// import Fortmatic from "fortmatic";
// import Torus from "@toruslabs/torus-embed";
import WalletConnectProvider from "@walletconnect/web3-provider";

const Button = () => {

  
  let [connectedWallet, setConnectedWallet] = useState(false);
  let [walletAddress, setWalletAddress] = useState("");

  useEffect(() => {
    web3ModalRef.current = new Web3Modal({
      network: "rinkeby",
      providerOptions: {
        walletconnect: {
          package: WalletConnectProvider, // required
          options: {
            infuraId: "INFURA_ID" // required
          }
          // coinbasewallet: {
          //   package: "CoinbaseWalletSDK", // Required
          //   options: {
          //     appName: "My Awesome App", // Required
          //     infuraId: "INFURA_ID", // Required
          //     rpc: "", // Optional if `infuraId` is provided; otherwise it's required
          //     chainId: 1, // Optional. It defaults to 1 if not provided
          //     darkMode: false // Optional. Use dark theme, defaults to false
          //   }
          // },
          // fortmatic: {
          //   package: Fortmatic, // required
          //   options: {
          //     key: "FORTMATIC_KEY", // required,
          //     // network: customNetworkOptions // if we don't pass it, it will default to localhost:8454
          //   }
          // },
          // torus: {
          //   package: Torus, // required
          //   options: {
          //     networkParams: {
          //       host: "https://localhost:8545", // optional
          //       chainId: 1337, // optional
          //       networkId: 1337 // optional
          //     },
          //     config: {
          //       buildEnv: "development" // optional
          //     }
          //   }
          // }
        }
      },
    });
    connectWallet();
  }, []);

  let _provider = useContext (provider);
  let _setProvider = useContext (setProvider);
  let _signer = useContext (signer);
  let _setSigner = useContext (setSigner);
  const web3ModalRef = useRef(); // return the object with key named current


  const connectWallet = async () => {
    try {
      await getSignerOrProvider(true);
    } catch (error) {
      console.log(" error", error);
    }
  };

  const getSignerOrProvider = async (needSigner = false) => {
    try{
      const _provider = new providers.JsonRpcProvider(values.rpcUrl);
      _setProvider(_provider);
      const provider = await web3ModalRef.current.connect();
      const web3Provider = new providers.Web3Provider(provider);
      const { chainId } = await web3Provider.getNetwork();
      console.log ("ChainId: ", chainId);
      // if (chainId !== 4) {
      //   alert("USE RINKEEBY NETWORK");
      //   throw new Error("Change network to Rinkeby");
      // }
      if (needSigner) {
        const signer = web3Provider.getSigner();
        _setSigner(signer)
        let temp = await signer.getAddress();
        setWalletAddress(temp.toString());
      }
      setConnectedWallet(true);
    } catch (error) {
      console.log (error);
      const provider = new providers.JsonRpcProvider(values.rpcUrl);
      _setProvider(provider);
    }
  };

  console.log ("ConnectedWallet: " , connectedWallet)


    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
      }
  return (
    <button className='button button_main'>
      Connect
             </button>
  )
}

export default Button