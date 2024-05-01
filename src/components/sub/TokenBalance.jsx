import "@css/TokenBalance.css"

import { useEffect } from "react";
import { ERC20Fetch } from "@utils/ERC20Fetch";
import { TokenAmountHelper } from "@utils/TokenAmountHelper";


function TokenBalance({swapState, address, update}) {

    const provider = swapState.provider;
    const balance = swapState.balance;
    const setBalance = swapState.setBalance;
    const currentToken = swapState.tokenInfoOne;

    // Method call to fetch ERC20 token balance
    async function fetchBalance(){
        if(!currentToken.decimals) return;
        const bal = await ERC20Fetch.balanceOf(provider, currentToken.address, address);
        // console.log(bal.toString(), currentToken.decimals, address)
        const tokens = TokenAmountHelper.convertFromBigIntString(bal.toString(), currentToken.decimals);
        setBalance(parseFloat(tokens).toFixed(3));
    }

    useEffect(()=>{
        setBalance(0.00);
        fetchBalance();
    }, [currentToken, update]);

    return(
        <div className="tokenBalance">
            MAX: {balance} {currentToken.symbol}
        </div>
    );
;}

export default TokenBalance;