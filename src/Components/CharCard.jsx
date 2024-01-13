import React from 'react'

const CharCard = (props) => {
    const imagePath = process.env.PUBLIC_URL + props.mainImg;
    return (
        <div
            className=""
        >
            <div className="h-full w-full p-2 md:p-3 lg:p-4 relative">
                <img
                    src={imagePath}
                    className=""
                    alt={props.title}
                />
                <p>{props.title}</p>
            </div>
        </div>
    );
};

export default CharCard;