import { memo } from "react";

const MessageBox = ({ msgs }) => {
  console.log("child render");
  return (
    <>
      {/* <h2>My Todos</h2> */}
      {msgs.map((msg, index) => {
        return <p key={index}>{msg}</p>;
      })}
    </>
  );
};

export default memo(MessageBox);
