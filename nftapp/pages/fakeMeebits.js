import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Contract, ContractInterface } from '@ethersproject/contracts';
import FakeMeebits from '../ABIs/FakeMeebits.json';

import { BigNumber } from "@ethersproject/bignumber";
import { useRouter } from 'next/router';
import axios from 'redaxios';
import Menu from '../components/Menu'

const FakeMeebitsAddress = "0x66e0f56e86906fd7ee186d29a1a25dc12019c7f3";
export default function App() {
    const router = useRouter()
    const [error, setError] = useState('');
    const [data, setData] = useState({})
    const [text, setText] = useState('');
    const [mintable, setMintable] = useState(true);
    const [button, setButton] = useState("");



    useEffect(() => {
        fetchData();
    }, [])

    useEffect(() => {
        if (text) { isMintable(text) };
    }, [text])

    useEffect(() => {
        if (mintable) { Button(mintable) };
    }, [mintable])

    async function fetchData() {
        if (typeof window.ethereum !== 'undefined') {

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new ethers.Contract(FakeMeebitsAddress, FakeMeebits.abi, provider);
            try {
                const symbol = await contract.symbol();
                const totalSupply = await contract.totalSupply();
                const object = { "totalSupply": totalSupply.toString(), "symbol": symbol }
                setData(object);
            }
            catch (err) {
                setError(err.message);
                console.log(err)
            }
        }
    }

    async function Button(mintable) {
        console.log(mintable)
        if (mintable) {
            setButton(<button onClick={mint}>{"It's mintable !"}</button>)
        }
        else {
            setButton(<button>{"You cant mint it !"}</button>)
        }
    }

    async function isMintable(tokenId) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(FakeMeebitsAddress, FakeMeebits.abi, provider);

        try {
            if (Number.isInteger(+tokenId) && +tokenId > 0) {
                setMintable(true)
                const totalSupply = await contract.totalSupply();
                for (let i = 0; i < totalSupply; i++) {
                    let tokenIdMinted = await contract.tokenByIndex(i)
                    if (tokenIdMinted.toString() == tokenId) {
                        setMintable(false)
                    }
                }
            } else { setMintable(false) }
        }
        catch (err) {
            setError(err.message);
            console.log(err)
            setMintable(false)
        }
    }

    async function mint() {
        if (typeof window.ethereum !== 'undefined') {
            let accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(FakeMeebitsAddress, FakeMeebits.abi, signer);

            const transaction = await contract.mintAToken();
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
                    <p className="count">Total Minted :{data.totalSupply}</p>
                    {button}
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                    <h1>
                        {mintable.toString()}
                    </h1>
                </div>
            </div>
        </div>
    )
}



