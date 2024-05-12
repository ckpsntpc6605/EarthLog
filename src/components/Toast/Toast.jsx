import React from "react";

export default function Toast({ result, msg }) {
  return (
    <div className="toast toast-top toast-center">
      {result ? (
        <div className="alert alert-success">
          <span>{msg}</span>
        </div>
      ) : (
        <div className="alert alert-error">
          <span>{msg}</span>
        </div>
      )}
    </div>
  );
}
