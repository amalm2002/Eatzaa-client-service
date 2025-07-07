const LoadingState: React.FC = () => {
  return (
    <div className="text-center py-10">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
      <p className="mt-2 text-gray-600">Loading transaction details...</p>
    </div>
  );
};

export default LoadingState;