import "@css/TokenSearchInput.css"

function TokenSearchInput({input, onSearchInput}) {

    const handleonInput = ()=> {
        onSearchInput(event.target.value);
    }

    return(
        <div className="tokenSearchInput">
            <input type="text" placeholder="Search name or paste address" autoComplete="off" onInput={handleonInput} value={input}/>
        </div>
    )
}

export default TokenSearchInput;