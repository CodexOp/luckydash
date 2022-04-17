import React, {useState, useContext, useEffect} from 'react';
import './migrate.scss';
import Calculator from '../calculator/Calculator';
import { ethers } from "ethers";
import values from "../../values.json"
import tokenAbi from '../../abi/token.json'
import migration from '../../abi/migration.json'
import {provider, setProvider, signer, setSigner} from '../../App';

const Migrate = () => {
  const [active, setActive] = useState();
  let [balance, setBalance] = useState(0);
  let [ratio, setRatio] = useState({numerator: 0, denominator: 1});
  let [inputAmount, setInputAmount] = useState(0);
  let [outputAmount, setOutputAmount] = useState(0);
  let [maxOutputAmount, setMaxOutputAmount] = useState(0);

  let _provider = useContext (provider);
  let _setProvider = useContext (setProvider);
  let _signer = useContext (signer);
  let _setSigner = useContext (setSigner);

  React.useEffect(() => {
    console.log ("Providerrrrrrr Changed")
    console.log ("Provider:", _provider)

      async function fetchData(){
        try{
            console.log("Fetching data...")
            const _balance = await _getBalance(values.MFT);
            setBalance(_balance);
            let _ratio = await getRatio();
            setRatio(_ratio);
            console.log("feched dataaaa")
            let token = new ethers.Contract (
                values.MFT,
                tokenAbi,
                _signer
            )
            let _decimals = await token.decimals();
            console.log ("Decimals1", _decimals)
            let temp = ethers.utils.parseUnits(_balance.toString(), _decimals);
            token = new ethers.Contract (
                values.token,
                tokenAbi,
                _signer
            )
            console.log("temp",temp.toString());
            _decimals = await token.decimals();
            console.log ("Decimals2", _decimals)
            temp = temp.mul((_ratio.numerator).toString()).div((_ratio.denominator).toString());
            temp = ethers.utils.formatUnits(temp, _decimals)
            console.log("temp",temp.toString());
            setMaxOutputAmount(temp);

        } catch(err){
            console.log("Failed to fetch")
            console.log(err);
        }
      }
      fetchData();
  }, [_provider, _signer]);

  async function getRatio(){
      try{
          let migratonContract = new ethers.Contract(
              values.migration,
              migration,
              _signer
          );
          let numerator = await migratonContract.ratioNumerator();
          let denominator = await migratonContract.ratioDenominator();
          return {numerator, denominator};
      } catch(err){
          console.log (err);
          return {numerator: 0, denominator: 1};
      }
  }

  async function _getBalance (address){
    try {
      let token = new ethers.Contract(
        address,
        tokenAbi,
        _provider
      );
      
      const walletAddress = await _signer.getAddress();
      let balance = await token.balanceOf (walletAddress);
      let decimals = await token.decimals();
      decimals = parseInt(decimals.toString());
      balance = ethers.utils.formatEther(balance, decimals);
      console.log ("balance", balance.toString());
      return parseFloat(balance.toString());
    } catch (err){
      console.log (err);
      return 0;
    }
  }

  async function approve () {
      try{
        const token = new ethers.Contract (
            values.MFT,
            tokenAbi,
            _signer
        )
        let _decimals = await token.decimals();
        console.log("Hellow Decimal:", _decimals)
        let _amount = ethers.utils.parseUnits((balance*2).toString(), _decimals);
        let tx = await token.approve(values.migration, _amount);
      }catch (err) {
          console.log(err);
      }
  }

  async function migrate () {
      try{
          console.log("Migrating...");
          const migrationContract = new ethers.Contract (
              values.migration,
              migration,
              _signer
          );
          const token = new ethers.Contract (
            values.MFT,
            tokenAbi,
            _signer
          )
          const walletAddress = await _signer.getAddress();
          let _decimals = await token.decimals();
          let _inputAmount = ethers.utils.parseUnits(inputAmount.toString(), _decimals)
          let tx = await migrationContract.migrateTokens(walletAddress, _inputAmount);
      }catch (err){
          console.log(err);
          console.log("Hi")
          alert("Please approve the Token First, then try migrating!")
      }
  }

  async function changeInput (activeState, changeValue){
    setActive(activeState); 
    let temp = changeValue;
    setInputAmount(temp);
    let token = new ethers.Contract (
        values.MFT,
        tokenAbi,
        _signer
    )
    let _decimals = await token.decimals();
    console.log ("Decimals1", _decimals)
    temp = ethers.utils.parseUnits(temp.toString(), _decimals);
    token = new ethers.Contract (
        values.token,
        tokenAbi,
        _signer
    )
    console.log("temp",temp.toString());
    _decimals = await token.decimals();
    console.log ("Decimals2", _decimals)
    temp = temp.mul((ratio.numerator).toString()).div((ratio.denominator).toString());
    temp = ethers.utils.formatUnits(temp, _decimals)
    console.log("temp",temp.toString());
    setOutputAmount(temp);
  }

  
  return (
    <div className='migrate_outer'>
    <div className='calculator_title'>
        <h2>Migrate Old Token To New</h2>
    </div>
    <div className='calculator_content'>
        <div className='title_calculator'>
        <h3  className='input_label'>INPUT MFT TOKEN</h3>
        </div>
        <div className='input_container input_max'>
            <input className='input_calculator flex_max' placeholder='amount' value= {inputAmount} onChange={(event) =>{console.log ("value:", inputAmount); changeInput("", event.target.value)}} />
            <div className='max' onClick={() => changeInput("fourth", (balance))}>  
            <h3>Max</h3>

            </div>
        </div>
        <div className='input_button'>
        <button onClick={() => changeInput("first", (balance * 0.25))} className={active == 'first' ? "percentage_button active" : "percentage_button "}>25%</button>
        <button onClick={() => changeInput("second", (balance * 0.5))} className={active == 'second' ? "percentage_button active" : "percentage_button "}>50%</button>
        <button onClick={() => changeInput("third", (balance * 0.75))} className={active == 'third' ? "percentage_button active" : "percentage_button "}>75%</button>
        <button onClick={() => changeInput("fourth", (balance))} className={active == 'fourth' ? "percentage_button active" : "percentage_button "}>100%</button>

        </div>

        <div className='availaible_token'>
        <p className='purple'>{balance} Tokens Availaible</p>
        </div>
        <div className='title_calculator'>
        <h3  className='input_label'>OUTPUT LMETA TOKEN</h3>

        </div>
        <input className='input_calculator' placeholder='amount' value = {outputAmount} disabled/>
        <p className='purple'>Max {maxOutputAmount} Possible</p>

    

        {/* <div className='info_calculator'>
            <div className='info1'>
                <div className='left_info'>
                    <p className='info'>Price of old token</p>
                </div>
                <div className='right_info'>
                    <p  className='info'>5421 Token</p>
                
                </div>
            </div>
            <div className='info1'>
                <div className='left_info'>
                    <p  className='info'>Price of new token</p>
                    
                </div>
                <div className='right_info'>
                <p  className='info'>5421 Token</p>
                </div>
            </div>
            <div className='info1'>
                <div className='left_info'>
                    <p className='info'>Total token you get</p>
                </div>
                <div className='right_info'>
                    <p className='green'>+$0.00</p>
                </div>
            </div>
        </div> */}
        <button className='earn_button earnbutt2' onClick={approve} >Approve</button>
        <button className='button_main earn_button earn_butt23 ' onClick = {migrate} >Migrate</button>
    </div>



</div>  )
}

export default Migrate