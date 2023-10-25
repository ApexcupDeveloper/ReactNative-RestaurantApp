import {appleAuth} from '@invertase/react-native-apple-authentication';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {LoginManager, AccessToken} from 'react-native-fbsdk-next';
import {handleError} from '../../api/handleError';
import {HTTPS} from '../../api/http';
import {SET_LOADING} from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

GoogleSignin.configure({
  webClientId:
    '476078263302-vqcbgs50vqabsh36df879f733d4enhuu.apps.googleusercontent.com',
  offlineAccess: true,
  scopes: ['profile', 'email'],
});

export const setAuthToken = async token => {
  if (token) {
    await AsyncStorage.setItem('token', token);
  }
};

export const appleLogin = dispatch =>
  new Promise(async (resolve, reject) => {
    dispatch({
      type: SET_LOADING,
      payload: true,
    });

    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      if (!appleAuthRequestResponse.identityToken) {
        reject('Apple signin failed.');
      }
      const credentialState = await appleAuth.getCredentialStateForUser(
        appleAuthRequestResponse.user,
      );

      if (credentialState === appleAuth.State.AUTHORIZED) {
        const {identityToken, nonce} = appleAuthRequestResponse;

        HTTPS.post('/sociallogin/apple', {
          access_token: identityToken,
        })
          .then(res => {
            setAuthToken(res.data.token);
            resolve(res.data);
          })
          .catch(err => {
            reject(handleError(err));
          });
      } else {
        reject('Apple signin failed.');
      }
    } catch (err) {
      reject(handleError(err));
    }
  });

export const googleLogin = dispatch =>
  new Promise(async (resolve, reject) => {
    dispatch({
      type: SET_LOADING,
      payload: true,
    });
    try {
      await GoogleSignin.hasPlayServices();
      const {idToken} = await GoogleSignin.signIn();
      HTTPS.post('/sociallogin/google', {
        access_token: idToken,
      })
        .then(res => {
          dispatch({
            type: SET_LOADING,
            payload: false,
          });
          setAuthToken(res.data.token);
          resolve(res.data);
        })
        .catch(err => {
          dispatch({
            type: SET_LOADING,
            payload: false,
          });
          reject(handleError(err));
        });
    } catch (error) {
      dispatch({
        type: SET_LOADING,
        payload: false,
      });
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        reject('User canceled the signin');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        reject('Google signin is already in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        reject('Google play service is not available');
      } else {
        reject('Internet connection failed, Please try again!');
      }
    }
  });

export const facebookLogin = dispatch =>
  new Promise(async (resolve, reject) => {
    dispatch({
      type: SET_LOADING,
      payload: true,
    });

    try {
      await LoginManager.logInWithPermissions(['public_profile', 'email'])
        .then(async result => {
          if (result.isCancelled) {
            reject('User cancelled the login.');
          } else {
            AccessToken.getCurrentAccessToken().then(data => {
              HTTPS.post('/sociallogin/facebook', {
                access_token: data.accessToken,
              })
                .then(res => {
                  setAuthToken(res.data.token);
                  resolve(res.data);
                })
                .catch(err => {
                  reject(handleError(err));
                });
            });
          }
        })
        .catch(err => {
          reject(handleError(err));
        });
    } catch (err) {
      reject(handleError(err));
    }
  });

export const register = (dispatch, data) =>
  new Promise((resolve, reject) => {
    dispatch({
      type: SET_LOADING,
      payload: true,
    });

    HTTPS.post('/register', {
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      password: data.password,
      phone: data.phone,
      zip: data.zip,
    })
      .then(res => {
        setAuthToken(res.data.token);
        resolve(res.data);
      })
      .catch(err => {
        reject(handleError(err));
      });
  });

export const login = (dispatch, data) =>
  new Promise((resolve, reject) => {
    dispatch({
      type: SET_LOADING,
      payload: true,
    });

    HTTPS.post('/login', {
      email: data.email,
      password: data.password,
    })
      .then(res => {
        setAuthToken(res.data.token);
        resolve(res.data);
      })
      .catch(err => {
        reject(handleError(err));
      });
  });

export const forgotPassword = (dispatch, email) =>
  new Promise((resolve, reject) => {
    dispatch({
      type: SET_LOADING,
      payload: true,
    });

    HTTPS.post('/forgot_password', {
      email: email,
    })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(handleError(err));
      });
  });

export const verifyOtp = (dispatch, data) =>
  new Promise((resolve, reject) => {
    dispatch({
      type: SET_LOADING,
      payload: true,
    });

    HTTPS.post('/verify-account-otp', {
      email: data.email,
      otp_code: data.otp_code,
    })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(handleError(err));
      });
  });

export const loginPhone = (dispatch, data) =>
  new Promise((resolve, reject) => {
    dispatch({
      type: SET_LOADING,
      payload: true,
    });

    HTTPS.post('/loginPhoneOnly', {
      phone: data.phone,
      hash: data.hash,
    })
      .then(res => {
        setAuthToken(res.data.token);
        resolve(res.data);
      })
      .catch(err => {
        reject(handleError(err));
      });
  });

export const verifyLoginPhone = (dispatch, data) =>
  new Promise((resolve, reject) => {
    dispatch({
      type: SET_LOADING,
      payload: true,
    });
    HTTPS.post('/verify-account-otp-phone-only', {
      phone: data.phone,
      otp_code: data.otp_code,
    })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(handleError(err));
      });
  });
