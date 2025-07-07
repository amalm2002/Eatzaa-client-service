import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { motion } from 'framer-motion';
import { ConfirmationModalProps } from '../../../interfaces/restaurant/menu/confirmation-modal.types';

const MySwal = withReactContent(Swal);

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ id, isActive, onConfirm }) => {
  const action = isActive ? 'block' : 'unblock';

  MySwal.fire({
    title: `Are you sure?`,
    text: `Do you want to ${action} this menu item?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#6589f6',
    cancelButtonColor: '#d33',
    confirmButtonText: isActive ? 'Block' : 'Unblock',
    background: '#fefefe',
    customClass: {
      confirmButton: 'swal-confirm-button',
      cancelButton: 'swal-cancel-button',
      title: 'swal-title',
      htmlContainer: 'swal-text',
      popup: 'swal-popup',
    },
    html: (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <p className="swal-text">{`Do you want to ${action} this menu item?`}</p>
      </motion.div>
    ),
  }).then(async (result) => {
    if (result.isConfirmed) {
      await onConfirm(id, isActive);
    }
  });

  return null;
};

export default ConfirmationModal;