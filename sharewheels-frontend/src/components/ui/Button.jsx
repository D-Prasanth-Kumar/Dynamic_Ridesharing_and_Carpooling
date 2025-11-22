export default function Button({ children, className = "", ...props }) {
  return (
    <button
      className={`px-6 py-3 rounded-lg font-medium bg-black text-white hover:bg-gray-800 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
