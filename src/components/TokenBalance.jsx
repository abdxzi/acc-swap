import "../assets/css/TokenBalance.css"
import { useEffect, useState } from "react";
import { ContractCall } from "../utils/contractCall";
import { TokenAmountHelper } from "./token/tokenAmount/tokenAmountHelper";

function TokenBalance({currentToken, address}) {

    const contractCall = new ContractCall();
    // const tokenAmountHelper = new TokenAmountHelper();
    
    const [balance, setBalance] = useState(0);


    // Method call to fetch ERC20 token balance
    async function fetchBalance(){
        const tokenBalance = await contractCall.balanceOf(currentToken.address, address);
        if(tokenBalance != 0){
            const formatB = TokenAmountHelper.unitsToTokens(tokenBalance, currentToken.decimals);
            setBalance(parseFloat(formatB).toFixed(3));
        } else {
            setBalance(0);
        }
    }

    useEffect(()=>{
        setBalance(0);
        fetchBalance();
    }, [currentToken]);

    return(
        <div className="tokenBalance">
            balance {balance} {currentToken.ticker}
        </div>
    );
;}

export default TokenBalance;