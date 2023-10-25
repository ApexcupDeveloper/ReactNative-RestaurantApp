import React from 'react';
import {TouchableOpacity, View, StyleSheet, Image} from 'react-native';
import {Text, useTheme} from '@ui-kitten/components';
import {useDispatch, useSelector} from 'react-redux';
import {SET_LOADING} from '../redux/types';
import Toast from 'react-native-toast-message';
import {Spinner} from '../components/spinner';
import {forgotPassword} from '../redux/actions/auth';

export const MailSentScreen = ({navigation, route}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const loading = useSelector(state => state.auth.loading);

  const {mail} = route.params;

  const goClose = () => {
    navigation.navigate('Splash');
  };

  const goResend = () => {
    forgotPassword(dispatch, mail)
      .then(res => {
        dispatch({
          type: SET_LOADING,
          payload: false,
        });
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: `We sent the mail to ${mail}.`,
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
    <View style={{flex: 1, backgroundColor: theme['color-basic-300']}}>
      <Spinner visible={loading} />
      <View
        style={{
          flexDirection: 'row',
          height: 120,
          paddingTop: 50,
          paddingHorizontal: '5%',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View>
          <Text category="h4" style={{color: theme['color-basic-1000']}}>
            Mail Sent!
          </Text>
        </View>
      </View>
      <View style={{paddingHorizontal: '5%'}}>
        <Image
          source={require('../../assets/img/sent.png')}
          style={{
            height: 200,
            width: 200,
            resizeMode: 'contain',
            alignSelf: 'center',
          }}
        />
        <Text status="primary" category="h6">
          Please check your email and create new password.
        </Text>
        <Text appearance="hint" style={{marginTop: 50}}>
          Didn't receive the email?
        </Text>
        <TouchableOpacity onPress={goResend}>
          <Text
            status="primary"
            style={{textDecorationLine: 'underline', marginTop: 8}}>
            Resend
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={{
          backgroundColor: theme['color-danger-400'],
          height: 46,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginHorizontal: '5%',
          borderRadius: 23,
          position: 'absolute',
          bottom: 60,
          width: '90%',
        }}
        onPress={goClose}>
        <Text style={{fontWeight: 'bold'}}>Close</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  underlineStyleBase: {
    width: 60,
    height: 60,
    borderRadius: 6,
    fontSize: 20,
    fontWeight: 'bold',
  },
});
