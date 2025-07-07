import { SocialSignupButtonsProps } from "../../../interfaces/user/authentication/login/social-signup-button.types";

const SocialSignupButtons = ({ onGoogleClick, onFacebookClick }: SocialSignupButtonsProps) => {
  return (
    <>
      <div className="text-center my-4 text-[rgb(60,110,113)]/80">OR SIGN UP WITH</div>
      <div className="flex space-x-4 justify-center">
        <button
          onClick={onGoogleClick}
          className="w-1/2 bg-white border py-2 rounded-lg flex items-center justify-center shadow hover:bg-[rgb(60,110,113)]/10"
        >
          <img
            src="https://img.icons8.com/color/24/google-logo.png"
            alt="Google"
            className="mr-2"
          />
          Google
        </button>
        <button
          onClick={onFacebookClick}
          className="w-1/2 bg-white border py-2 rounded-lg flex items-center justify-center shadow hover:bg-[rgb(60,110,113)]/10"
        >
          <img
            src="https://img.icons8.com/color/24/facebook.png"
            alt="Facebook"
            className="mr-2"
          />
          Facebook
        </button>
      </div>
    </>
  );
};

export default SocialSignupButtons;