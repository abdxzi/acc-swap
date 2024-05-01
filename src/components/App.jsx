import { createWeb3Modal } from '@web3modal/ethers5/react'
import { Toaster } from 'react-hot-toast';

// INTERNAL IMPORT
import { modalConfig } from '@config'
import { useWindowSize } from "@utils/resizeHook"

import "@css/App.css"
import {Header} from '@components/index';
import { fetchTokenList } from '../utils/utils';
import Swap from './Swap';

createWeb3Modal(modalConfig);

// const testFcn = async () => {
//   fetchTokenList(1);
// }

function App() {
  const [width, height] = useWindowSize();
  
  return (
    <>
      {/* <div style={{position:"fixed", top:0, right:0}}>{width}</div> */}
      <Toaster />
      <Header />
      <Swap />
      {/* <button onClick={testFcn}>Test</button> */}
    </>
  )
}

export default App
