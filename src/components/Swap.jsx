import React, { useEffect, useState } from "react";
import { Input, message } from "antd";
import { ArrowDownOutlined, DownOutlined } from "@ant-design/icons";
import { useReadContract, useAccount, useChainId  } from 'wagmi';

import { ROUTER_ABI } from "../utils/abis";
import { isInputANumber } from "../utils/inputSanitizer";
import { ContractCall } from "../utils/contractCall";

import tokenData from "../components/token/tokenData.json";
import { TokenAmountHelper } from "../components/token/tokenAmount/tokenAmountHelper";
import TokenSelectionModal from "../components/TokenSelectionModal";
import SlippagePopover from "../components/SlippagePopover";

import "../assets/css/Swap.css";
import TokenBalance from "./TokenBalance";


function Swap() {

    const chainId = useChainId();
    const routerAddress = tokenData[chainId]?.router;
    const tokenList = tokenData[chainId]?.tokens;

    const defaultSlippage = parseFloat(import.meta.env.VITE_DEFAULT_SLIPPAGE);
    
    const targetedTokenSelection_is_1 = 1;
    const targetedTokenSelection_is_2 = 2;

    const { isConnected, address } = useAccount();
    const [isOpen, setIsOpen] = useState(false);
    const [slippage, setSlippage] = useState(defaultSlippage);
    const [tokenInfoOne, setTokenInfoOne] = useState(tokenList[0]);
    const [tokenInfoTwo, setTokenInfoTwo] = useState(tokenList[1]);
    const [inputTokenAmount, setInputTokenAmount] = useState(null);

    const [targetedTokenSelection, setTargetedTokenSelection] = useState(targetedTokenSelection_is_1); // value 1 or 2

    // const tokenAmountHelper = new TokenAmountHelper();

    useEffect(()=>{
        setTokenInfoOne(tokenList[0]);
        setTokenInfoTwo(tokenList[1]);

    }, [chainId])
    
    const contractCall = new ContractCall(); 

    // fetches amount out    
    let amountIn = TokenAmountHelper.tokenToUnits(inputTokenAmount, tokenInfoOne.decimals);
    const { data: amountsOut, error, isPending: isAmountOutsPending } = useReadContract({
        address: routerAddress,
        abi: ROUTER_ABI,
        functionName: 'getAmountsOut',
        args: [amountIn, [tokenInfoOne.address, tokenInfoTwo.address]],
    }, []);

    let amountOut = "";
    if(amountsOut){
        amountOut = TokenAmountHelper.unitsToTokens(amountsOut[1], tokenInfoTwo.decimals);
    }


    function changeAmount(e) {
        if (isInputANumber(e.target.value)) {
            setInputTokenAmount(e.target.value);
        }
    }

    function switchTokens() {
        setInputTokenAmount(null);

        // Switch
        const one = tokenInfoOne;
        const two = tokenInfoTwo;
        setTokenInfoOne(two);
        setTokenInfoTwo(one);
    }

    function openModal(tokenSelection) {
        setTargetedTokenSelection(tokenSelection);
        setIsOpen(true);
    }

    function handleSwap(){ 
        contractCall.swapForExactTokens(amountIn, amountOut, tokenInfoOne, tokenInfoTwo, address, slippage, routerAddress);
    }

    // async function handleEstimate(){
    //     const gasEstimate = contractCall.estimateSwapGas(amountIn, 0, tokenInfoOne, tokenInfoTwo, address);
    //     console.log("GasEstimate", await gasEstimate);
    //     contractCall.estimateFeesPerGas();
    //     contractCall.estimateMaxPriorityFeesPerGas();
    // }

    return (
        <>

            <TokenSelectionModal isModalOpen={isOpen} setModalOpen={setIsOpen} tokenInfoOne={tokenInfoOne} tokenInfoTwo={tokenInfoTwo} setTokenInfoOne={setTokenInfoOne} setTokenInfoTwo={setTokenInfoTwo} selectedToken={targetedTokenSelection} setInputTokenAmount={setInputTokenAmount} tokenList={tokenList} />

            <div className="tradeBox">
                <div className="tradeBoxHeader">
                    <h4>Swap</h4>
                    {/* <button onClick={handleEstimate}>Estimate</button> */}
                    <SlippagePopover slippage={slippage} setSlippage={setSlippage} />
                </div>

                <div className="inputs">
                    <div className="inputOneContainer">
                        <Input placeholder="0" value={inputTokenAmount} onChange={changeAmount} />
                        {isConnected && <TokenBalance currentToken={tokenInfoOne} address={address} />}
                    </div>
                    <Input placeholder="0" value={isAmountOutsPending && inputTokenAmount ? "..." : amountOut} disabled={true} />

                    <div className="switchButton" onClick={switchTokens} >
                        <ArrowDownOutlined className="switchArrow" />
                    </div>

                    <div className="assetOne" onClick={() => openModal(targetedTokenSelection_is_1)}>
                        <img src={tokenInfoOne.img} alt="assetOneLogo" className="assetLogo" />
                        {tokenInfoOne.ticker}
                        <DownOutlined />
                    </div>

                    <div className="assetTwo" onClick={() => openModal(targetedTokenSelection_is_2)} >
                        <img src={tokenInfoTwo.img} alt="assetOneLogo" className="assetLogo" />
                        {tokenInfoTwo.ticker}
                        <DownOutlined />
                    </div>
                </div>

                <button className="swapButton" disabled={!inputTokenAmount || !isConnected} onClick={handleSwap}>Swap</button>
                
            </div>
        </>
    );
}

export default Swap;
