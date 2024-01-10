import { memo } from "react";

const MessageBox = ({ msgs }) => {
  console.log("child render");
  console.log(msgs);
  return (
    <>
      {msgs.map((msg, index) => {
        return <p key={index}>{msg}</p>;
      })}
    </>
  );
};

export default memo(MessageBox);
