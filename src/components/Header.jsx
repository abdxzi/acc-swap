import { useEffect, useState } from "react";
import { useWalletInfo, useWeb3Modal, useWeb3ModalAccount, useWeb3ModalProvider } from "@web3modal/ethers5/react";

import { networkData } from "@assets/data";
import { getCurrentNetworkData, getNetworkBalance, shortenAddress } from "@utils/utils";
import AccumulateLogo from "@assets/images/accumulate_logo.jpeg";
import "@css/Header.css"

function Header() {

    const [networkBalance, setNetworkBalance] = useState(0);

    const { walletInfo } = useWalletInfo()
    const { address, chainId, isConnected } = useWeb3ModalAccount()
    const { walletProvider } = useWeb3ModalProvider()
    const { open, close } = useWeb3Modal()


    // FUNCTIONS
    const onClickWallet = () => {
        isConnected ? open({ view: 'Account' }) : open({ view: 'Connect' });
    }

    const onClickNetwork = () => {
        isConnected ? open({ view: 'Networks' }) : null;
    }

    const currentNetwork = getCurrentNetworkData(networkData, chainId);

    useEffect(()=>{

        getNetworkBalance(walletProvider).then(
            bal => setNetworkBalance(bal)
        );
    }, [chainId]);

    return (
        <header>
            <div className="logo">
                <img src={AccumulateLogo} alt="AccumulateSwap" />
            </div>
            <div className="connectionStatus">
                {
                    !isConnected ? null :
                        <button onClick={onClickNetwork}>
                            <div className="networkData">
                                <img src={currentNetwork?.imageURI} alt={currentNetwork?.name} />
                                <div>{networkBalance} {currentNetwork?.symbol}</div>
                            </div>
                        </button>
                }

                <button onClick={onClickWallet}>
                    {
                        !isConnected ? "Connect Wallet" :
                            <div className="walletData">
                                <img src={walletInfo.icon} alt={walletInfo.name} />
                                <div>{shortenAddress(address)}</div>
                            </div>
                    }
                </button>
            </div>
        </header>
    )
}

export default Header;