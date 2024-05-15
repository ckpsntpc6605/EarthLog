import React from "react";

export default function Toast({ result, msg }) {
  return (
    <div className="toast toast-top toast-center">
      {result ? (
        <div className="alert bg-white border-green-500 text-green-500 border-2">
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
