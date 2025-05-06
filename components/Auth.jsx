import React from 'react'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const Auth = ({ getPasswords,setsignin }) => {
    return (
        <div>
            <GoogleOAuthProvider clientId="520524262396-ccmad5s1v76cpe5ehu2s7242l4go98a2.apps.googleusercontent.com">
                <GoogleLogin
                    onSuccess= {credentialResponse => {
                        const token = credentialResponse.credential;
                        getPasswords(token)
                        setsignin(true)

                    }}
                    onError={() => {
                        console.log('Login Failed');
                    }}
                />
            </GoogleOAuthProvider>
        </div>
    )
}

export default Auth
