import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Navbar from './components/navbar/Navbar';
import Calculator from './components/calculator/Calculator';
import Landing from './components/landing/Landing';
import Dashboard from './components/dashboard/Dashboard';
import Stake from './components/stack/Stake';
import Earn from './components/earn/Earn';
import wrapper1 from './images/Vector1.svg';
import wrapper2 from './images/Vector2.svg';
import {useState, createContext } from 'react';
import Migrate from './components/migrate/Migrate';

let provider = createContext();
let setProvider = createContext();
let signer = createContext();
let setSigner = createContext();
let walletAddress = createContext();
let setWalletAddress = createContext();

function App() {
  let [_provider, _setProvider] = useState("Hi provider");
  let [_signer, _setSigner] = useState("Hellow signer");
  let [_walletAddress, _setWalletAddress] = useState("");
  return (
    
    <provider.Provider value ={_provider}>
    <setProvider.Provider value ={_setProvider}>
    <signer.Provider value ={_signer}>
    <setSigner.Provider value ={_setSigner}>
    <Router>
           <div className='wrapper1'>
        <img src={wrapper1} alt='wrapper' />
        </div>
        <div className='wrapper2'>
        <img src={wrapper2} alt='wrapper' />
        </div>
      <Routes>
        <Route exact path='/' element={<><Navbar/> <Landing /></>}/>
        <Route exact path='/dashboard' element={<><Navbar/> <Dashboard /></>}/>
        <Route exact path='/stake' element={<><Navbar/> <Stake /></>}/>
        <Route exact path='/earn' element={<><Navbar/> <Earn/></>}/>
        <Route exact path='/migrate' element={<><Navbar/> <Migrate/></>}/>
      </Routes>
    </Router>
    </setSigner.Provider>
    </signer.Provider>
    </setProvider.Provider>
    </provider.Provider>
  );
}

export default App;
export {provider, setProvider, signer, setSigner, walletAddress, setWalletAddress};