import React from 'react';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import {
  Button,
  Text,
  Layout,
  useTheme,
  Icon,
  Input,
} from '@ui-kitten/components';
import {validateEmail} from '../utils/validateEmail';
import Toast from 'react-native-toast-message';
import {Spinner} from '../components/spinner';
import {login} from '../redux/actions/auth';
import {useDispatch, useSelector} from 'react-redux';
import {SET_AUTH, SET_LOADING, SET_TOKEN, SET_USER} from '../redux/types';
import AntDesign from 'react-native-vector-icons/AntDesign';

export const SigninScreen = ({navigation}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const loading = useSelector(state => state.auth.loading);
  const [mail, setMail] = React.useState('');
  const [mailBorder, setMailBorder] = React.useState(theme['color-basic-600']);
  const [password, setPassword] = React.useState('');
  const [passwordBorder, setPasswordBorder] = React.useState(
    theme['color-basic-600'],
  );

  const goBack = () => {
    navigation.goBack();
  };

  const goSignup = () => {
    navigation.navigate('Signup');
  };

  const goVerify = () => {
    if (phone) {
      navigation.navigate('Verify', {phone: phone});
    }
  };

  const goForgot = () => {
    navigation.navigate('Forgot');
  };

  const goSignin = () => {
    if (!validateEmail(mail)) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Email is not valid.',
      });
      return;
    }
    if (!password) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Password could not be empty.',
      });
      return;
    }
    login(dispatch, {
      email: mail,
      password: password,
    })
      .then(res => {
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
        dispatch({
          type: SET_AUTH,
          payload: true,
        });
      })
      .catch(err => {
        dispatch({
          type: SET_LOADING,
          payload: false,
        });
        if (err === 'U') {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'User is not exist. Please sign up.',
          });
        } else {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: err,
          });
        }
      });
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
            value={mail}
            label="Email"
            placeholder="test@mail.com"
            keyboardType="email-address"
            style={{borderColor: mailBorder, marginVertical: 10}}
            onFocus={() => {
              setMailBorder(theme['color-basic-100']);
            }}
            onBlur={() => {
              setMailBorder(theme['color-basic-600']);
            }}
            onChangeText={nextValue => setMail(nextValue)}
          />
          <Input
            value={password}
            label="Password"
            placeholder="******"
            secureTextEntry
            style={{borderColor: passwordBorder, marginVertical: 10}}
            onFocus={() => {
              setPasswordBorder(theme['color-basic-100']);
            }}
            onBlur={() => {
              setPasswordBorder(theme['color-basic-600']);
            }}
            onChangeText={nextValue => setPassword(nextValue)}
          />
          <TouchableOpacity
            style={{alignSelf: 'flex-end', marginTop: 5}}
            onPress={goForgot}>
            <Text style={{fontSize: 14, color: theme['color-basic-500']}}>
              Forgot Password?
            </Text>
          </TouchableOpacity>
        </Layout>
        <Button style={styles.button} status="success" onPress={goSignin}>
          Sign In
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
