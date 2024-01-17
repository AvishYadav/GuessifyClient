import React from 'react'

const CharCard = (props) => {
    const imagePath = process.env.PUBLIC_URL + props.mainImg;
    return (
        <div
            className="charCard"
            onClick={() => {
                props.selectChar(props.title);
                window.scrollTo(0, 0);
            }}
        >
            <div className="icharImg">
                <img
                    src={imagePath}
                    className=""
                    alt={props.title}
                />
            </div>
        </div>
    );
};

export default CharCard;