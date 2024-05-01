import "@css/CoinBadge.css"

function CoinBadge({token, onBadgeClick}) {
    
    const handleClick = ()=>{
        onBadgeClick(token);
    }

    return(
        <div className="coinBadge" onClick={handleClick}>
            <img src={token.logoURI} alt={token.name} />
            <span>{token.symbol}</span>
        </div>
    )
}

export default CoinBadge;