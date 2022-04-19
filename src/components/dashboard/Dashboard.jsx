import React, {useContext} from 'react';
import './dashboard.scss';
import { ethers } from "ethers";
import values from "../../values.json"
import routerAbi from '../../abi/router.json'
import tokenAbi from '../../abi/token.json'
import {provider, setProvider, signer, setSigner} from '../../App';


const Dashboard = () => {

  let [walletAddress, setAddress]= React.useState("Connect Wallet");
  let [price, setPrice] = React.useState(0);
  let [balance, setBalance] = React.useState(0);
  let [bnbBalance, setBnbBalance] = React.useState(0);
  let [bnbPrice, setBnbPrice] = React.useState(0);
  let [deadBalance, setDeadBalance] = React.useState(0);
  let [totalSupply, setTotalSupply] = React.useState(0);
  let [yourBnbEarning, setyourBnbEarning] = React.useState(0);
  let [unclaimedReward, setUnclaimedReward] = React.useState(0);
  let [totalBnbReward, setTotalBnbReward] = React.useState(0);
  let apy = 383000;

  let _provider = useContext (provider);
  let _setProvider = useContext (setProvider);
  let _signer = useContext (signer);
  let _setSigner = useContext (setSigner);

    React.useEffect(() => {
        async function fetchData(){
          let _address = await _signer.getAddress();
          setAddress(_address);
          let _balance = await _getBalance(values.token);
          setBalance(_balance);
          console.log ("Bapu Balance: ", _balance);
          let _bnbBalance = await _provider.getBalance(_address);
          setBnbBalance(parseFloat(ethers.utils.formatEther(_bnbBalance)));
          getBnbPrice();
          getPrice();
          getRewardDetails();
          getTotalSupply();
          getTotalBnbDistributed();
        }
        fetchData();
    }, [_provider, _signer]);

    async function getBnbPrice (){
      try{
        let rpcUrl = values.rpcUrl;
        let provider_ = new ethers.providers.JsonRpcProvider(rpcUrl);
        let router = new ethers.Contract(
          values.router,
          routerAbi,
          provider_
        );
        const tokenIn = values.wbnb;
        const tokenOut = values.busd;
        const amountIn = ethers.utils.parseUnits("1", 18);
        let amounts = await router.getAmountsOut(amountIn, [tokenIn, tokenOut]);
        setBnbPrice(parseFloat(ethers.utils.formatEther(amounts[1].toString())).toFixed(3));
      }catch (err){
        console.log(err);
      }
    }

    async function getPrice(){
    try{
      let rpcUrl = values.rpcUrl;
      let provider_ = new ethers.providers.JsonRpcProvider(rpcUrl);
      let router = new ethers.Contract(
        values.router,
        routerAbi,
        provider_
      );
      const tokenIn = values.token;
      const tokenOut = values.wbnb;
      const amountIn = ethers.utils.parseUnits("1", 9);
      let amounts = await router.getAmountsOut(amountIn, [tokenIn, tokenOut]);
      let busd = values.busd;
      let amounts2 = await router.getAmountsOut(amounts[1], [tokenOut, busd]);
      console.log(`
          tokenIn: ${ethers.utils.formatEther(amountIn.toString())} ${tokenIn} (safeearn)
          tokenOut: ${ethers.utils.formatEther(amounts2[1].toString())} ${busd} (BUSD)
        `);
      setPrice(parseFloat(ethers.utils.formatEther(amounts2[1].toString())).toFixed(8));
    } catch (err) {
      console.log (err);
    }
  }

  async function _getBalance (address){
    try {
      let rpcUrl = values.rpcUrl;
      let provider_ = new ethers.providers.JsonRpcProvider(rpcUrl);
      let token = new ethers.Contract(
        address,
        tokenAbi,
        provider_
      );
      let provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []).catch((error) => {
        console.log(error);
      })
      let signer = provider.getSigner();
      const walletAddress = await signer.getAddress();
      let balance = await token.balanceOf (walletAddress);
      let decimals = await token.decimals();
      decimals = parseInt(decimals.toString());
      balance = ethers.utils.formatUnits(balance, decimals);
      console.log ("balance", balance.toString());
      return parseFloat(balance.toString()).toFixed(2);
    } catch (err){
      console.log (err);
      return 0;
    }
  }

  async function getRewardDetails(){
    try{
      let rpcUrl = values.rpcUrl;
      let provider_ = new ethers.providers.JsonRpcProvider(rpcUrl);
      let token = new ethers.Contract(
        values.token,
        tokenAbi,
        provider_
      );
      let dividendTrackerAddress = await token.dividendDistributor();
      console.log("DividendTrankerAddress", dividendTrackerAddress);
      let dividendTracker = new ethers.Contract(
        dividendTrackerAddress,
        ["function getHolderDetails(address holder) public view returns ( uint256 , uint256 , uint256 , uint256 )"],
        provider_
      );
      
      const walletAddress = await _signer.getAddress();
      console.log(walletAddress);
      let share = await dividendTracker.getHolderDetails(walletAddress);
      console.log("Share",share);
      setyourBnbEarning (parseFloat(ethers.utils.formatEther(share[2].toString())).toFixed(2));
      setUnclaimedReward (parseFloat(ethers.utils.formatEther(share[1].toString())).toFixed(2));
    } catch (error) {
      console.log(error);
    }
  }

  async function claimReward (){
    try{
      let rpcUrl = values.rpcUrl;
      let provider_ = new ethers.providers.JsonRpcProvider(rpcUrl);
      let token = new ethers.Contract(
        values.token,
        tokenAbi,
        provider_
      );
      let dividendTrackerAddress = await token.dividendTracker();
      console.log("DividendTrankerAddress", dividendTrackerAddress);
      let dividendTracker = new ethers.Contract(
        dividendTrackerAddress,
        ["function claimDividend() external"],
        provider_
      );
      let provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []).catch((error) => {
        console.log(error);
      })
      let signer = provider.getSigner();
      let signedDividendTracker =dividendTracker.connect(signer);
      let tx = await signedDividendTracker.claimDividend();
      console.log(tx);
    } catch (error) {
      console.log(error);
    }
  }

  async function getTotalSupply (){
    try{
      let rpcUrl = values.rpcUrl;
      let provider_ = new ethers.providers.JsonRpcProvider(rpcUrl);
      let token = new ethers.Contract(
        values.token,
        tokenAbi,
        provider_
      );
      let supply = await token.totalSupply();
      console.log("Supply", supply.toString());
      let decimals = await token.decimals();
      decimals = parseInt(decimals.toString());
      supply = ethers.utils.formatUnits(supply, decimals);
      setTotalSupply(parseInt(supply));
    } catch (err) {
      console.log(err);
    }
  }

  async function getTotalBnbDistributed (){
    try{
      let rpcUrl = values.rpcUrl;
      let provider_ = new ethers.providers.JsonRpcProvider(rpcUrl);
      let token = new ethers.Contract(
        values.token,
        tokenAbi,
        provider_
      );
      let dividendTrackerAddress = await token.dividendDistributor();
      console.log("DividendTrankerAddress", dividendTrackerAddress);
      let dividendTracker = new ethers.Contract(
        dividendTrackerAddress,
        ["function totalDistributedRewards() external view returns (uint256)"],
        provider_
      );
      let provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []).catch((error) => {
        console.log(error);
      })
      let signer = provider.getSigner();
      const walletAddress = await signer.getAddress();
      console.log(walletAddress);
      let rewards = await dividendTracker.totalDistributedRewards();
      setTotalBnbReward(parseFloat(ethers.utils.formatEther(rewards.toString())).toFixed(2))
    }catch(err){
      console.log(err);
    }
  }

    
  return (
    <div className="dashboard_outer">
        <div className='top_content'>
            <h2 className='heading'>TOKEN DASHBOARD</h2>
            <p className='subheading'>Explore all your LMETA holdings at one place</p>
            <p className='description'>Get insights from your own personalised dashboard. Open the door to your Luch through this dashboard.</p>
        </div>
        <div className='dashboard_box'>
            <div className='box_outer'>
                <p className='box_title'>LMETA Holdings</p>
                <h2 className='box_value'>{balance}</h2>
            </div>
            <div className='box_outer'>
                <p className='box_title'>Your BNB Holdings</p>
                <h2 className='box_value'>${(bnbBalance* bnbPrice).toFixed(3)}</h2>
            </div>
            <div className='box_outer'>
                <p className='box_title'>Your BNB Rewards</p>
                <h2 className='box_value'>${(yourBnbEarning * bnbPrice).toFixed(3)}</h2>
            </div>
        </div>
        <div className='single_box'>
            <div className='internal_box'>
                <p className='title_dash'>MarketCap</p>
                <h2 className='title_value'>{(totalSupply * price).toFixed(3)}</h2>
            </div>
            <div className='internal_box'>
                <p className='title_dash'>LMETA Price</p>
                <h2 className='title_value'>{price}</h2>
            </div>
            <div className='internal_box'>
                <p className='title_dash'>Total BNB Distributed</p>
                <h2 className='title_value'>{totalBnbReward} BNB</h2>
            </div>
            <div className='internal_box'>
                <p className='title_dash'>Total Supply</p>
                <h2 className='title_value'>{totalSupply}</h2>
            </div>
            <div className='internal_box'>
                <p className='title_dash'>Circulating Supply</p>
                <h2 className='title_value'>{totalSupply}</h2>
            </div>
            <div className='internal_box'>
                <p className='title_dash'>BNB Price</p>
                <h2 className='title_value'>${bnbPrice}</h2>
            </div>
        </div>
    </div>
  )
}

export default Dashboard