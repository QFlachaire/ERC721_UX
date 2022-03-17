import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Contract, ContractInterface } from '@ethersproject/contracts';
import FakeMeebits from '../ABIs/FakeMeebits.json';
import FakeMeebitsClaimer from '../ABIs/FakeMeebitsClaimer.json';

import signatures from '../output-sig.json';

import { BigNumber } from "@ethersproject/bignumber";
import { useRouter } from 'next/router';
import axios from 'redaxios';
import Menu from '../components/Menu'

const FakeMeebitsAddress = "0x66e0f56e86906fd7ee186d29a1a25dc12019c7f3";
const FakeMeebitsClaimerAddress = "0x656ec82544a3464f07bb86bea3447a4fdf489c1b";


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
        if (text) { changeButton(text) };
    }, [text])

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

    async function changeButton(tokenId) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(FakeMeebitsAddress, FakeMeebits.abi, provider);

        try {
            if (Number.isInteger(+tokenId) && +tokenId > 0) {
                setButton(<button onClick={mint}>{"It's mintable !"}</button>)
                const totalSupply = await contract.totalSupply();
                for (let i = 0; i < totalSupply; i++) {
                    let tokenIdMinted = await contract.tokenByIndex(i)
                    if (tokenIdMinted.toString() == tokenId) {
                        setButton(<button>{"You cant mint it !"}</button>)
                    }
                }
            } else { setButton(<button>{"You cant mint it !"}</button>) }
        }
        catch (err) {
            setError(err.message);
            console.log(err)
            setButton(<button>{"You cant mint it !"}</button>)
        }
    }

    async function mint() {
        if (typeof window.ethereum !== 'undefined') {
            let accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(FakeMeebitsClaimerAddress, FakeMeebitsClaimer.abi, signer);
            var elem;
            signatures.map(element => {    

                if(element.tokenNumber == text){
                    console.log(element.tokenNumber)
                    console.log(text)       
                    console.log(element.signature) 
                    elem = element
                    
                }})


            console.log(elem.tokenNumber, elem.signature)
            const transaction = await contract.claimAToken(elem.tokenNumber, elem.signature);
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
                    <p>
                        Enter a Id to mint:
                    </p>
                    {button}
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />

                </div>
            </div>
        </div>
    )
}



