
import { useState, useMemo } from 'react'

const SelectBox = ({ options, setselected, selected, type }: any) => {

    const [show, setshow] = useState(false)
    const [input, setinput] = useState('')

    const filteredOptions = useMemo(() => {
        if (type === 'countries') {
            return options.filter((o: any) =>
                o.name.toLowerCase().includes(input.toLowerCase()) || o.code.toLowerCase().includes(input.toLowerCase())
            );
        }
        if (type === 'states') {
            return options.filter((o: any) =>
                o.name.toLowerCase().includes(input.toLowerCase()) || o.iso.toLowerCase().includes(input.toLowerCase())
            );
        }
        if (type === 'cities') {
            return options.filter((o: any) =>
                o.name.toLowerCase().includes(input.toLowerCase())
            );
        }
        else return options

    }, [options, input]);


    const style = {
        border: "1px solid gray",
        padding: "5px 10px",
        borderRadius: "6px",
      };


    return type === 'countries' ? (
        <div className='selectBox' >
            <p className='text' onClick={() => setshow(!show)} >{Object.keys(selected).length ? selected.name : "Select option"} </p>
            {show && <ul className='list' >
                <li><input placeholder='Search' className='searchBox'  value={input} onChange={(e) => setinput(e.target.value)} /></li>
                {filteredOptions.map((o: any) => <li onClick={() => {
                    setselected(o)
                    setshow(!show)
                }} key={o.name} >{o.name}<p className='hsnCode' >{o.code}</p></li>)}
            </ul>}
        </div>
    )
        : type === 'states' ? (
            <div className='selectBox' >
                <p className='text' onClick={() => setshow(!show)} >{Object.keys(selected).length ? selected.name : "Select States"} </p>
                {show && <ul className='list' >
                    <li><input placeholder='Search' className='searchBox' style={style} value={input} onChange={(e) => setinput(e.target.value)} /></li>
                    {filteredOptions.map((o: any) => <li onClick={() => {
                        setselected(o)
                        setshow(!show)
                    }} key={o.name}>{o.name}</li>)}
                </ul>}
            </div>
        )
            : type === 'cities' ? (
                <div className='selectBox' >
                    <p className='text' onClick={() => setshow(!show)} >{Object.keys(selected).length ? selected.name : "Select option"} </p>
                    {show && <ul className='list' >
                        <li><input placeholder='Search' className='searchBox' value={input} onChange={(e) => setinput(e.target.value)} /></li>
                        {filteredOptions.map((o: any) => <li onClick={() => {
                            setselected(o)
                            setshow(!show)
                        }} key={o.name} >{o.name}</li>)}
                    </ul>}
                </div>
            )
                : null
}

export default SelectBox
