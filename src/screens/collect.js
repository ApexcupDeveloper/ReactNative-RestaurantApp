import React, {useEffect, useState} from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  Platform,
  ScrollView,
} from 'react-native';
import {Text, useTheme} from '@ui-kitten/components';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import {
  getHistory,
  getTransaction,
  startTransaction,
} from '../redux/actions/data';
import {useDispatch, useSelector} from 'react-redux';
import {SET_DATA_LOADING} from '../redux/types';
import Toast from 'react-native-toast-message';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {makeShort} from '../utils/makeShort';
import {Spinner} from '../components/spinner';

export const CollectScreen = ({navigation, route}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [showCode, setShowCode] = useState(false);
  const [otp, setOTP] = useState('');
  const [history, setHistory] = useState([]);
  const [total, setTotal] = useState(0);
  const [load, setLoad] = useState(false);
  const loading = useSelector(state => state.data.loading);
  const token = useSelector(state => state.auth.token);
  const [transId, setTransId] = useState();

  const {type, id, title, description, action} = route.params;

  useEffect(() => {
    if (type && action) {
      getHistory(
        dispatch,
        {
          type,
          action,
          stamp_entity_id: id,
        },
        token,
      )
        .then(res => {
          setHistory(res.history);
          setTotal(res.total);
          dispatch({
            type: SET_DATA_LOADING,
            payload: false,
          });
        })
        .catch(err => {
          dispatch({
            type: SET_DATA_LOADING,
            payload: false,
          });
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: err,
          });
        });
    }
  }, [type, action]);

  useEffect(() => {
    if (transId) {
      let interval = setInterval(() => {
        getTransactionData();
      }, 3000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [transId]);

  useEffect(() => {
    if (load) {
      let interval = setInterval(() => {
        setLoad(false);
        setTransId(null);
        dispatch({
          type: SET_DATA_LOADING,
          payload: false,
        });
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Timeout! Please try again.',
        });
      }, 90000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [load]);

  const goBack = () => {
    navigation.goBack();
  };

  const goQRcode = () => {
    navigation.navigate('QrCodeScreen', {type, action, id});
  };

  const goTransaction = code => {
    if (!load) {
      setLoad(true);
      startTransaction(
        dispatch,
        {
          type: type,
          stamp_id: id,
          small_code: code,
          action: action,
        },
        token,
      )
        .then(res => {
          setTransId(res.id);
        })
        .catch(err => {
          setLoad(false);
          dispatch({
            type: SET_DATA_LOADING,
            payload: false,
          });
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: err,
          });
        });
    }
  };

  const getTransactionData = () => {
    getTransaction(dispatch, {transaction_id: transId}, token)
      .then(res => {
        if (res?.transaction?.status === 1) {
          setLoad(false);
          setTransId(null);
          dispatch({
            type: SET_DATA_LOADING,
            payload: false,
          });
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'Transaction approved!',
          });
          navigation.navigate('Congratulations', {
            type,
            action,
            quantity: res?.transaction?.quantity,
            full:
              res?.transaction?.total_count === res?.transaction?.used_count,
          });
        } else if (res?.transaction?.status === 4) {
          setLoad(false);
          setTransId(null);
          dispatch({
            type: SET_DATA_LOADING,
            payload: false,
          });
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Transaction declined!',
          });
          navigation.goBack();
        }
      })
      .catch(err => {
        setLoad(false);
        dispatch({
          type: SET_DATA_LOADING,
          payload: false,
        });
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: err,
        });
      });
  };

  const getHeader = () => {
    if (type === 'stamp' && action === 'collect') {
      return 'Collect Stamps';
    } else if (type === 'gift_card' && action === 'purchase') {
      return 'Purchase Gift Card';
    } else if (type === 'gift_card' && action === 'redeem') {
      return 'Redeem Gift Card';
    } else if (type === 'deal' && action === 'redeem') {
      return 'Redeem Deal';
    } else if (type === 'stamp' && action === 'redeem') {
      return 'Redeem Stamp';
    } else {
      return 'Collect';
    }
  };

  const getBackground = () => {
    if (type === 'stamp') {
      return theme['color-primary-500'];
    } else if (type === 'gift_card') {
      return theme['color-danger-500'];
    } else if (type === 'reward') {
      return theme['color-primary-300'];
    } else {
      return theme['color-warning-600'];
    }
  };

  return (
    <>
      <ScrollView style={{flex: 1, backgroundColor: getBackground()}}>
        <Spinner visible={load} />
        <View
          style={{
            flexDirection: 'row',
            height: Platform.OS === 'ios' ? 120 : 100,
            paddingTop: Platform.OS === 'ios' ? 50 : 30,
            paddingHorizontal: '5%',
          }}>
          <TouchableOpacity
            style={{height: 40, width: 40, marginTop: 3}}
            onPress={goBack}>
            <AntDesign
              name="arrowleft"
              size={26}
              color={
                type === 'deal'
                  ? theme['color-basic-1000']
                  : theme['color-basic-100']
              }
            />
          </TouchableOpacity>
          <View>
            <Text
              category="h4"
              style={{
                color:
                  type === 'deal'
                    ? theme['color-basic-1000']
                    : theme['color-warning-500'],
              }}>
              {getHeader()}
            </Text>
          </View>
        </View>
        <View style={{paddingHorizontal: '5%'}}>
          <View
            style={{
              backgroundColor: theme['color-basic-200'],
              borderRadius: 14,
              padding: 20,
            }}>
            <Text
              style={{color: 'black', fontWeight: 'bold', marginBottom: 10}}>
              {title}
            </Text>
            <Text status="primary" category="p1">
              {makeShort(description, 240)}
            </Text>
            <View
              style={{
                marginTop: 20,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  color: theme['color-primary-500'],
                  fontSize: 16,
                  fontWeight: 'bold',
                }}>
                History
              </Text>
              <Text
                style={{
                  color: theme['color-primary-500'],
                  fontSize: 16,
                  fontWeight: 'bold',
                }}>
                {history.length} / {total}
              </Text>
            </View>
            <View
              style={{
                marginTop: 10,
                backgroundColor: theme['color-warning-500'],
                padding: 20,
                borderRadius: 10,
              }}>
              {history.map((item, index) => (
                <Text
                  key={index}
                  style={{
                    color: theme['color-primary-500'],
                    fontSize: 16,
                    marginTop: 3,
                  }}>
                  #{item.id} - {item.updated_at} - {item.used_count}/
                  {item.total_count ? item.total_count : 'Unlimit'}
                </Text>
              ))}
            </View>
          </View>
          {showCode && (
            <View
              style={{
                backgroundColor: 'white',
                padding: 20,
                borderRadius: 14,
                marginTop: 20,
              }}>
              <Text
                status="primary"
                style={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  marginBottom: 10,
                }}>
                Enter Code
              </Text>
              <OTPInputView
                style={{height: 80}}
                pinCount={4}
                code={otp}
                autoFocusOnLoad={false}
                keyboardType="number-pad"
                onCodeChanged={code => {
                  setOTP(code);
                }}
                codeInputFieldStyle={[
                  styles.underlineStyleBase,
                  {
                    color: theme['color-primary-500'],
                    backgroundColor: theme['color-warning-500'],
                  },
                ]}
                codeInputHighlightStyle={{
                  borderColor: theme['color-basic-100'],
                }}
                onCodeFilled={code => {
                  goTransaction(code);
                }}
              />
            </View>
          )}
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: 'white',
              borderRadius: 20,
              alignSelf: 'flex-end',
              paddingHorizontal: 10,
              paddingVertical: 4,
              marginTop: 20,
            }}
            onPress={() => {
              if (showCode) {
                goQRcode();
              } else {
                setShowCode(true);
              }
            }}>
            <Text category="c2">
              {showCode ? 'Scan QR Code' : 'Enter Code'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {!showCode && (
        <TouchableOpacity
          style={{
            backgroundColor: theme['color-success-500'],
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
          onPress={goQRcode}>
          <Text style={{fontWeight: 'bold'}}>Scan QR code</Text>
        </TouchableOpacity>
      )}
    </>
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
