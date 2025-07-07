const EmptyState: React.FC = () => {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
      <p className="text-gray-600">No transaction data available</p>
    </div>
  );
};

export default EmptyState;