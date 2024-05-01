import { useState, useEffect } from "react";
import { Input, message } from "antd";
import { ArrowDownOutlined, DownOutlined } from "@ant-design/icons";
import { useWeb3ModalAccount, useWeb3Modal } from "@web3modal/ethers5/react";

import toast from 'react-hot-toast';

// internal imports
import { GasFeeData, QuoteLoader, SlippagePopover, SwapLoader, TokenBalance } from "@components/index";
import { isInputANumber } from "@utils/utils";
import "@css/SwapForm.css"
import { approveTransaction, executeTrade, fetchTrade } from "../../utils/utils";
import { ERC20Fetch } from "../../utils/ERC20Fetch";


function SwapForm({ swapState }) {

    const { address, isConnected, chainId } = useWeb3ModalAccount()
    const { open } = useWeb3Modal()

    const [route, setRoute] = useState(null);
    const [swapStarted, setSwapStarted] = useState(false);
    const [amountout, setAmountOut] = useState(null);
    const [swapBtnContent, setSwapBtnContent] = useState('Swap');
    const [updateBalance, setUpdateBalance] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    function changeAmount(e) {
        setAmountOut(null);
        setIsLoading(false);
        if (isInputANumber(e.target.value)) {
            swapState.setInputTokenAmount(e.target.value);
        }
    }

    function switchTokens() {
        setAmountOut(null);
        swapState.setInputTokenAmount(null);

        // Switch
        const one = swapState.tokenInfoOne;
        const two = swapState.tokenInfoTwo;
        swapState.setTokenInfoOne(two);
        swapState.setTokenInfoTwo(one);
    }

    function updateTokenBalance() {
        console.log("Updating token balance..")
        setUpdateBalance(!updateBalance);
    }

    function openModal(tokenSelection) {
        swapState.setTargetedTokenSelection(tokenSelection);
        swapState.setIsOpen(true);
    }
    
    // When slippage orchainID change reset form
    useEffect(()=>{
        setRoute(null);
        setAmountOut(null);
        swapState.setInputTokenAmount(null);
        !isConnected ? setSwapBtnContent("Connect to Etheruem") : setSwapBtnContent("Swap")
    }, [swapState.slippage, chainId])

    // When input changed Call Uniswap AlphaRouter
    useEffect(() => {
        if(swapState.inputTokenAmount){
            setIsLoading(true);
            const trade = fetchTrade(
                chainId,
                swapState.tokenInfoOne.address, 
                swapState.tokenInfoTwo.address,
                swapState.slippage,
                address,
                swapState.inputTokenAmount
            ).then(trade => {
                if(trade.input.amount == swapState.inputTokenAmount){
                    console.log(trade)
                    setIsLoading(false)
                    setAmountOut(trade.output.amount)
                    setRoute(trade);
                }
            })
        }
    }, [swapState.inputTokenAmount]);

    const handleSwap = async ()=> {
        setSwapStarted(true);
        setSwapBtnContent("Processing ...");

        //  connect if not connected
        if(!chainId){
            open({ view: 'Connect' });
            return;
        }

        // routing process ongoing...
        if(!route){
            toast("Wait till routing complete.", {icon: "💬"})
            setSwapStarted(false);
            setSwapBtnContent("Swap");
            return;
        }

        try {
            const signer = await swapState.provider.getSigner();
            toast("Approving transaction.", {icon: "🕖"})
            const approval = await approveTransaction(swapState.provider, route);
            if(!approval) throw Error("Approval Failed !");

            toast("Executing Swap", {icon: "🕖"});
            const response = await executeTrade(swapState.provider, route);

            if(response){
                toast.success("Swap success");
                updateTokenBalance();
            } else {
                throw Error("Swap Failed.")
            }
        } catch(e) {
            setSwapBtnContent("Swap");
            toast.error("Something went wrong !")
            console.log(e)
        } finally {
            setSwapBtnContent("Swap")
            updateTokenBalance();
            setRoute(null);
            setSwapStarted(false)
            swapState.setInputTokenAmount(null);
            setAmountOut(null)
        }

    }

    return (
        <div className="swapForm">
            <div className="swapFormHeader">
                <h4>Swap</h4>
                <SlippagePopover slippage={swapState.slippage} setSlippage={swapState.setSlippage} />
            </div>

            <div className="swapFormInputs">

                <div className="inputOneContainer">
                    <Input placeholder="0" value={swapState.inputTokenAmount} onChange={changeAmount} disabled={swapStarted || !isConnected} />
                    {isConnected && address && <TokenBalance swapState={swapState} address={address} update={updateBalance} />}
                </div>

                <div className="inputTwoContainer">
                    <Input placeholder={isLoading && swapState.inputTokenAmount ? "" : "0"} value={swapState.inputTokenAmount ? (amountout ? amountout : null) : null} disabled={true} />
                    {isLoading && swapState.inputTokenAmount && <QuoteLoader />}
                </div>

                <div className="switchButton" onClick={!swapStarted ? switchTokens : null} >
                    <ArrowDownOutlined className="switchArrow" />
                </div>

                <div className="assetOne" onClick={() => openModal(1)}>
                    <img src={swapState.tokenInfoOne.logoURI} alt="assetOneLogo" className="assetLogo" />
                    {swapState.tokenInfoOne.symbol}
                    <DownOutlined />
                </div>

                <div className="assetTwo" onClick={() => openModal(2)} >
                    <img src={swapState.tokenInfoTwo.logoURI} alt="assetOneLogo" className="assetLogo" />
                    {swapState.tokenInfoTwo.symbol}
                    <DownOutlined />
                </div>
            </div>

            <div className="swapBtnContainer">
                <button className="swapButton" disabled={(!swapState.inputTokenAmount || swapStarted) && isConnected} onClick={handleSwap}>
                    {swapStarted && <SwapLoader />}
                    {swapBtnContent}
                </button>
            </div>

            {route && <GasFeeData route={route} slippage={swapState.slippage}/>}
        </div>
    );
}

export default SwapForm;