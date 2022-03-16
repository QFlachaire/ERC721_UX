import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Contract, ContractInterface } from '@ethersproject/contracts';
import FakeNeft from '../../ABIs/FakeNeft.json';

import { BigNumber } from "@ethersproject/bignumber";
import { useRouter } from 'next/router';
import axios from 'redaxios';
import Menu from '../../components/Menu'

const FakeNeftAddress = "0x14e68d0ba29c07478bd68f4a479a0211bd48ca4e";
export default function App() {
    const router = useRouter()
    const [error, setError] = useState('');
    const [data, setData] = useState({})

    useEffect(() => {
        fetchData();
    }, [])

    async function fetchData() {
        if (typeof window.ethereum !== 'undefined') {

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new ethers.Contract(FakeNeftAddress, FakeNeft.abi, provider);
            try {
                const symbol = await contract.symbol();
                const totalSupply = await contract.totalSupply();
                const tokenPrice = await contract.tokenPrice()
                console.log(tokenPrice)
                const object = { "totalSupply": totalSupply.toString(), "symbol": symbol, "tokenPrice": tokenPrice.toString() }
                setData(object);
            }
            catch (err) {
                setError(err.message);
                console.log(err)
            }
        }
    }

    async function buy() {
        if (typeof window.ethereum !== 'undefined') {
            let accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(FakeNeftAddress, FakeNeft.abi, signer);

            const transaction = await contract.buyAToken({ value: BigNumber.from('100000000000000001') });
            await transaction.wait();

            fetchData();

        }
    }

    return (
        <div className="App">
            <div className="container">
                <div className="banniere">
                    <Menu />
                    <h1>buy a {data.symbol} NFT!</h1> 
                    <h1>for {data.tokenPrice} Wei</h1> 
                    <p className="count">Total Minted :{data.totalSupply}</p>
                    <button onClick={buy}>buy one Nefturians NFT</button>
                </div>
            </div>
        </div>
    );
}



