import { useState, useEffect } from "react";
import { Input, message } from "antd";
import { ArrowDownOutlined, DownOutlined } from "@ant-design/icons";
import { useWeb3ModalAccount } from "@web3modal/ethers5/react";

// internal imports
import { SlippagePopover, TokenBalance } from "@components/index";
import { isInputANumber } from "@utils/utils";
import { getQuote, approveTransaction, executeSwap } from "@utils/alphaRouter";
import "@css/SwapForm.css"


function SwapForm({ swapState }) {

    const { address, isConnected } = useWeb3ModalAccount()
    const [messageApi, contextHolder] = message.useMessage();

    const [route, setRoute] = useState(null);
    const [swapStarted, setSwapStarted] = useState(false);
    const [amountout, setAmountOut] = useState(null);
    const [swapBtnContent, setSwapBtnContent] = useState('Swap');
    const [updateBalance, setUpdateBalance] = useState(false);

    const msgApiKey = "Updatable";


    function changeAmount(e) {
        setAmountOut(null);
        
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

    function updateTokenBalance(){
        console.log("Updating token balance..")
        setUpdateBalance(!updateBalance);
    }

    function openModal(tokenSelection) {
        swapState.setTargetedTokenSelection(tokenSelection);
        swapState.setIsOpen(true);
    }

    async function handleSwap() {
        setSwapStarted(true)
        if(!route){
            message.info("Wait till the route complete")
            setSwapStarted(false)
            return null;
        }
        try {
            messageApi.open({
                msgApiKey,
                type: 'loading',
                content: 'Approving Transaction.',
                // duration: 0,
            });
            const approval = await approveTransaction(swapState.provider, route);
            if(!approval){
                throw Error("Approval Failed !")
            }
            
            message.destroy(msgApiKey);
            messageApi.open({
                msgApiKey,
                type: 'loading',
                content: 'Executing Swap.',
                // duration: 0
            });

            const rec = await executeSwap(swapState.provider, route);

            if(rec){
                messageApi.open({
                    msgApiKey,
                    type: 'success',
                    content: 'Swap success.',
                });

                updateTokenBalance();
            } else {
                throw Error("Swap Failed.")
            }
        } catch (e) {

            console.log(e);
            messageApi.open({
                msgApiKey,
                type: 'error',
                content: 'Something went wrong.',
            });
        } finally {
            console.log("Finally")
            updateTokenBalance();
            setRoute(null);
            setSwapStarted(false)
            swapState.setInputTokenAmount(null);
            setAmountOut(null)
            // upadate balances 
        }
    }

    async function getRoute() {
        setRoute(null);
        if (swapState.inputTokenAmount) {
            const _route = await getQuote(
                swapState.provider,
                swapState.tokenInfoOne,
                swapState.tokenInfoTwo,
                swapState.inputTokenAmount
            );

            setRoute(_route);
            setAmountOut(_route.quote.toSignificant(6));
        }
    }

    // When input changed Call Uniswap AlphaRouter
    useEffect(() => {
        getRoute();
    }, [swapState.inputTokenAmount])

    // const inputTwoUI = 

    return (
        <div className="swapForm">
            {contextHolder}
            <div className="swapFormHeader">
                <h4>Swap</h4>
                <SlippagePopover slippage={swapState.slippage} setSlippage={swapState.setSlippage} />
            </div>

            <div className="swapFormInputs">

                <div className="inputOneContainer">
                    <Input placeholder="0" value={swapState.inputTokenAmount} onChange={changeAmount} disabled={swapStarted} />
                    {isConnected && address && <TokenBalance swapState={swapState} address={address} update={updateBalance} />}
                </div>

                <Input placeholder="0" value={swapState.inputTokenAmount ? (amountout ? amountout : "...") : null} disabled={true} />

                <div className="switchButton" onClick={switchTokens} >
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

            <button className="swapButton" disabled={!swapState.inputTokenAmount || swapStarted} onClick={handleSwap}>{swapBtnContent}</button>

        </div>
    );
}

export default SwapForm;