import React from "react";

interface Props {
  color?:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "light"
    | "dark";
  children: string;
  onClick: () => void;
}

const Alert = ({ color = "primary", onClick, children }: Props) => {
  return (
    <>
      <div className={`alert alert-dismissible fade show alert-${color}`}>
        {children}
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="alert"
          aria-label="Close"
          onClick={onClick}
        ></button>
      </div>
    </>
  );
};

const MemoizedAlert = React.memo(Alert);
export default MemoizedAlert;
