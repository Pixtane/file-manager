import React from "react";
import folderImage from "../assets/folder.png";
import "./styles/Card.css";

interface Props {
  type: "folder" | "file";
  children: React.ReactNode;
  onClick: (text: string) => void; // Accepting event parameter
  onContextMenu: (text: string) => void;
}

const Card = ({ type, children, onClick, onContextMenu }: Props) => {
  const handleClick = () => {
    if (typeof children === "string") {
      onClick(children);
    }
  };
  const handleRightClick = (event: React.MouseEvent<HTMLDivElement>) => {
    console.log("Right click", event);
    event?.preventDefault();
    if (typeof children === "string") {
      onContextMenu(children);
    }
  };
  return (
    <div onClick={handleClick} onContextMenu={handleRightClick}>
      <img
        src={folderImage}
        className="img-fluid ${3|rounded-top,rounded-right,rounded-bottom,rounded-left,rounded-circle,|}"
        alt=""
      ></img>
      <p className="card-name fs-2 text-break text-white">{children}</p>
    </div>
  );
};

export default Card;
