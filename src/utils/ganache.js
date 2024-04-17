import { defineChain } from 'viem';

export const ganache = /*#__PURE__*/ defineChain({
  id: 1_337,
  name: 'Ganache',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: { http: ['http://127.0.0.1:7545'] },
  },
})
