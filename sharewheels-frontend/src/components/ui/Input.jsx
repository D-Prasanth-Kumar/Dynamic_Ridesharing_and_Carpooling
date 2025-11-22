export default function Input({ label, ...props }) {
  return (
    <div className="space-y-1 w-full">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <input {...props} className="rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-black focus:border-black outline-none bg-white w-full" />
    </div>
  );
}
