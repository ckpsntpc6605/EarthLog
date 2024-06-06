export default function Toast({ result, msg }) {
  return (
    <div className="toast toast-top toast-center">
      {result ? (
        <div className="alert bg-green-100 border-green-100 text-green-600 font-semibold shadow-lg">
          <span>{msg}</span>
        </div>
      ) : (
        <div className="alert bg-red-200 border-red-200 text-red-600 font-semibold shadow-lg">
          <span>{msg}</span>
        </div>
      )}
    </div>
  );
}
