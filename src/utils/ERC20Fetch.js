import { ethers, BigNumber } from "ethers";
import { ERC20_ABI } from "./abi";

export class ERC20Fetch {

    // Fetch ERC20 Token balance of an address
    static async balanceOf(provider, token, owner) {
        // console.log("BalanceOf", owner, token, !owner, !token)
        if(!provider || !token || !owner) return 0;
        const contract = new ethers.Contract(token, ERC20_ABI, provider);
        const balance = await contract.callStatic.balanceOf(owner);
        return balance;
    }

    // Fetch ERC20 allowance
    static async allowance(provider, token, owner, spender) {

        
        const contract = new ethers.Contract(token, ERC20_ABI, provider);
        const allowance = await contract.callStatic.allowance(owner, spender);
        return allowance;
    }

    // Fetch ERC20 Approve
    static async approve(signer, token, spender, amount) {
        try {
            const contract = new ethers.Contract(token, ERC20_ABI, signer);
            const tx = await contract.approve(spender, amount);
            await tx.wait();
            console.log("Approval TxnHash:", tx.hash);
            return true;
        } catch(e) {
            throw Error("Approval Failed !");
        }
    }

    // Fetch ERC20 allowance confirm
    static async confirmAllowance(provider, token, owner, spender, amount){

        // console.log("confirm allowance", provider, token, owner, spender, amount)

        const allowance = await this.allowance(provider, token, owner, spender);

        // console.log("allowance is ", allowance)

        if (BigNumber.from(allowance).gte(BigNumber.from(amount))) {
            console.log("Allowance confirmed")
            return true;
        } else {
            return false;
        }
    }

    // Approve if no allowance
    static async approveIfNoAllowance(signer, token, owner, spender, amount){
        // console.log("approveIfNoAllowance => ", signer, token, owner, spender, amount)

        // check allowance amount and if not enough approve
        const isAllowed = await this.confirmAllowance(signer, token, owner, spender, amount);
        if(!isAllowed){
            console.log("Approving ....")
            await this.approve(signer, token, spender, amount);
        }

        // confirm allowance
        const allowance = await this.confirmAllowance(signer, token, owner, spender, amount);
        return allowance;
    }
}