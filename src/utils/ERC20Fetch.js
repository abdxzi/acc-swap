import { ethers, BigNumber } from "ethers";
import { ERC20_ABI } from "./abi";

export class ERC20Fetch {
    static async balanceOf(provider, token, owner) {
        // console.log(provider, token, owner)
        const contract = new ethers.Contract(token, ERC20_ABI, provider);
        const balance = await contract.balanceOf(owner);
        return balance;
    }

    static async allowance(contract, owner, spender, amount) {
        const allowance = await contract.callStatic.allowance(owner, spender);

        if (BigNumber.from(allowance).gte(BigNumber.from(amount))) {
            console.log("Allowance confirmed")
            return true;
        } else {
            return false;
        }
    }

    static async approve(signer, token, owner, spender, amount) {
        const contract = new ethers.Contract(token, ERC20_ABI, signer);

        const allowance = await this.allowance(contract, owner, spender, amount);

        if(!allowance){
            const tx = await contract.approve(spender, amount);
            console.log("Approval TxnHash:", tx.hash);
            await tx.wait();

            // confirm allowance
            return await this.allowance(contract, owner, spender, amount);
        } else {
            console.log("Already Allowed !")
            return true;
        }

    }
}