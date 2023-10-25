import React, {useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {SplashScreen} from '../screens/splash';
import {SigninScreen} from '../screens/signin';
import {VerifyScreen} from '../screens/verify';
import {SignupScreen} from '../screens/signup';
import {HomeNavigator} from './home_navigation';
import {ForgotScreen} from '../screens/forgot';
import {MailSentScreen} from '../screens/mail_sent';
import {SigninPhoneScreen} from '../screens/signin_phone';
import {useDispatch, useSelector} from 'react-redux';
import jwt_decode from 'jwt-decode';
import {SET_AUTH, SET_TOKEN} from '../redux/types';
import {HTTPS} from '../api/http';
import {SignupPhoneScreen} from '../screens/signup_phone';
import {BackHandler} from 'react-native';
import Toast from 'react-native-toast-message';
import {IntroScreen} from '../screens/intro';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {Navigator, Screen} = createStackNavigator();

export const RootNavigator = ({route, navigation}) => {
  const dispatch = useDispatch();
  const authed = useSelector(state => state.auth.authed);
  const token = useSelector(state => state.auth.token);
  const [intro, setIntro] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getIntro() {
      setLoading(true);
      const here = await AsyncStorage.getItem('intro');
      if (here === 'true') {
        setIntro(true);
      }
      setLoading(false);
    }
    getIntro();
  }, []);

  useEffect(() => {
    if (token) {
      var decoded = jwt_decode(token);
      if (decoded.exp < new Date().getTime() / 1000) {
        dispatch({
          type: SET_AUTH,
          payload: false,
        });
        dispatch({
          type: SET_TOKEN,
          payload: '',
        });
      } else {
        HTTPS.defaults.headers.common.Authorization = 'Bearer ' + token;
      }
    }
  }, [token]);

  useEffect(() => {
    let currentCount = 0;

    const backAction = () => {
      if (currentCount < 1) {
        currentCount += 1;
        Toast.show({
          type: 'error',
          text1: 'Confirm',
          text2: 'Please tap again to exit the app!',
        });
      } else {
        BackHandler.exitApp();
      }
      setTimeout(() => {
        currentCount = 0;
      }, 2000);

      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  if (loading) {
    return null;
  }

  return (
    <Navigator screenOptions={{headerShown: false}}>
      {authed && token ? (
        <Screen name="HomeNav" component={HomeNavigator} />
      ) : (
        <>
          {!intro && <Screen name="Intro" component={IntroScreen} />}
          <Screen name="Splash" component={SplashScreen} />
          <Screen name="Signin" component={SigninScreen} />
          <Screen name="SigninPhone" component={SigninPhoneScreen} />
          <Screen name="SignupPhone" component={SignupPhoneScreen} />
          <Screen name="Signup" component={SignupScreen} />
          <Screen name="Forgot" component={ForgotScreen} />
          <Screen name="Sent" component={MailSentScreen} />
          <Screen name="Verify" component={VerifyScreen} />
        </>
      )}
    </Navigator>
  );
};
