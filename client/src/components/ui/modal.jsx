export default function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative p-6 bg-white rounded-lg shadow-lg">
        {children}
        <button className="absolute text-xl top-2 right-2" onClick={onClose}>
          &times;
        </button>
      </div>
    </div>
  );
}
