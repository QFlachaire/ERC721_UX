import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Contract, ContractInterface } from '@ethersproject/contracts';
import FakeBAYC from '../../ABIs/FakeBAYC.json';

import { BigNumber } from "@ethersproject/bignumber";
import { useRouter } from 'next/router';
import axios from 'redaxios';
import Menu from '../../components/Menu'

const FakeBAYCAddress = "0x6b740C7a965d75A4801642Fabc650DA92CeA47ef";
export default function App() {
    const router = useRouter()
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
        const symbol = await contract.symbol();
        const totalSupply = await contract.totalSupply();
        const object = {"totalSupply": totalSupply.toString(), "symbol": symbol}
        setData(object);
      }
      catch(err) {
        setError(err.message);
        console.log(err)
      }
    }
  }

  async function mint() {
    if(typeof window.ethereum !== 'undefined') {
      let accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(FakeBAYCAddress, FakeBAYC.abi, signer);

      const transaction = await contract.claimAToken();
      await transaction.wait();
      fetchData();

    }
  }

  return (
    <div className="App">
      <div className="container">
        <div className="banniere">
        <Menu/>
        <h1>Mint a {data.symbol} NFT !</h1>
        <p className="count">Total Minted :{data.totalSupply}</p>
        <button onClick={mint}>BUY one fakeBayc NFT</button>
        <button type="button" onClick={() => router.push('/fakeBayc/2')}>
        fakeBayc/2
        </button>
        </div>
      </div>
    </div>
  );
}



