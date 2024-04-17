import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { mainnet, polygonAmoy } from 'wagmi/chains';
// import { ganache } from "../utils/ganache";



const queryClient = new QueryClient()

// ccn: Move this to server side
const projectId = import.meta.env.VITE_PROJECT_ID;
if (!projectId) {
    throw new Error('VITE_PROJECT_ID is not set')
}

// Provider config
export const wagmiConfig = defaultWagmiConfig({
    chains: [mainnet, polygonAmoy],
    projectId,
    metadata: {
        name: 'Web3Modal React Example',
        description: 'Web3Modal React Example',
        url: '',
        icons: []
    }
});

// Create modal
const web3Modal = createWeb3Modal({
    wagmiConfig,
    projectId,
})

export default function Wep3Provider({ children }) {
    return (
        <>
            <WagmiProvider config={wagmiConfig}>
                <QueryClientProvider client={queryClient}>
                    {children}
                </QueryClientProvider>
            </WagmiProvider>
        </>

    )
}