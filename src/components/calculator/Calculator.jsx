import React, {useState} from 'react';
import './calculator.scss';

const Calculator = () => {

    let [depositAmount, setDepositAmount] = useState(100);
    let [price, setPrice] = useState(10);
    let [days, setDays] = useState(365);
    let [apr, setApr] = useState(6);
    
  return (
    <div className='calculator_outer'>
        <div className='calculator_title'>
            <h2>See how much you can receive</h2>
        </div>
        <div className='calculator_content'>
            <div className='title_calculator'>
            <h3  className='input_label'>Deposit amount (LMETA)</h3>
            </div>
            <div className='input_container input_max'>
                <input className='input_calculator ' placeholder='amount' value = {depositAmount} onChange={(event)=> setDepositAmount(event.target.value)} />
                {/* <div className='max'>
                <h3>Max</h3>

                </div> */}
            </div>

            <div className='title_calculator'>
            <h3  className='input_label'>Price of LMETA</h3>

            </div>
            <input className='input_calculator' placeholder='amount' value = {price} onChange={(event)=> setPrice(event.target.value)}/>
            
            {/* <div className='availaible_token'>
            <p className='purple'>254675 Dai Availaible</p>
            </div> */}
            <div className='title_calculator'>
            <h3  className='input_label'>Term In Days</h3>

            </div>
            <input className='input_calculator' placeholder='amount' value = {days} onChange={(event)=> setDays(event.target.value)}/>
            <div className='title_calculator'>
            <h3 className='input_label'>Fixed APR / MPH APR (in %)</h3>
            </div>
            <input className='input_calculator' placeholder='amount' value = {apr} onChange={(event)=> setApr(event.target.value)}/>

            <div className='info_calculator'>
                <div className='info1'>
                    <div className='left_info'>
                        <p className='info'>Fixed-rate yield at maturity</p>
                    </div>
                    <div className='right_info'>
                        <p  className='info'>{(((depositAmount * (36500 + apr * days))/(100 * 365))).toFixed(2)} LMETA</p>
                        <p>${(((depositAmount* price * apr * days)/(100 * 365)) + depositAmount* price).toFixed(3)}</p>
                    </div>
                </div>
                <div className='info1'>
                    <div className='left_info'>
                        <p  className='info'>Token rewards</p>
                        
                    </div>
                    <div className='right_info'>
                    <p  className='info'>{((depositAmount * apr * days)/(100 * 365)).toFixed(3)} LMETA</p>
                        <p>${(((depositAmount* price * apr * days)/(100 * 365))).toFixed(3)}</p>
                    </div>
                </div>
                <div className='info1'>
                    <div className='left_info'>
                        <p className='info'>Total available at maturity 	</p>
                    </div>
                    <div className='right_info'>
                        <p className='green'>+${(((depositAmount* price * apr * days)/(100 * 365))).toFixed(3)}</p>
                    </div>
                </div>
            </div>
            <button className='button_main earn_button' onClick = {()=> alert("Staking will come soon!")} >Start Earning</button>
        </div>



    </div>
  )
}

export default Calculator