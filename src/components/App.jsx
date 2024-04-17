import { Routes, Route } from "react-router-dom";

import Wep3Provider from "./Web3Provider";
import Header from "./Header";
import Swap from "./Swap";
// import AddLiquidity from "./Addliquidity";

import "../assets/css/App.css"


export default function App() {
  return (
    <Wep3Provider>
      <Header />
      <div className="mainWindow">
        <Routes>
          <Route path="/" element={<Swap />} />
          {/* <Route path="/liquidity" element={<AddLiquidity />} /> */}
        </Routes>
      </div>
    </Wep3Provider>
  )
}