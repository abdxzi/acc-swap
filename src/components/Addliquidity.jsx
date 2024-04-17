import React, { useState } from "react";
import { Input, message } from "antd";
import { ArrowDownOutlined, DownOutlined, PlusOutlined } from "@ant-design/icons";
import { useReadContract, useAccount } from 'wagmi';

import { ROUTER_ABI } from "../utils/abis";
import { isInputANumber } from "../utils/inputSanitizer";
import tokenData from "./token/tokenData.json";
import { TokenAmountHelper } from "./token/tokenAmount/tokenAmountHelper";
import TokenSelectionModal from "./TokenSelectionModal";
import SlippagePopover from "./SlippagePopover";

import "../assets/css/Swap.css";
import "../assets/css/AddLiquidity.css";


function AddLiquidity() {

    const tokenList = tokenData["1"];

    const defaultSlippage = import.meta.env.VITE_DEFAULT_SLIPPAGE;
    
    const targetedTokenSelection_is_1 = 1;
    const targetedTokenSelection_is_2 = 2;

    const { isConnected } = useAccount();
    const [isOpen, setIsOpen] = useState(false);
    
    // const [slippage, setSlippage] = useState(defaultSlippage);

    const [tokenInfoOne, setTokenInfoOne] = useState(tokenList[0]);
    const [tokenInfoTwo, setTokenInfoTwo] = useState(tokenList[1]);

    const [tokenOneInputAmount, setTokenOneInputAmount] = useState(null);
    const [tokenTwoInputAmount, setTokenTwoInputAmount] = useState(null);

    const [targetedTokenSelection, setTargetedTokenSelection] = useState(targetedTokenSelection_is_1); // value 1 or 2

    const tokenAmountHelper = new TokenAmountHelper();

    // Functions

    function changetokenOneInputAmount(e) {
        if (isInputANumber(e.target.value)) {
            setTokenOneInputAmount(e.target.value);
        }
    }

    function changetokenTwoInputAmount(e) {
        if (isInputANumber(e.target.value)) {
            setTokenTwoInputAmount(e.target.value);
        }
    }

    function openModal(tokenSelection) {
        setTargetedTokenSelection(tokenSelection);
        setIsOpen(true);
    }

    return (
        <>

            <TokenSelectionModal isModalOpen={isOpen} setModalOpen={setIsOpen} tokenInfoOne={tokenInfoOne} tokenInfoTwo={tokenInfoTwo} setTokenInfoOne={setTokenInfoOne} setTokenInfoTwo={setTokenInfoTwo} selectedToken={targetedTokenSelection} setInputTokenAmount={setTokenOneInputAmount} />

            <div className="tradeBox">

                <div className="tradeBoxHeader">
                    <h4>Liquidity</h4>
                    {/* <SlippagePopover slippage={slippage} setSlippage={setSlippage} /> */}
                </div>

                <div className="inputs">

                    <Input placeholder="0" value={tokenOneInputAmount} onChange={changetokenOneInputAmount} />
                    <Input placeholder="0" value={tokenTwoInputAmount} onChange={changetokenTwoInputAmount} />

                    <div className="switchButton" >
                        <PlusOutlined className="switchArrow" />
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

                <div className="swapButton" disabled={(!tokenOneInputAmount || !tokenTwoInputAmount) || !isConnected}>Add Liquidity</div>
            </div>
        </>
    );
}

export default AddLiquidity;
