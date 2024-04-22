import { ethers, BigNumber } from "ethers";

export class TokenAmountHelper {

    static convertToBigIntString(amount, decimals) {
        // amount:String "2", decimals:Number

        if (!amount || !decimals) throw Error("Error::convertToBigIntString from TokenAmountHelper");
        const parsedAmount = parseFloat(amount);
        const adjustedAmount = parsedAmount * Math.pow(10, decimals);
        const bigIntAmount = BigInt(adjustedAmount)
        return bigIntAmount.toString();
    }


    static convertFromBigIntString(bign, decimals) {
        if (!bign || !decimals) throw Error("Error::convertFromBigIntString from TokenAmountHelper");
        // console.log(bign, decimals)
        // const bigNValue = ethers.BigNumber.from(bign);
        const tokens = ethers.utils.formatUnits(bign, decimals);

        return tokens;
    }
}