import React, { useState } from "react";

interface Props {
  title?: string;
  children?: React.ReactNode;
  color: string;
  inputType: string;
  buttonText: string;
  buttonColor: string;
  placeholdertext?: string;
  onClick: (inputText: string) => void;
}

const MiniForm = React.memo(
  ({
    title,
    children,
    color,
    inputType,
    buttonText,
    buttonColor,
    placeholdertext,
    onClick,
  }: Props) => {
    const height = { height: "2.4em" };
    const [inputText, setInputText] = useState("");

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setInputText(event.target.value);
    };

    return (
      <div className="position-fixed container d-flex justify-content-center align-items-center top-50 start-50 translate-middle">
        <div
          className={`card text-white bg-${color} mb-3`}
          style={{ padding: "1em" }}
        >
          <div className="card-header fs-4" style={{ paddingTop: "0.5em" }}>
            {title}
          </div>
          <div className="card-body">
            {children && <p className="card-text">{children}</p>}
            <form className="row" style={{ paddingTop: "0.5em" }}>
              <div className="mb-3 col" style={height}>
                <input
                  type={inputType}
                  placeholder={placeholdertext}
                  className="form-control"
                  id="input"
                  onChange={handleInputChange}
                />
              </div>
              <button
                type="submit"
                className={`col col-4 btn btn-${buttonColor}`}
                style={height}
                onClick={() => onClick(inputText)}
              >
                {buttonText}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
);

export default MiniForm;
