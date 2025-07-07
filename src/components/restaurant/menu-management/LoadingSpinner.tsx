import { motion } from 'framer-motion';
import { LoadingSpinnerProps } from '../../../interfaces/restaurant/menu/loading-spinner.types';

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gray-100/80 flex items-center justify-center z-50"
    >
      <motion.div
        animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        className="h-12 w-12 rounded-full border-4 border-[#6589f6] border-t-transparent"
      />
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-4 text-gray-700 font-medium"
      >
        Loading menu...
      </motion.p>
    </motion.div>
  );
};

export default LoadingSpinner;