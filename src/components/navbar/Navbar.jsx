import React, {useState, useEffect, useContext} from 'react';
import logo from '../../images/logo.png';
import Button from './Button';
import { MenuIcon } from '@heroicons/react/solid'
import { Link } from 'react-router-dom';
import {provider, setProvider, signer, setSigner} from '../../App';


import './navbar.scss';

 
 const Navbar = () => {
   const [navactive, setNavactive] = useState()
  const [navbarOpen, setNavbarOpen] = useState(true)
  let _provider = useContext (provider);
  let _setProvider = useContext (setProvider);
  let _signer = useContext (signer);
  let _setSigner = useContext (setSigner);

   return (
     <div className='navbar_outer'>
         <div className='navbar_left'>
           <MenuIcon className='menu_icon' onClick={()=>{
            setNavbarOpen(!navbarOpen)
           }}/>
          <img src={logo} className="logo" alt="" />
         </div>
         <div className='navbar_right '>
             <ul className={`ul_nav ${navbarOpen ? " showMenu" : ""} `}>
             <div className='navbar_left slider_logo'>
           <MenuIcon className='menu_icon' onClick={()=>{
            setNavbarOpen(!navbarOpen)
           }}/>
          <img src={logo} className="logo" alt="" />
         </div>
              <Link to="/"><li className={navactive == 'first' ? 'navigations_active' : ''} onClick={()=>{
                setNavbarOpen(true);
                setNavactive('first')                
                }}>HOME</li></Link>
              <Link to="/dashboard" ><li className={navactive == 'second' ? 'navigations_active' : ''} onClick={()=>{
                setNavbarOpen(true)
                setNavactive('second')                
              }} >DASHBOARD</li></Link>
              <Link to="/migrate" ><li className={navactive == 'five' ? 'navigations_active' : ''} onClick={()=>{
                setNavbarOpen(true)
                setNavactive('five')

              }}>MIGRATE</li></Link>
              <Link to="/stake" ><li className={navactive == 'third' ? 'navigations_active' : ''} onClick={()=>{
                setNavbarOpen(true)
                setNavactive('third')
              }}>STAKE</li></Link>
              <Link to="/earn" ><li className={navactive == 'four' ? 'navigations_active' : ''} onClick={()=>{
                setNavbarOpen(true)
                setNavactive('four')
                }}>EARN</li></Link>
              
              <li className='navigations active' onClick={()=>setNavbarOpen(true)}>DOCS</li>
             </ul>
             <button className='button button_secondary'>
               GAME
             </button>
             <Button />

         </div>
     </div>
   )
 }
 
 export default Navbar