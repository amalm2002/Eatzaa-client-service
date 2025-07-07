import { DotLottieReact } from '@lottiefiles/dotlottie-react';

interface LoadingOverlayProps {
  isLoading: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-white/10 bg-opacity-70 z-50 flex justify-center items-center">
      <DotLottieReact
        src="https://lottie.host/bd840cf1-cbc4-4994-8017-ea078a96d274/ZsjzEesMkf.lottie"
        loop
        autoplay
      />
    </div>
  );
};

export default LoadingOverlay;