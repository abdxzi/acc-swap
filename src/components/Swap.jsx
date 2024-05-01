import "@css/Swap.css"
import React, { useEffect, useState } from "react";
import { useWeb3ModalAccount, useWeb3ModalProvider } from "@web3modal/ethers5/react";
import { ethers } from "ethers";
import { TokenSelectionModal } from "@components/index";
import { fetchChainData, fetchTokenList } from "../utils/utils";
import SwapForm from "./sub/SwapForm";

function Swap() {
    const { chainId, isConnected } = useWeb3ModalAccount()

    const { walletProvider } = useWeb3ModalProvider()
    const etherProvider = isConnected ? new ethers.providers.Web3Provider(walletProvider) : undefined;

    const [tokenList, setTokenList] = useState([]);
    const [tokenInfoOne, setTokenInfoOne] = useState({});
    const [tokenInfoTwo, setTokenInfoTwo] = useState({});
    const [currentNetwork, setCurrentNetwork] = useState({});

    const [balance, setBalance] = useState(0.00);
    const [isOpen, setIsOpen] = useState(false);
    const [slippage, setSlippage] = useState(5);
    const [inputTokenAmount, setInputTokenAmount] = useState(null);
    const [targetedTokenSelection, setTargetedTokenSelection] = useState(1);
    
    // If network changed, fetch tokenList and Network data
    useEffect(()=>{
        setTokenList([]);
        fetchTokenList(chainId ? chainId : 1).then((t) => {
            setTokenList(t);
            setTokenInfoOne(t[0])
            setTokenInfoTwo(t[1])
        })
        if(chainId) {
            fetchChainData(chainId).then((n)=> {
                setCurrentNetwork(n);
            })
        }
    }, [chainId]);

    const swapState = {
        provider: etherProvider,

        isOpen: isOpen,
        setIsOpen: setIsOpen,

        slippage: slippage,
        setSlippage: setSlippage, 

        tokenInfoOne: tokenInfoOne,
        setTokenInfoOne: setTokenInfoOne,

        tokenInfoTwo: tokenInfoTwo, 
        setTokenInfoTwo: setTokenInfoTwo,

        inputTokenAmount: inputTokenAmount,
        setInputTokenAmount: setInputTokenAmount,

        targetedTokenSelection: targetedTokenSelection,
        setTargetedTokenSelection: setTargetedTokenSelection,

        balance: balance,
        setBalance: setBalance,

        currentNetwork: currentNetwork,
        setCurrentNetwork: setCurrentNetwork,

        tokenList: tokenList,
        setTokenList: setTokenList
    }
    
    return (
        <div className="swap-wrapper">
            <TokenSelectionModal swapState={swapState} tokenList={tokenList}/>
            <SwapForm swapState={swapState} />
            {/* <button onClick={()=>{setIsOpen(!isOpen)}}>Test</button> */}
        </div>
    )
}

export default Swap;