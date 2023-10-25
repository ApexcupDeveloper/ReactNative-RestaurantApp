import React, {useEffect} from 'react';
import {Image, Platform, StyleSheet} from 'react-native';
import {Button, Text, Layout, useTheme} from '@ui-kitten/components';
import AntIcon from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
  appleLogin,
  facebookLogin,
  googleLogin,
  setAuthToken,
} from '../redux/actions/auth';
import {useDispatch, useSelector} from 'react-redux';
import {SET_AUTH, SET_LOADING, SET_TOKEN, SET_USER} from '../redux/types';
import Toast from 'react-native-toast-message';
import {Spinner} from '../components/spinner';
import RemotePushController from '../utils/RemotePushController';
import {PERMISSIONS, request} from 'react-native-permissions';

export const SplashScreen = ({navigation}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const authed = useSelector(state => state.auth.authed);
  const user = useSelector(state => state.auth.user);
  const loading = useSelector(state => state.auth.loading);
  const token = useSelector(state => state.auth.token);

  useEffect(() => {
    dispatch({
      type: SET_LOADING,
      payload: false,
    });
    if (token) {
      setAuthToken(token);
    }
  }, [token]);

  useEffect(() => {
    request(
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    );
  }, []);

  useEffect(() => {
    if (authed && token) {
      navigation.navigate('HomeNav');
    } else {
      // if(user && user.is_activated === 0) {
      //     navigation.navigate("Verify", { email: user.email, phone: user.phone })
      // }
    }
  }, [authed, user, token]);

  const goSignin = () => {
    navigation.navigate('Signin');
  };

  const goSignup = () => {
    navigation.navigate('Signup');
  };

  const goPhoneSign = () => {
    navigation.navigate('SigninPhone');
  };

  const ArrowIcon = props => (
    <AntIcon name="arrowright" size={20} color={theme['color-danger-500']} />
  );

  const EmailIcon = props => (
    <MaterialCommunityIcons
      name="email"
      size={20}
      color={theme['color-danger-500']}
    />
  );

  const PhoneIcon = props => (
    <FontAwesome name="phone" size={20} color={'#c97e0f'} />
  );

  const AppleIcon = props => (
    <AntIcon name="apple1" size={20} color={'#000000'} />
  );

  const GoogleIcon = props => (
    <AntIcon name="google" size={20} color={theme['color-primary-500']} />
  );

  const FacebookIcon = props => (
    <AntIcon name="facebook-square" size={20} color={'#4267B2'} />
  );

  const onApple = () => {
    appleLogin(dispatch)
      .then(res => {
        dispatch({
          type: SET_AUTH,
          payload: true,
        });
        dispatch({
          type: SET_USER,
          payload: res,
        });
        dispatch({
          type: SET_TOKEN,
          payload: res.token,
        });
        dispatch({
          type: SET_LOADING,
          payload: false,
        });
      })
      .catch(err => {
        dispatch({
          type: SET_LOADING,
          payload: false,
        });
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: err,
        });
      });
  };

  const onFacebook = () => {
    facebookLogin(dispatch)
      .then(res => {
        dispatch({
          type: SET_AUTH,
          payload: true,
        });
        dispatch({
          type: SET_USER,
          payload: res,
        });
        dispatch({
          type: SET_TOKEN,
          payload: res.token,
        });
        dispatch({
          type: SET_LOADING,
          payload: false,
        });
      })
      .catch(err => {
        dispatch({
          type: SET_LOADING,
          payload: false,
        });
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: err,
        });
      });
  };

  const goGoogle = () => {
    googleLogin(dispatch)
      .then(res => {
        dispatch({
          type: SET_AUTH,
          payload: true,
        });
        dispatch({
          type: SET_USER,
          payload: res,
        });
        dispatch({
          type: SET_TOKEN,
          payload: res.token,
        });
        dispatch({
          type: SET_LOADING,
          payload: false,
        });
      })
      .catch(err => {
        dispatch({
          type: SET_LOADING,
          payload: false,
        });
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: err,
        });
      });
  };

  return (
    <Layout style={{flex: 1, backgroundColor: theme['color-primary-100']}}>
      <Spinner visible={loading} />
      <RemotePushController navigation={navigation} />
      <Layout
        style={[
          styles.container,
          {backgroundColor: theme['color-primary-default']},
        ]}>
        <Image
          source={require('../../assets/img/welcome_logo.png')}
          style={{height: 280, resizeMode: 'contain', marginBottom: 40}}
        />
        <Button
          style={styles.button}
          appearance="ghost"
          status="danger"
          accessoryLeft={EmailIcon}
          onPress={goSignin}>
          Sign in with Email
        </Button>
        <Button
          style={styles.button}
          appearance="ghost"
          accessoryLeft={PhoneIcon}
          onPress={goPhoneSign}>
          {evaPros => (
            <Text
              {...evaPros}
              style={{
                color: '#c97e0f',
                fontWeight: 'bold',
                marginLeft: 20,
                fontSize: 14,
              }}>
              Sign in with Phone
            </Text>
          )}
        </Button>
        {Platform.OS === 'ios' && (
          <Button
            style={styles.button}
            appearance="ghost"
            accessoryLeft={AppleIcon}
            onPress={onApple}>
            {evaPros => (
              <Text
                {...evaPros}
                style={{
                  color: '#000000',
                  fontWeight: 'bold',
                  marginLeft: 20,
                  fontSize: 14,
                }}>
                Sign in with Apple
              </Text>
            )}
          </Button>
        )}
        {Platform.OS === 'android' && (
          <Button
            style={styles.button}
            appearance="ghost"
            status="primary"
            accessoryLeft={GoogleIcon}
            onPress={goGoogle}>
            Sign in with Google
          </Button>
        )}
        {/* <Button
          style={styles.button}
          appearance="ghost"
          accessoryLeft={FacebookIcon}
          onPress={onFacebook}>
          {evaPros => (
            <Text
              {...evaPros}
              style={{
                color: '#4267B2',
                fontWeight: 'bold',
                marginLeft: 20,
                fontSize: 14,
              }}>
              Sign in with Facebook
            </Text>
          )}
        </Button> */}
      </Layout>
      <Layout
        style={[styles.footer, {backgroundColor: theme['color-primary-100']}]}>
        <Text appearance="hint">Don't have an account?</Text>
        <Button
          appearance="ghost"
          accessoryRight={ArrowIcon}
          onPress={goSignup}>
          Sign Up
        </Button>
      </Layout>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingTop: 50,
  },
  footer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  button: {
    height: 48,
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 24,
    marginVertical: 5,
  },
});
