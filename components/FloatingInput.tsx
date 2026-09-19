
export default function FloatingInput({ type, id, label, value, onChange, required = true }) {
  return (
    <div className="relative my-2 w-full">
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        placeholder=" "
        required={required}
        className="peer block px-4 py-3.5 w-full text-xs text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-[#81007f]"
      />
      <label
        htmlFor={id}
        className="absolute text-xs text-gray-500 font-medium duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-[#81007f] left-3 pointer-events-none"
      >
        {label}
      </label>
    </div>
  );
}