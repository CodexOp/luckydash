import React from 'react'
import Calculator from '../calculator/Calculator';
import './landing.scss';
import wrapper1 from '../../images/Vector1.svg'
import wrapper2 from '../../images/Vector2.svg'

const Landing = () => {
  return (
    <div className='landing_outer' >
    
        <div className='landing_left'>
            <h2 className='landing_heading'>Lucky Metaverse <br/> Gateway to your fortune</h2>
            <p className='landing_para'>
            Lucky Metaverse is a rebranding and restructuring of the old project Metaface Token (1000BNB HC presale filled) in seconds.<br/>
            Now the same team and this time with a professional partnership to restructure the project and here we go. $LMETA was born in Q1 2022.<br/>
            </p>
            <div className='boxes'>
        <div className='box'>
            <p className='box_heading'>
            TVL
            </p>
            <h2 className='box_content'>
            NA

            </h2>
        </div>
        <div className='box'>
            <p className='box_heading'>
            YIELD EARNED
            </p>
            <h2 className='box_content'>
            $NA

            </h2>
        </div>
        <div className='box'>
            <p className='box_heading'>
            TOTAL  REVENUE 
            </p>
            <h2 className='box_content'>
            $NA

            </h2>
        </div>
    </div>
        </div>
        <div className='landing_right'>
            <div className='calculator_container'>
            <Calculator />
            </div>
        </div>
        
    </div>
  
  )
}

export default Landing