// NETWORKS

const mainnet = {
    chainId: 1,
    name: 'Ethereum',
    currency: 'ETH',
    explorerUrl: 'https://etherscan.io',
    rpcUrl: 'https://cloudflare-eth.com'
}

const polygonAmoy = {
    chainId: 80002,
    name: 'Polygon Amoy',
    currency: 'MATIC',
    explorerUrl: 'https://www.oklink.com/amoy',
    rpcUrl: 'https://rpc-amoy.polygon.technology'
}

const sepolia = {
    chainId: 11155111,
    name: 'Sepolia',
    currency: 'ETH',
    explorerUrl: 'https://sepolia.etherscan.io',
    rpcUrl: 'https://eth-sepolia.g.alchemy.com/v2/demo'
}

// const ganache = {
//     chainId: 1337,
//     name: 'Ganache',
//     currency: 'ETH',
//     explorerUrl: '',
//     rpcUrl: 'http://127.0.0.1:7545'
// }

export const networks = [mainnet, polygonAmoy, sepolia]