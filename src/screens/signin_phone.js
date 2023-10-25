import React, {useEffect, useState} from 'react';
import {Image, Platform, StyleSheet} from 'react-native';
import {Button, Text, Layout, useTheme, Input} from '@ui-kitten/components';
import Toast from 'react-native-toast-message';
import {Spinner} from '../components/spinner';
import {loginPhone, verifyLoginPhone} from '../redux/actions/auth';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import {useDispatch, useSelector} from 'react-redux';
import {SET_AUTH, SET_LOADING, SET_TOKEN, SET_USER} from '../redux/types';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useOtpVerify} from 'react-native-otp-verify';

export const SigninPhoneScreen = ({navigation}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const loading = useSelector(state => state.auth.loading);
  const [phone, setPhone] = React.useState('');
  const [manuOtp, setManuOtp] = React.useState('');
  const [phoneBorder, setPhoneBorder] = React.useState(
    theme['color-basic-600'],
  );
  const [showVerify, setShowVerify] = React.useState(false);
  const {hash, otp} = useOtpVerify({numberOfDigits: 4});

  useEffect(() => {
    if (otp && otp.length === 4) {
      setManuOtp(otp);
      goVerify(otp);
    }
  }, [otp]);

  const goBack = () => {
    navigation.goBack();
  };

  const goSignup = () => {
    navigation.navigate('Signup');
  };

  const goVerify = code => {
    verifyLoginPhone(dispatch, {phone: '+45' + phone, otp_code: code})
      .then(res => {
        dispatch({
          type: SET_LOADING,
          payload: false,
        });
        dispatch({
          type: SET_USER,
          payload: res,
        });
        if (!res.first_name || !res.last_name || !res.email || !res.zip) {
          navigation.navigate('SignupPhone');
        } else {
          dispatch({
            type: SET_TOKEN,
            payload: res.token,
          });

          dispatch({
            type: SET_AUTH,
            payload: true,
          });
        }
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

  const goSignin = () => {
    if (phone.length !== 8) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Invalid phone number',
      });
      return;
    }
    if (showVerify) {
      goVerify(otp);
    } else {
      loginPhone(dispatch, {
        phone: '+45' + phone,
        hash: Platform.OS === 'ios' ? '' : hash[0],
      })
        .then(res => {
          setShowVerify(true);
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
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: err,
          });
          dispatch({
            type: SET_LOADING,
            payload: false,
          });
        });
    }
  };

  const ArrowIcon = props => (
    <AntDesign name="arrowright" size={26} color={theme['color-danger-500']} />
  );

  return (
    <Layout style={{flex: 1, backgroundColor: theme['color-primary-100']}}>
      <Spinner visible={loading} />
      <Layout
        style={[
          styles.container,
          {backgroundColor: theme['color-primary-default']},
        ]}>
        <Image
          source={require('../../assets/img/launch_logo.png')}
          style={{height: 46, resizeMode: 'contain', marginBottom: 80}}
        />
        <Layout style={{width: '80%', marginBottom: 50}}>
          <Input
            value={phone}
            label="Phone Number"
            placeholder="XXXXXXXX"
            keyboardType="number-pad"
            style={{borderColor: phoneBorder, marginVertical: 10}}
            onFocus={() => {
              setPhoneBorder(theme['color-basic-100']);
            }}
            onBlur={() => {
              setPhoneBorder(theme['color-basic-600']);
            }}
            onChangeText={nextValue => setPhone(nextValue)}
          />
          {showVerify && (
            <OTPInputView
              style={{height: 80}}
              pinCount={4}
              code={manuOtp}
              onCodeChanged={code => {
                setManuOtp(code);
              }}
              keyboardType="number-pad"
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
          )}
        </Layout>
        <Button style={styles.button} status="success" onPress={goSignin}>
          {!showVerify ? 'Continue' : 'Verify'}
        </Button>
        <Button style={styles.button} status="basic" onPress={goBack}>
          Back
        </Button>
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
    borderRadius: 24,
    marginVertical: 5,
  },
  captionContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  captionIcon: {
    width: 10,
    height: 10,
    marginRight: 5,
  },
  captionText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#8F9BB3',
  },
});
