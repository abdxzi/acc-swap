import { Modal } from "antd";
import "@css/TokenSelectionModal.css"


function TokenSelectionModal({ swapState, tokenList}) {

    // console.log("List: ", tokenList);

    function modifyToken(i) {
        if (tokenList[i] !== swapState.tokenInfoOne && tokenList[i] !== swapState.tokenInfoTwo) {

            swapState.setInputTokenAmount(null);

            if (swapState.targetedTokenSelection === 1) {
                swapState.setTokenInfoOne(tokenList[i]);
            } else {
                swapState.setTokenInfoTwo(tokenList[i]);
            }
            swapState.setIsOpen(false);
        }
    }

    return (
        <Modal
            open={swapState.isOpen}
            footer={null}
            onCancel={() => swapState.setIsOpen(false)}
            title="Select a token"
            className="tokenModal"
        >
            <div className="modalContent">
                {tokenList?.map((e, i) => {
                    return (
                        <div
                            className="tokenChoice"
                            key={i}
                            onClick={() => modifyToken(i)}
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
        </Modal>
    );
}

export default TokenSelectionModal;