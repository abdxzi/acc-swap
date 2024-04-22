import { ethers } from "ethers"
import { createWeb3Modal, useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers5/react'
import { message } from 'antd';

// INTERNAL IMPORT
import { modalConfig } from '@config'
import { Header, Swap } from "."
import { useWindowSize } from "@utils/resizeHook"

import "@css/App.css"

createWeb3Modal(modalConfig)

function App() {

  const { address, chainId, isConnected } = useWeb3ModalAccount()
  const { walletProvider } = useWeb3ModalProvider()

  // const [messageApi, contextHolder] = message.useMessage();
  
  const [width, height] = useWindowSize();
  

  // const etherProvider = isConnected ? new ethers.providers.Web3Provider(walletProvider) : undefined;

  return (
    <>
      {/* {contextHolder} */}
      <div style={{position:"fixed", top:0, right:0}}>{width}</div>
      <Header />
      <Swap />
      {/* <w3m-connect-button /> */}
    </>
  )
}

export default App
