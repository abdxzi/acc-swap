import { Modal } from "antd";
import { useWeb3ModalAccount } from "@web3modal/ethers5/react";
import { useEffect, useState } from "react";
import { CoinBadgeList, TokenSearchInput } from "@components/index";
import { getTokenFromSearch } from "@utils/utils";
import "@css/TokenSelectionModal.css"

function TokenSelectionModal({ swapState, tokenList }) {

    const [coinList, setCoinList] = useState(tokenList);
    const [isSearching, setIsSearching] = useState(false);
    const [searchInput, setSearchInput] = useState("");

    const switchTokens = () => {
        const token1 = swapState.tokenInfoOne;
        const token2 = swapState.tokenInfoTwo;
        swapState.setTokenInfoOne(token2)
        swapState.setTokenInfoTwo(token1)
    }

    const modifyToken = (token) => {
        swapState.setInputTokenAmount(null);
        if (swapState.targetedTokenSelection === 1) {
            swapState.tokenInfoTwo == token ? switchTokens() : swapState.setTokenInfoOne(token);
        } else {
            swapState.tokenInfoOne == token ? switchTokens() : swapState.setTokenInfoTwo(token);
        }
        swapState.setIsOpen(false);
    }

    const handleSearch = (input) => {
        if(input) {     
            setSearchInput(input);
            setIsSearching(true);
            setCoinList(getTokenFromSearch(tokenList, input));
        } else {
            setSearchInput("")
            setIsSearching(false);
            setCoinList(tokenList);
        }
    }

    const onModalClose = () => {
        swapState.setIsOpen(false);
        setCoinList(tokenList);
        setSearchInput("")
        setIsSearching(false)
    }

    // When network changed reset token list
    useEffect(()=>{
        setCoinList(tokenList);
    }, [tokenList])

    return (
        <Modal
            open={swapState.isOpen}
            footer={null}
            onCancel={() => onModalClose()}
            title="Select a token"
            className="tokenModal"
        >
            <div className="modalContent">
                <TokenSearchInput input={searchInput} onSearchInput={handleSearch} />
                <CoinBadgeList tokenList={[...tokenList.slice(0, 6)]} onBadgeClick={modifyToken} />
                <div className="coinListSeperator"></div>
                <div className="popularCoins">
                    <div className="popularTokenHeader">{isSearching ? "Results" : "Popular Tokens"}</div>
                    {coinList?.map((e, i) => {
                        return (
                            <div
                                className="tokenChoice"
                                key={i}
                                onClick={() => modifyToken(e)}
                            >
                                <img src={e.logoURI} alt={e.symbol} className="tokenLogo" />
                                <div className="tokenChoiceNames">
                                    <div className="tokenName">{e.name}</div>
                                    <div className="tokenSymbol">{e.symbol}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </Modal>
    );
}

export default TokenSelectionModal;