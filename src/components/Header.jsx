import { useWindowSize } from "@utils/resizeHook";
import "@css/Header.css"
import DesktopLogo from "@assets/images/desktop_logo.svg"
import MobileLogo from "@assets/images/mobile_logo.svg"
import { useWalletInfo, useWeb3Modal, useWeb3ModalAccount } from "@web3modal/ethers5/react";
import { shortenAddress } from "@utils/utils";

function Header() {

    const [width, height] = useWindowSize();
    const { address, chainId, isConnected } = useWeb3ModalAccount()
    const { walletInfo } = useWalletInfo()
    const { open, close } = useWeb3Modal()
    
    const logo = width > 750 ? DesktopLogo : MobileLogo;

    // console.log(isConnected, address, chainId);

    const handleClick = ()=>{
        isConnected ? open({ view: 'Account' }) : open({view: 'Connect'});
    }
    
    return (
        <header>
            <div className="logo">
                <img src={logo} alt="AccumulateSwap" />
            </div>
            <div className="connectionStatus">
                <button onClick={handleClick}>
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