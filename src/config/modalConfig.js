import { networks } from "./modalNetworks"
import { ethersConfig, projectId } from "./providerConfig";

export const modalConfig = {
    ethersConfig,
    chains: networks,
    projectId,
    enableAnalytics: false,
    // termsConditionsUrl: 'https://www.mytermsandconditions.com',
    // privacyPolicyUrl: 'https://www.myprivacypolicy.com',
}