import React from "react";

interface Props {
  title?: string;
  children?: React.ReactNode;
  color: string;
  acceptButtonText: string;
  acceptButtonColor: string;
  declineButtonText: string;
  declineButtonColor: string;
  onAccept: () => void;
  onDecline: () => void;
}

const MiniForm = ({
  title,
  children,
  color,
  acceptButtonText,
  acceptButtonColor,
  declineButtonText,
  declineButtonColor,
  onAccept,
  onDecline,
}: Props) => {
  const height = { height: "2.4em" };

  const handleSubmit = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    console.log("Submit", event);
    event.preventDefault();
    onAccept();
  };

  const handleDecline = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    console.log("Decline", event);
    event.preventDefault();
    onDecline();
  };

  return (
    <div className="position-fixed container d-flex justify-content-center align-items-center top-50 start-50 translate-middle">
      <div
        className={`card text-white bg-${color} mb-3`}
        style={{ padding: "1em", width: "20em" }}
      >
        <div className="card-header fs-3" style={{ paddingTop: "0.5em" }}>
          {title}
        </div>
        <div className="card-body">
          {children && <p className="card-text">{children}</p>}
          <form className="row column-gap-2" style={{ paddingTop: "0.2em" }}>
            <button
              type="button"
              className={`col btn btn-${declineButtonColor}`}
              style={height}
              onClick={(event) => handleDecline(event)}
            >
              {declineButtonText}
            </button>
            <button
              type="button"
              className={`col btn btn-${acceptButtonColor}`}
              style={height}
              onClick={(event) => handleSubmit(event)}
            >
              {acceptButtonText}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MiniForm;
