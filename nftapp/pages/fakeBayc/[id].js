import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Contract, ContractInterface } from '@ethersproject/contracts';
import FakeBAYC from '../../ABIs/FakeBAYC.json';
import { BigNumber } from "@ethersproject/bignumber";
import { useRouter } from 'next/router';
import axios from 'redaxios';
import Menu from '../../components/Menu'

const FakeBAYCAddress = "0x6b740C7a965d75A4801642Fabc650DA92CeA47ef";
const ifpsGateway = 'https://ipfs.io/ipfs';

export default function fakeBaycToken() {
    const router = useRouter()
    const { query } = useRouter()
    const token = query.id

    const [error, setError] = useState('');
    const [asset, setAsset] = useState()
    const [notFound, setNotFound] = useState(false)


    useEffect(() => {
        if (token) { fetchData() };
    }, [token])

    async function fetchData() {

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new Contract(FakeBAYCAddress, FakeBAYC.abi, provider);
        try {

            const totalSupply = await contract.totalSupply()
            if (token > totalSupply) {
                setNotFound(true)
                return
            }

            const uri = await contract.tokenURI((token));

            const { data } = await axios.get(uri);

            const imgCID = data.image.replace('ipfs://', '');
            const image = `${ifpsGateway}/${imgCID}`;
            console.log(data)
            setAsset({
                "image": image,
                "attributes": data.attributes
            });

        }
        catch (err) {
            setError(err.message);
            console.log(err)
        }
    }

    if (notFound) return <><Menu/>Not Found</>
    if (!asset) return <><Menu/>Pls Wait</>
    return (
        <>
        <Menu/>
            <img src={asset.image}></img>
            <div>
                {
                    asset.attributes.map((attribut, i) => {
                        return (<p key={i}>
                            <span>Key Name: {attribut.trait_type}</span>
                            <span>, Value: {attribut.value}</span>
                        </p>)
                    })
                }
            </div>

        </>
    )
}