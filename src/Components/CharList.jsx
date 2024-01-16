import {useState} from 'react'
import {Data} from '../Data/CharData'
import CharCard from '../Components/CharCard'

const CharList = ({setChar}) => {
    const [ category, setCategory] = useState();
    const [ Chardata, setChardata] = useState([]);

    const clickHandler = (cat) => {
        setCategory(cat);
        setChardata(Data[cat].charData);
    }

    const [name, setName] = useState("");
    const selectChar = (charName) => {
      setName(charName);
      setChar(name);
      console.log(charName)
      console.log(name)
    };


  return (
    <div className='charList'>
        <button onClick={()=>{clickHandler(0)}}>One Piece</button>
        <button onClick={()=>{clickHandler(1)}}>Football</button>
        <p>{category}</p>
        {Chardata?<div className='charCardList'>
        {Chardata.map(function(obj) {
            return <CharCard id={obj.id} title={obj.name} mainImg={obj.img} key={obj.id} selectChar={selectChar} />;
            })}
        </div>:
       < div></div>}

    </div>
  )
}

export default CharList