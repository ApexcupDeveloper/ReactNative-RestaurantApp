import React, {useCallback, useEffect, useState} from 'react';
import {TouchableOpacity, View, Dimensions, Platform} from 'react-native';
import {Text, Icon, Layout, useTheme} from '@ui-kitten/components';
// import { RNCamera } from 'react-native-camera';
// import {CameraScreen} from 'react-native-camera-kit';
import {request, PERMISSIONS} from 'react-native-permissions';
import QrCodeMask from 'react-native-qrcode-mask';
import {getTransaction, startTransaction} from '../redux/actions/data';
import {useDispatch, useSelector} from 'react-redux';
import Toast from 'react-native-toast-message';
import {SET_DATA_LOADING} from '../redux/types';
import {Spinner} from '../components/spinner';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from 'react-native-vision-camera';

const {width} = Dimensions.get('window');

export const QrCodeScreen = ({navigation, route}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [hasPermission, setHasPermission] = useState(false);
  const loading = useSelector(state => state.data.loading);
  const token = useSelector(state => state.auth.token);
  const [transId, setTransId] = useState();
  const [load, setLoad] = useState(false);
  const device = useCameraDevice('back');
  const [barcode, setBarcode] = useState('');
  const {type, id, action} = route.params;

  useEffect(() => {
    (async () => {
      request(
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.CAMERA
          : PERMISSIONS.ANDROID.CAMERA,
      ).then(result => {
        if (result === 'granted') {
          setHasPermission(true);
        } else {
          console.log(result);
        }
      });
    })();
  }, []);

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
    if (barcode && !load) {
      setLoad(true);
      goTransaction();
    }
  }, [barcode]);

  useEffect(() => {
    let interval = setInterval(() => {
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
      setLoad(false);
    }, 90000);

    return () => {
      clearInterval(interval);
    };
  }, [dispatch]);

  const goBack = () => {
    navigation.goBack();
  };

  const goTransaction = () => {
    startTransaction(
      dispatch,
      {
        type: type,
        stamp_id: id,
        qr_code: barcode,
        action: action,
      },
      token,
    )
      .then(res => {
        setTransId(res.id);
        setBarcode('');
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
        setLoad(false);
        setBarcode('');
      });
  };

  const getTransactionData = () => {
    getTransaction(dispatch, {transaction_id: transId}, token)
      .then(res => {
        if (res?.transaction?.status === 1) {
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
          setLoad(false);
          setBarcode('');
          navigation.navigate('Congratulations', {
            type,
            action,
            quantity: res?.transaction?.quantity,
            full:
              res?.transaction?.total_count === res?.transaction?.used_count,
          });
        } else if (res?.transaction?.status === 4) {
          setTransId(null);
          setBarcode('');
          dispatch({
            type: SET_DATA_LOADING,
            payload: false,
          });
          setLoad(false);
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Transaction declined!',
          });
          navigation.goBack();
        }
      })
      .catch(err => {
        dispatch({
          type: SET_DATA_LOADING,
          payload: false,
        });
        setTransId(null);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: err,
        });
        setBarcode('');
        setLoad(false);
      });
  };

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: codes => {
      if (!loading && !load) {
        if (codes && codes.length > 0) {
          // goTransaction(codes[0].value);
          setBarcode(codes[0].value);
        }
      }
    },
  });

  return (
    <View style={{flex: 1}}>
      <Spinner visible={loading} />
      {hasPermission && (
        <>
          <Camera
            style={{
              width: '100%',
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              display: 'flex',
            }}
            codeScanner={codeScanner}
            device={device}
            isActive={true}
          />
          <View
            style={{
              flex: 1,
              width: '100%',
              height: '100%',
              position: 'absolute',
            }}>
            <QrCodeMask
              lineDirection="vertical"
              height={width * 0.7}
              width={width * 0.7}
              overlayOpacity={0.7}
              edgeColor={load ? 'green' : 'red'}
              topTitle={
                load ? 'Scan successed!' : 'Please the QR code inside area...'
              }
              topTitleStyle={{
                marginBottom: 10,
              }}
            />
            <View
              style={{
                flexDirection: 'row',
                height: 120,
                paddingTop: 50,
                paddingHorizontal: '5%',
                zIndex: 1000,
              }}>
              <TouchableOpacity
                style={{height: 40, width: 40, marginTop: 3}}
                onPress={goBack}>
                {
                  <AntDesign
                    name="arrowleft"
                    size={26}
                    color={theme['color-basic-100']}
                  />
                }
              </TouchableOpacity>
              <View>
                <Text category="h4" style={{color: theme['color-basic-100']}}>
                  QR Scanning
                </Text>
              </View>
            </View>
          </View>
        </>
      )}
    </View>
  );
};
