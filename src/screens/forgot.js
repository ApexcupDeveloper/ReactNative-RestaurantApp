import React, { useState } from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Text, useTheme, Input } from '@ui-kitten/components';
import { useDispatch, useSelector } from 'react-redux';
import { SET_LOADING } from '../redux/types';
import Toast from 'react-native-toast-message';
import { forgotPassword } from '../redux/actions/auth';
import { Spinner } from '../components/spinner';
import { validateEmail } from '../utils/validateEmail';
import AntDesign from 'react-native-vector-icons/AntDesign';

export const ForgotScreen = ({ navigation }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const loading = useSelector(state => state.auth.loading);
  const [mail, setMail] = useState('');
  const [mailBorder, setMailBorder] = useState(theme["color-basic-600"])

  const goBack = () => {
    navigation.goBack();
  };

  const goSend = () => {
    if (!validateEmail(mail)) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Email is not valid.'
      });
      return
    }
    forgotPassword(dispatch, mail)
      .then((res) => {
        dispatch({
          type: SET_LOADING,
          payload: false
        });
        navigation.navigate("Sent", { mail })
      })
      .catch((err) => {
        dispatch({
          type: SET_LOADING,
          payload: false
        })
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: err
        });
      })
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme["color-basic-300"] }}>
      <Spinner visible={loading} />
      <View style={{ flexDirection: 'row', height: 120, paddingTop: 50, paddingHorizontal: '5%', alignItems: 'center', justifyContent: 'space-between' }}>
        <TouchableOpacity style={{ height: 40, width: 40, marginTop: 10 }} onPress={goBack}>
          {
            <AntDesign name='arrowleft' size={26} color={theme['color-basic-1000']} />
          }
        </TouchableOpacity>
        <View>
          <Text category="h4" style={{ color: theme["color-basic-1000"] }}>Forgot Password?</Text>
        </View>
        <TouchableOpacity style={{ height: 40, width: 40 }}></TouchableOpacity>
      </View>
      <View style={{ paddingHorizontal: '5%', paddingTop: 70 }}>
        <Text status='primary' category='h6' >We will email you a link to reset your password.</Text>
        <View style={{ marginTop: 30 }}>
          <Input
            value={mail}
            label='Email'
            placeholder='test@mail.com'
            keyboardType='email-address'
            style={{ borderColor: mailBorder, marginVertical: 10, backgroundColor: theme["color-basic-300"] }}
            textStyle={{
              color: theme["color-primary-500"]
            }}
            onFocus={() => { setMailBorder(theme["color-primary-500"]) }}
            onBlur={() => { setMailBorder(theme["color-basic-600"]) }}
            onChangeText={nextValue => setMail(nextValue)}
          />
        </View>
      </View>
      <TouchableOpacity style={{ backgroundColor: theme["color-success-500"], height: 46, display: 'flex', alignItems: 'center', justifyContent: 'center', marginHorizontal: '5%', borderRadius: 23, position: 'absolute', bottom: 60, width: '90%' }}
        onPress={goSend}
      >
        <Text style={{ fontWeight: 'bold' }}>Send Link</Text>
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
    fontWeight: 'bold'
  },
})