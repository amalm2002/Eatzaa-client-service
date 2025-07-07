import { GoogleLogin } from '@react-oauth/google';
import { toast } from 'react-toastify';
import { GoogleSigninButtonProps } from '../../../interfaces/user/authentication/register/google-signin.types';

const GoogleSigninButton = ({ googleSignIn }: GoogleSigninButtonProps) => {
  return (
    <>
      <div className="text-center my-4 text-gray-500">OR SIGN IN WITH</div>
      <div className="flex justify-center items-center mt-5 w-full">
        <GoogleLogin shape="circle" ux_mode="popup" onSuccess={googleSignIn} onError={() => toast.error('Google login failed.')} />
      </div>
    </>
  );
};

export default GoogleSigninButton;