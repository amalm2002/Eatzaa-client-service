import { CredentialResponse } from '@react-oauth/google';


export interface GoogleSigninButtonProps {
    googleSignIn: (data: CredentialResponse) => void;
}