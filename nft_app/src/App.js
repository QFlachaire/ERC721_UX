import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import FakeBAYC from './ABI/FaekBAYC.json';
import './App.css';

const FakeBAYCAddress = "0x6b740C7a965d75A4801642Fabc650DA92CeA47ef";
function App() {

  const [error, setError] = useState('');
  const [data, setData] = useState({})

  useEffect(() => {
    fetchData();
  }, [])

  async function fetchData() {
    if(typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(FakeBAYCAddress, FakeBAYC.abi, provider);
      try {
        const cost = await contract.cost();
        const totalSupply = await contract.totalSupply();
        const object = {"cost": String(cost), "totalSupply": String(totalSupply)}
        setData(object);
      }
      catch(err) {
        setError(err.message);
      }
    }
  }

  async function mint() {
    if(typeof window.ethereum !== 'undefined') {
      let accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(FakeBAYCAddress, FakeBAYC.abi, signer);
      try {
        let overrides = {
          from: accounts[0],
          value: data.cost
        }
        const transaction = await contract.claimAToken();
        await transaction.wait();
        fetchData();
      }
      catch(err) {
        setError(err.message);
      }
    }
  }

  return (
    <div className="App">
      <div className="container">
        <div className="banniere">
        <h1>Mint a fakeBayc NFT !</h1>
        <p className="count">{data.totalSupply} / 50</p>
        <p className="cost">Each fakeBayc NFT costs {data.cost / 10**18} eth (excluding gas fees)</p>
        <button onClick={mint}>BUY one fakeBayc NFT</button>
        </div>
      </div>
    </div>
  );
}

export default App;
