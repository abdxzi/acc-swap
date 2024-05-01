import { ScaleLoader } from "react-spinners";
import "@css/SwapLoader.css"

function SwapLoader() {
    return (
        <div className="swapProcessLoader">
            <ScaleLoader
                color="#5981F3"
                height={19}
                loading
                radius={0}
                speedMultiplier={1.5}
                width={0.5}
            />
        </div>
    );
}

export default SwapLoader;