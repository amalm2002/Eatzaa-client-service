import { User } from 'lucide-react';
import { DeliveryBoyDetailsPersonalProps } from '../../../../interfaces/admin/delivery-boys/delivery-boy-details.types';

const DeliveryBoyDetailsPersonal = ({ deliveryBoy, formatDate }: DeliveryBoyDetailsPersonalProps) => {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
            <User className="mr-2 h-5 w-5 text-orange-500" />
            Personal & Banking Information
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Secure personal and payment details
          </p>
        </div>

        <div className="border-t border-gray-200">
          <dl>
            {[
              { label: 'Full Name', value: deliveryBoy.name },
              { label: 'Mobile Number', value: deliveryBoy.mobile },
              { label: 'PAN Card Number', value: deliveryBoy.panCard.number },
              { label: 'License Number', value: deliveryBoy.license.number },
              { label: 'Vehicle Type', value: deliveryBoy.vehicle },
              { label: 'Bank Account Number', value: deliveryBoy.bankDetails.accountNumber },
              { label: 'IFSC Code', value: deliveryBoy.bankDetails.ifscCode },
              { label: 'Service Zone', value: deliveryBoy.zone.name },
              { label: 'Account Created', value: formatDate(deliveryBoy.createdAt) },
              { label: 'Last Updated', value: formatDate(deliveryBoy.updatedAt) },
            ].map((item, index) => (
              <div
                key={index}
                className={`px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                  } hover:bg-gray-100 transition-colors duration-200`}
              >
                <dt className="text-sm font-medium text-gray-500">{item.label}</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default DeliveryBoyDetailsPersonal;