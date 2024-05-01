import "@css/CoinBadgeList.css"
import { CoinBadge } from "..";

function CoinBadgeList({tokenList, onBadgeClick}) {
    return(
        <div className="badgeList">
            {
                tokenList.map((token, i) => (<CoinBadge token={token} key={i} onBadgeClick={onBadgeClick} />))
            }
        </div>
    )
}

export default CoinBadgeList;