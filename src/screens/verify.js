import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {
  Divider,
  Layout,
  Text,
  TopNavigation,
  TopNavigationAction,
  useTheme,
  Button,
} from '@ui-kitten/components';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import {setAuthToken, verifyOtp} from '../redux/actions/auth';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useDispatch, useSelector} from 'react-redux';
import {SET_AUTH, SET_LOADING, SET_TOKEN} from '../redux/types';
import Toast from 'react-native-toast-message';
import {Spinner} from '../components/spinner';

const BackIcon = props => (
  <AntDesign name="arrowleft" size={24} color={'#FFFFFF'} />
);

export const VerifyScreen = ({navigation, route}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const loading = useSelector(state => state.auth.loading);
  const authed = useSelector(state => state.auth.authed);
  const token = useSelector(state => state.auth.token);
  const [otp, setOTP] = useState('');
  const {phone, email} = route.params;

  useEffect(() => {
    if (authed && token) {
      console.log('token : ', token);
      setAuthToken(token);
      navigation.navigate('HomeNav');
    }
  }, [authed, token]);

  const navigateBack = () => {
    navigation.goBack();
  };

  const goVerify = code => {
    if (code) {
      verifyOtp(dispatch, {
        email: email,
        otp_code: code,
      })
        .then(res => {
          console.log('res ; ', res);
          dispatch({
            type: SET_LOADING,
            payload: false,
          });
          dispatch({
            type: SET_AUTH,
            payload: true,
          });
        })
        .catch(err => {
          console.log('err : ', err);
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
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please input opt code.',
      });
    }
  };

  const BackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={navigateBack} />
  );

  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: theme['color-primary-default']}}>
      <Spinner visible={loading} />
      <TopNavigation
        title={e => <Text category="h5">Verify OTP</Text>}
        alignment="center"
        accessoryLeft={BackAction}
      />
      <Divider />
      <Layout style={{flex: 1, paddingHorizontal: '10%', marginTop: 50}}>
        <Text category="s1">We sent the 4-digits code to +45{phone}.</Text>
        <OTPInputView
          style={{height: 80}}
          pinCount={4}
          code={otp}
          onCodeChanged={code => {
            setOTP(code);
          }}
          autoFocusOnLoad
          codeInputFieldStyle={[
            styles.underlineStyleBase,
            {borderColor: theme['color-basic-500']},
          ]}
          codeInputHighlightStyle={{borderColor: theme['color-basic-100']}}
          onCodeFilled={code => {
            goVerify(code);
          }}
        />
        {/* <Layout style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
          <Text appearance='hint' >Didn't receive the code?</Text>
          <Button onPress={() => goVerify(otp)}>Resend</Button>
        </Layout> */}
        <Button
          status="success"
          onPress={() => goVerify(otp)}
          style={{marginTop: 20}}>
          Confirm
        </Button>
      </Layout>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  borderStyleBase: {
    width: 30,
    height: 45,
  },

  borderStyleHighLighted: {
    borderColor: '#03DAC6',
  },

  underlineStyleBase: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderRadius: 6,
    color: 'white',
  },

  underlineStyleHighLighted: {
    borderColor: '#03DAC6',
  },
});
