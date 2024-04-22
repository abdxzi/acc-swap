import { AlphaRouter, SwapType } from '@uniswap/smart-order-router'
import { Token, CurrencyAmount, TradeType } from '@uniswap/sdk-core'
import { JSBI, Percent } from "@uniswap/sdk";
import { ethers, BigNumber } from "ethers";

import { ERC20Fetch } from './ERC20Fetch';
import { TokenAmountHelper } from './TokenAmountHelper';

const V3_SWAP_ROUTER_ADDRESS = "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45";
const V3_SEPOLIA_SWAP_ROUTER = "0x3bFA4769FB09eefC5a80d6E87c3B9C650f7Ae48E";


export async function getQuote(provider, token1, token2, amountIn) {
    const _chainId = 11155111;
    console.log(await provider.getNetwork().chainId);
    console.log(`${token1.symbol} to ${token2.symbol} in chainId: ${_chainId}`)
    const router = new AlphaRouter({ chainId: _chainId, provider: provider });
    const TOKEN_1 = new Token(
        router.chainId,
        ethers.utils.getAddress(token1.address),
        token1.decimals,
        token1.symbol,
        token1.name
    );

    const TOKEN_2 = new Token(
        router.chainId,
        ethers.utils.getAddress(token2.address),
        token2.decimals,
        token2.symbol,
        token2.name
    );

    const typedValueParsed = TokenAmountHelper.convertToBigIntString(amountIn, token1.decimals);
    const tokenInAmount = CurrencyAmount.fromRawAmount(TOKEN_1, JSBI.BigInt(typedValueParsed));

    // const IO = "Exact_Input"
    // const TradeType = IO == "Exact_Input" ? 0 : 1;

    console.log("Routing....");

    const route = await router.route(
        tokenInAmount,
        TOKEN_2,
        TradeType.EXACT_INPUT,
        {
            type: SwapType.SWAP_ROUTER_02,
            recipient: '0x838022424e339deC8f4EF15886e360ccA5ad992A',
            slippageTolerance: new Percent(5, 100),
            deadline: Math.floor(Date.now() / 1000 + 1800)
        }
    );



    console.log(route.quote.toSignificant(6))
    // console.log(route.methodParameters.calldata)
    // console.log()
    console.log(ethers.utils.formatUnits(route.gasPriceWei.toString(), 18))
    console.log(ethers.utils.formatUnits(route.estimatedGasUsed.toString(), 18))

    console.log(route.trade.inputAmount.currency.address);
    console.log(route.trade.outputAmount.currency.address);
    console.log(route.trade.inputAmount.numerator / route.trade.inputAmount.denominator);

    // console.log(r);

    

    return route;

}

export async function approveTransaction(provider, route){
    const signer = await provider.getSigner();

    // APPROVE ERC20
    const tokenInAddress = route.trade.inputAmount.currency.address;
    const tokenOutAddress = route.trade.outputAmount.currency.address;
    const owner = await signer.getAddress();
    const amount = (route.trade.inputAmount.numerator / route.trade.inputAmount.denominator).toString()

    // console.log("INP to APPROVAL:", tokenInAddress, owner, V3_SEPOLIA_SWAP_ROUTER, amount);
    const approval = await ERC20Fetch.approve(signer, tokenInAddress, owner, V3_SEPOLIA_SWAP_ROUTER, amount);

    // Swap
    // console.log("Input token Balance", (await ERC20Fetch.balanceOf(provider, tokenInAddress, owner)).toString());
    // console.log("Output token balance", (await ERC20Fetch.balanceOf(provider, tokenOutAddress, owner)).toString());

    return approval;
}

export async function executeSwap(provider, route) {
    const signer = await provider.getSigner();
    const owner = await signer.getAddress();

    var nc = await signer.getTransactionCount();

    const Txn = {
        data: route.methodParameters.calldata,
        nonce: nc,
        to: V3_SEPOLIA_SWAP_ROUTER,
        value: BigNumber.from(0),
        from: owner,
        gasPrice: BigNumber.from(route.gasPriceWei),
        gasLimit: BigNumber.from(route.estimatedGasUsed).add(BigNumber.from("50000")),
    }



    const TxnResponse = await signer.sendTransaction(Txn);
    const receipt = await TxnResponse.wait();
    
    console.log("Transaction reciept status", receipt.status);
    
    return receipt.status == 1 ? true : false;
    // console.log("Transaction hash:", receipt.transactionHash);
    // console.log("Gas used:", receipt.gasUsed.toString());

    // console.log("Input token Balance", (await ERC20Fetch.balanceOf(provider, tokenInAddress, owner)).toString());
    // console.log("Output token balance", (await ERC20Fetch.balanceOf(provider, tokenOutAddress, owner)).toString());


}