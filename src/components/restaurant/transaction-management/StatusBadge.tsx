import { Transaction } from "../../../interfaces/restaurant/transaction/transaction-details.types";

const StatusBadge: React.FC<{ status: Transaction["status"] }> = ({ status }) => {
  const badgeStyles = {
    paid: "bg-green-100 text-green-800",
    created: "bg-blue-100 text-blue-800",
    failed: "bg-red-100 text-red-800",
  };
  return (
    <span className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${badgeStyles[status]}`}>
      {status}
    </span>
  );
};

export default StatusBadge;