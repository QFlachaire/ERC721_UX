import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Contract, ContractInterface } from '@ethersproject/contracts';
import FakeNeft from '../../ABIs/FakeNeft.json';
import { BigNumber } from "@ethersproject/bignumber";
import { useRouter } from 'next/router';
import axios from 'redaxios';
import Menu from '../../components/Menu'


const FakeNeftAddress = "0x14e68d0ba29c07478bd68f4a479a0211bd48ca4e";

export default function fakeBaycToken() {
    const router = useRouter()
    const { query } = useRouter()
    const accountQ = query.account
    console.log(accountQ)
    const [asset, setAsset] = useState()
    let [yourAcc, setYourAcc] = useState()

    useEffect(() => {
        if (accountQ){ setYourAcc(accountQ + " Nfts are: ");fetchData() };
    }, [accountQ])


    async function fetchData() {
        if (typeof window.ethereum !== 'undefined') {

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new Contract(FakeNeftAddress, FakeNeft.abi, provider);

            let account = await window.ethereum.request({ method: 'eth_requestAccounts' });
            console.log(account[0])
            console.log(accountQ)

            if (account[0] == accountQ.toLowerCase()){
                setYourAcc("Your Account Nfts are: ")
            }
            let nbToken = await contract.balanceOf(account[0])
            let nfts = []

            for (let i = 0; i < nbToken; i++) {
                let temp = await contract.tokenOfOwnerByIndex(account[0], i)
                let uri = await contract.tokenURI((temp))
                console.log(uri)
                let { data } = await axios.get(uri);
                let image = data.image.replace('ipfs://', '');
                nfts.push({"image": image,
                "name": data.name})
            }
            console.log(nfts)
            setAsset(nfts);

        }

    }

    if (!asset) return <><Menu />Pls Wait</>
    return (
        <>
            <Menu />
            <span>{yourAcc}</span>
            <img src={asset.image}></img>
            <div>
                {
                    asset.map((attribut, i) => {
                        return (<p key={i}>
                            <img src={attribut.image}></img>
                            <span> Id {attribut.name}</span>
                        </p>)
                    })
                }
            </div>

        </>
    )
}