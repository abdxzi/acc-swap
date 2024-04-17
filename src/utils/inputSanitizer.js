// Check whether given input a number
export function isInputANumber(value){
    if (!isNaN(Number(value))) {
        return true;
    } else {
        return false;
    }
}
