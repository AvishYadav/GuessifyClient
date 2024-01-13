import {useState} from 'react'
import {Data} from '../Data/CharData'
import CharCard from '../Components/CharCard'

const CharList = () => {
    const [ category, setCategory] = useState();
    const [ Chardata, setChardata] = useState([]);

    const clickHandler = (cat) => {
        setCategory(cat);
        setChardata(Data[cat].charData);
        console.log(category)
        console.log(Chardata)
    }
  return (
    <div>
        <button onClick={()=>{clickHandler(0)}}>One Piece</button>
        <button onClick={()=>{clickHandler(1)}}>Football</button>
        <p>{category}</p>
        {Chardata?<div>
        {Chardata.map((obj)=> {
            return <CharCard id={obj.id} title={obj.name} mainImg={obj.img} key={obj.id} />;
            })}
        </div>:
       < div></div>}

    </div>
  )
}

export default CharList