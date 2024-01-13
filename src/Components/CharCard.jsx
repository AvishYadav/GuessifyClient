import React from 'react'

const CharCard = (props) => {
    return (
        <div
            className=""
        >
            <div className="h-full w-full p-2 md:p-3 lg:p-4 relative">
                <img
                    src={props.mainImg}
                    className=""
                    alt={props.title}
                />
                <p>{props.title}</p>
            </div>
        </div>
    );
};

export default CharCard;