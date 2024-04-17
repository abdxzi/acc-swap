import { parseUnits, formatUnits } from 'viem';

export class TokenAmountHelper {
    // Converts token count to minimum decimal units
    static tokenToUnits(input, decimals){
        console.log(input, decimals);
        const units = input ? parseUnits(input, decimals) : 0;
        return units;
    }

    // Converts minimal token units to token count
    static unitsToTokens(input, decimals) {
        const tokens = input ? formatUnits(input, decimals) : "";
        return tokens;
    }

    // Calculate amountOutMin with slippage
    // input: (Number, %, Number), Output: (tokenUnits)
    static getAmountOutMinimum(amountQuote, slippage, decimals){
        const slippageTolerance  = slippage/100;
        const slippageAmount = (amountQuote * slippageTolerance).toFixed(decimals);
        const tokensOut = amountQuote - slippageAmount;
        const units = this.tokenToUnits(String(tokensOut), decimals);
        return units;
    }
}