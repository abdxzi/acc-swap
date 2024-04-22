// Check whether given input a number
export function isInputANumber(value){
    if (!isNaN(Number(value))) {
        return true;
    } else {
        return false;
    }
}

export const shortenAddress = (address) => `${address?.slice(0, 4)}..${address?.slice(address.length - 3)}`;

export function filterByChainId(data, targetChainId) {
    return data.filter(item => item.chainId === targetChainId);
}