import { useAccount } from 'wagmi'
import Logo from "../assets/images/OperateCryptoLogo.png";

import "../assets/css/Header.css"

function Header() {
    const { isConnected } = useAccount()

    return (
        <header>
            <img className="logo" src={Logo} alt='' />
            {isConnected ? <w3m-account-button /> : <w3m-connect-button />}
        </header>
    );
}

export default Header;