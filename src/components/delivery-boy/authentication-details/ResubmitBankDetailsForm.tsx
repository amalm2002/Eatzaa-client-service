import { ResubmitBankDetailsFormProps } from "../../../interfaces/delivery-boy/authentication/resubmit-details.types";

const ResubmitBankDetailsForm = ({ userDetails, handleInputChange, errors }: ResubmitBankDetailsFormProps) => {
  return (
    <>
      <div>
        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="bankAccount">
          Bank Account Number
        </label>
        <input
          type="text"
          id="bankAccount"
          name="bankAccount"
          value={userDetails.bankAccount}
          onChange={handleInputChange}
          className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
          placeholder="Enter bank account number"
        />
        {errors.bankAccount && <p className="text-red-500 text-xs mt-1">{errors.bankAccount}</p>}
      </div>

      <div>
        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="ifscCode">
          IFSC Code
        </label>
        <input
          type="text"
          id="ifscCode"
          name="ifscCode"
          value={userDetails.ifscCode}
          onChange={handleInputChange}
          className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
          placeholder="Enter IFSC code"
        />
        {errors.ifscCode && <p className="text-red-500 text-xs mt-1">{errors.ifscCode}</p>}
      </div>
    </>
  );
};

export default ResubmitBankDetailsForm;