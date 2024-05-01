import { ethers } from "ethers";
import { Server } from "./server";
import { ERC20Fetch } from "./ERC20Fetch";
import { BigNumber } from "ethers";

const shortenAddress = (address) => `${address?.slice(0, 4)}..${address?.slice(address.length - 3)}`;

const getCurrentNetworkData = (data, targetChainId) => {
    return data.find(obj => obj.chainId === targetChainId);
}

const getNetworkBalance = async (walletProvider) => {
    if (!walletProvider) return null;
    const provider = new ethers.providers.Web3Provider(walletProvider);
    const signer = provider.getSigner();

    const balHex = await signer.getBalance();
    const balance = parseFloat(ethers.utils.formatUnits(balHex)).toFixed(3);

    return balance;
}

function getTokenFromSearch(data, input) {
    const search = input.toLowerCase();

    return data.filter(
        obj => {
            const name = obj.name.toLowerCase()
            const symbol = obj.symbol.toLowerCase()
            const address = obj.address.toLowerCase()
            return name.includes(search) || symbol.includes(search) || address == search;
        }
    )
}


const fetchChainData = async (chainID) => {
    const api = import.meta.env.VITE_API_URL;
    const network = await Server.get(`${api}/network/${chainID}`);
    return network
}

const fetchTokenList = async (chainID) => {
    const api = import.meta.env.VITE_API_URL;
    const tokens = await Server.get(`${api}/tokens/${chainID}`);
    return tokens
}

// curl -X POST -H "Content-Type: application/json" -d "{\"chainId\": 1, \"token1\": \"0x111111111117dC0aa78b770fA6A738034120C302\", \"token2\": \"0xdAC17F958D2ee523a2206206994597C13D831ec7\", \"slippage\":\"5\", \"address\":\"0x838022424e339deC8f4EF15886e360ccA5ad992A\", \"amountIn\":\"2\"}" http://localhost:3000/api/swap/alpha
const fetchTrade = async (chainId, tokenInAddress, tokenOutAddress, slippage, recipientAddress, amountIn) => {
    // console.log(chainId, tokenInAddress, tokenOutAddress, slippage, recipientAddress, amountIn)
    const api = import.meta.env.VITE_API_URL;
    const data = {
        chainId: chainId ? chainId : 1,
        token1: tokenInAddress,
        token2: tokenOutAddress,
        slippage: slippage,
        address: recipientAddress,
        amountIn: amountIn
    }
    console.log(data)
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const trade = await Server.post(`${api}/swap/alpha`, data, config);
    return trade
}

// Check whether given input a number
const isInputANumber = (value) => {
    if (!isNaN(Number(value))) {
        return true;
    } else {
        return false;
    }
}

const approveTransaction = async (provider, route) => {
    const signer = await provider.getSigner();

    const tokenInAddress = route.input.token.address;
    const owner = await signer.getAddress();
    const amount = route.input.amountBigN.toString()

    const approval = await ERC20Fetch.approveIfNoAllowance(
        signer,
        tokenInAddress,
        owner,
        route.txn.to,
        amount
    )
    return approval;
}

const executeTrade = async (provider, route) => {
    const signer = await provider.getSigner();
    const owner = await signer.getAddress();

    var nc = await signer.getTransactionCount();

    const Txn = {
        data: route.txn.data,
        nonce: nc,
        to: route.txn.to,
        value: BigNumber.from(route.txn.value),
        from: owner,
        gasPrice: BigNumber.from(route.txn.gasPrice),
        gasLimit: BigNumber.from(route.txn.gasLimit),
    }

    console.log(Txn)

    const TxnResponse = await signer.sendTransaction(Txn);
    const receipt = await TxnResponse.wait();

    console.log("Transaction Done");

    return receipt.status == 1 ? true : false;
}

export {
    shortenAddress,
    getCurrentNetworkData,
    getNetworkBalance,
    getTokenFromSearch,
    fetchChainData,
    fetchTokenList,
    isInputANumber,
    fetchTrade,
    approveTransaction,
    executeTrade
}