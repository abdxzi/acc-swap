import axios from "axios";

// Method call to find alt price of Crypto tokens, Uses CoinGecko API
// lfa : Coingecko API limits, $120 yearly

export function fetchUSDPrice(platform, address, currencies="usd",precision=3){
    axios(
        {
            method: 'GET',
            url: `https://api.coingecko.com/api/v3/simple/token_price/${platform}?contract_addresses=${address}&vs_currencies=${currencies}&precision=${precision}`,
            headers: {
                'accept': 'application/json', 
                'x-cg-demo-api-key': 'CG-69keRAFWHL8cYUJnCxeYAGmB'
            }
        }
    ).then((res) => {
        console.log(res.data);
    })
    .catch((err) => {
        console.log(err);
    });
}

// fetchUSDPrice('ethereum', '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599', 'usd,eur', 3);

