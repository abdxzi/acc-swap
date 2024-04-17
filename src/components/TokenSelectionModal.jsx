import { Modal } from "antd";
import "../assets/css/TokenSelectionModal.css"

function TokenSelectionModal({ isModalOpen, setModalOpen, tokenInfoOne, setTokenInfoOne, tokenInfoTwo, setTokenInfoTwo, selectedToken, setInputTokenAmount, tokenList}) {

    function modifyToken(i) {
        if (tokenList[i] !== tokenInfoOne && tokenList[i] !== tokenInfoTwo) {

            setInputTokenAmount(null);

            if (selectedToken === 1) {
                setTokenInfoOne(tokenList[i]);
            } else {
                setTokenInfoTwo(tokenList[i]);
            }
            setModalOpen(false);
        }
    }

    return (
        <Modal
            open={isModalOpen}
            footer={null}
            onCancel={() => setModalOpen(false)}
            title="Select a token"
        >
            <div className="modalContent">
                {tokenList?.map((e, i) => {
                    return (
                        <div
                            className="tokenChoice"
                            key={i}
                            onClick={() => modifyToken(i)}
                        >
                            <img src={e.img} alt={e.ticker} className="tokenLogo" />
                            <div className="tokenChoiceNames">
                                <div className="tokenName">{e.name}</div>
                                <div className="tokenTicker">{e.ticker}</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </Modal>
    );
}

export default TokenSelectionModal;