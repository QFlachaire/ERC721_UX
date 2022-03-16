import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Web3 from "web3";
import Menu from '../components/Menu'

import { useRouter } from 'next/router';

export default function ChainInfo() {
  const router = useRouter()
    const [block, setBlock] = useState();
    const [data, setData] = useState({})
	//const {chainId, account, library} = useWeb3React();

    useEffect(() => {
        fetchData();
      }, [])

    async function fetchData() {
        if (typeof window.ethereum !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(window.ethereum);

            provider.getBlockNumber().then((res) => setBlock(res));
            
            let account = await window.ethereum.request({method: 'eth_requestAccounts'});
            //console.log(account.then(result))

            const {chainId} = await provider.getNetwork()

            const object = {"account": account[0], "chainId": chainId}
            setData(object);
        }
    }

    const switchNetwork = async () => {
		try {
			await window.ethereum.request({
			  method: "wallet_switchEthereumChain",
			  params: [{ chainId: "0x4" }]
			});
		  } catch (error) {
			alert(error.message);
		  }
	}

    if (data.chainId != 4){
    return (<>
            <button type="button" onClick={() => router.push('/fakeBayc')}>
        fakeBayc
        </button>
        <button type="button" onClick={() => router.push('/fakeBayc/1')}>
        /fakeBayc/1
        </button>
        <button type="button" onClick={() => router.push('/chain-info')}>
        chain-info
        </button>
		Wrong chain
            <p>Chain id: {data.chainId}</p>
            <p>Account: {data.account}</p>
            <p>Block number: #{block ? block : 'Loading...'}</p>
		<button onClick={() => {
			switchNetwork()
		}}>
			Switch to rinkeby
		</button>
		</>)}
    
    else {    
    return (
        <>
        <Menu/>
            <p>Chain id: {data.chainId}</p>
            <p>Account: {data.account}</p>
            <p>Block number: #{block ? block : 'Loading...'}</p>
        </>
    )}

	
}