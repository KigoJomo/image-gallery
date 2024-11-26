export default function Toast({ message, type }: { message: string; type: 'success' | 'warning' | 'error' }) {
  const typeClasses = {
    success: 'border-green-500 text-green-600 bg-green-100',
    error: 'border-red-500 text-red-600 bg-red-100',
    warning: 'border-yellow-500 text-yellow-600 bg-yellow-100',
  };

  return (
    <div
      className={`fixed bottom-4 mx-auto slideInBottom w-fit px-4 py-2 rounded shadow-lg border ${
        typeClasses[type] || 'border-gray-500 text-gray-600 bg-gray-100'
      }`}
    >
      <p>{message}</p>
    </div>
  );
}
