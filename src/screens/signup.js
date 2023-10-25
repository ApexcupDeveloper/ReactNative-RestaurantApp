import React, {useEffect, useRef} from 'react';
import {Image, Pressable, StyleSheet, Linking} from 'react-native';
import {Button, Text, Layout, useTheme, Input} from '@ui-kitten/components';
import InputScrollView from 'react-native-input-scroll-view';
import {validateEmail} from '../utils/validateEmail';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
import {register} from '../redux/actions/auth';
import {useDispatch, useSelector} from 'react-redux';
import {SET_LOADING, SET_TOKEN, SET_USER} from '../redux/types';
import {Spinner} from '../components/spinner';
import PhoneInput from 'react-native-phone-input';
import {TERMS_URL} from '../api/constant';
import {isNumber} from '../utils/checkNumber';
import {zipcodes} from '../utils/validateZipcode';

export const SignupScreen = ({navigation}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const _phoneRef = useRef();
  const loading = useSelector(state => state.auth.loading);
  const [phone, setPhone] = React.useState('');
  const [zip, setZip] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [first, setFirst] = React.useState('');
  const [last, setLast] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirm, setConfirm] = React.useState('');
  const [accept, setAccept] = React.useState(false);
  const [firstBorder, setFirstBorder] = React.useState(
    theme['color-basic-600'],
  );
  const [lastBorder, setLastBorder] = React.useState(theme['color-basic-600']);
  const [phoneBorder, setPhoneBorder] = React.useState(
    theme['color-basic-600'],
  );
  const [mailBorder, setMailBorder] = React.useState(theme['color-basic-600']);
  const [passBorder, setPassBorder] = React.useState(theme['color-basic-600']);
  const [confirmBorder, setConfirmBorder] = React.useState(
    theme['color-basic-600'],
  );
  const [zipBorder, setZipBorder] = React.useState(theme['color-basic-600']);

  const goBack = () => {
    navigation.goBack();
  };

  const goVerify = () => {
    if (!validateEmail(email)) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Eamil is not valid.',
      });
      return;
    }
    if (!first || !last) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please type your name correctly.',
      });
      return;
    }
    if (first.length > 15 || first.length < 2) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'First name length must be in between 2 and 15',
      });
      return;
    }
    if (last.length > 15 || last.length < 2) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Last name length must be in between 2 and 15',
      });
      return;
    }
    if (!password || !confirm) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Password could not be empty!',
      });
      return;
    }
    if (!phone) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please type your phone number',
      });
      return;
    }
    if (phone.length !== 8 || !isNumber(phone)) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Invalid phone number',
      });
      return;
    }
    if (!zip) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please type your zip code',
      });
      return;
    }
    if (zip.length !== 4) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Invalid zip code',
      });
      return;
    }
    if (!zipcodes.includes(Number(zip))) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Invalid zip code',
      });
      return;
    }
    if (password.length < 6) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Password length should be more than 6!',
      });
      return;
    }
    if (password !== confirm) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Password does not match!',
      });
      return;
    }

    if (!accept) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please read our terms of services and must appect it',
      });
      return;
    }

    register(dispatch, {
      email: email,
      first_name: first,
      last_name: last,
      password: password,
      phone: '+45' + phone,
      zip: zip,
    })
      .then(res => {
        dispatch({
          type: SET_LOADING,
          payload: false,
        });
        dispatch({
          type: SET_TOKEN,
          payload: res.token,
        });
        dispatch({
          type: SET_USER,
          payload: res,
        });
        navigation.navigate('Verify', {phone: phone, email: email});
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
    <Layout
      style={{
        flex: 1,
        backgroundColor: theme['color-primary-100'],
        flexDirection: 'column',
      }}>
      <Spinner visible={loading} />
      <InputScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
        <Layout
          style={[
            styles.container,
            {backgroundColor: theme['color-primary-default']},
          ]}>
          <Image
            source={require('../../assets/img/launch_logo.png')}
            style={{height: 46, resizeMode: 'contain', marginBottom: 30}}
          />
          <Layout style={{width: '80%', marginBottom: 30}}>
            <Input
              value={first}
              label="First name"
              placeholder="John"
              style={{borderColor: firstBorder, marginVertical: 8}}
              onFocus={() => {
                setFirstBorder(theme['color-basic-100']);
              }}
              onBlur={() => {
                setFirstBorder(theme['color-basic-600']);
              }}
              onChangeText={nextValue => setFirst(nextValue)}
            />
            <Input
              value={last}
              label="Last name"
              placeholder="Die"
              style={{borderColor: lastBorder, marginVertical: 8}}
              onFocus={() => {
                setLastBorder(theme['color-basic-100']);
              }}
              onBlur={() => {
                setLastBorder(theme['color-basic-600']);
              }}
              onChangeText={nextValue => setLast(nextValue)}
            />
            <Input
              value={email}
              label="Email"
              placeholder="test@mail.com"
              keyboardType="email-address"
              style={{borderColor: mailBorder, marginVertical: 8}}
              onFocus={() => {
                setMailBorder(theme['color-basic-100']);
              }}
              onBlur={() => {
                setMailBorder(theme['color-basic-600']);
              }}
              onChangeText={nextValue => setEmail(nextValue)}
            />
            <Input
              value={phone}
              label="Phone Number"
              placeholder="XXXXXXXX"
              keyboardType="number-pad"
              style={{borderColor: phoneBorder, marginVertical: 8}}
              onFocus={() => {
                setPhoneBorder(theme['color-basic-100']);
              }}
              onBlur={() => {
                setPhoneBorder(theme['color-basic-600']);
              }}
              onChangeText={nextValue => setPhone(nextValue)}
            />
            <Input
              value={zip}
              label="Zip Code"
              placeholder="12345"
              keyboardType="number-pad"
              style={{borderColor: zipBorder, marginVertical: 8}}
              onFocus={() => {
                setZipBorder(theme['color-basic-100']);
              }}
              onBlur={() => {
                setZipBorder(theme['color-basic-600']);
              }}
              onChangeText={nextValue => setZip(nextValue)}
            />
            {/* <Text style={{ marginVertical: 4, fontSize: 12, color: theme["color-basic-600"], fontWeight: 'bold' }}>Phone Number</Text>
                        <PhoneInput
                            ref={ref => _phoneRef}
                            initialCountry='us'
                            // autoFormat
                            style={{
                                width: '100%',
                                height: 40,
                                paddingHorizontal: 6,
                                borderRadius: 4,
                                borderColor: phoneBorder,
                                borderWidth: 1,
                                backgroundColor: 'transparent',

                            }}
                            textStyle={{
                                color: theme["color-basic-100"]
                            }}
                            onChangePhoneNumber={(displayValue, iso2) => {
                                setPhone(displayValue)
                            }}
                        /> */}
            <Input
              value={password}
              label="Password"
              placeholder="******"
              secureTextEntry
              style={{borderColor: passBorder, marginVertical: 8}}
              onFocus={() => {
                setPassBorder(theme['color-basic-100']);
              }}
              onBlur={() => {
                setPassBorder(theme['color-basic-600']);
              }}
              onChangeText={nextValue => setPassword(nextValue)}
            />
            <Input
              value={confirm}
              label="Confirm Password"
              placeholder="******"
              secureTextEntry
              style={{borderColor: confirmBorder, marginVertical: 8}}
              onFocus={() => {
                setConfirmBorder(theme['color-basic-100']);
              }}
              onBlur={() => {
                setConfirmBorder(theme['color-basic-600']);
              }}
              onChangeText={nextValue => setConfirm(nextValue)}
            />
          </Layout>
          <Button style={styles.button} status="success" onPress={goVerify}>
            Create Account
          </Button>
          <Button style={styles.button} status="basic" onPress={goBack}>
            Back
          </Button>
        </Layout>
        <Layout
          style={[
            styles.footer,
            {backgroundColor: theme['color-primary-100']},
          ]}>
          <Pressable
            onPress={() => {
              setAccept(prev => !prev);
            }}>
            <MaterialCommunityIcons
              name={
                accept ? 'checkbox-marked-outline' : 'checkbox-blank-outline'
              }
              color={theme['color-primary-500']}
              size={28}
              style={{marginRight: 4}}
            />
          </Pressable>
          <Text appearance="hint" style={{flexWrap: 'wrap', width: '84%'}}>
            By signing up you indicate that you have read and agreed to the
            <Text
              status="primary"
              style={{fontWeight: 'bold'}}
              onPress={() => {
                Linking.openURL(TERMS_URL);
              }}>
              {' '}
              Stambz Terms of Service
            </Text>
          </Text>
        </Layout>
      </InputScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingTop: 80,
    paddingBottom: 30,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 80,
    marginTop: 20,
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
