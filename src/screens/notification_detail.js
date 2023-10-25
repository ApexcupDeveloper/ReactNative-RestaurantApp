import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Image,
  TouchableOpacity,
  View,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import {Text, useTheme} from '@ui-kitten/components';
import {useDispatch, useSelector} from 'react-redux';
import Toast from 'react-native-toast-message';
import {NOTI_URL} from '../api/constant';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import RenderHtml from 'react-native-render-html';
import {updateNotification} from '../redux/actions/data';
import {SET_DATA_LOADING} from '../redux/types';
import {Spinner} from '../components/spinner';
import AntDesign from 'react-native-vector-icons/AntDesign';

const WIDTH = Dimensions.get('screen').width * 0.9;

export const NotificationDetailScreen = ({navigation, route}) => {
  const theme = useTheme();
  const {notification} = route.params;
  const dispatch = useDispatch();
  const loading = useSelector(state => state.data.loading);
  const token = useSelector(state => state.auth.token);
  const [errorAvatar, setErrorAvatar] = useState(false);
  const [errorImage, setErrorImage] = useState(false);
  const AVATAR = require('../../assets/img/avatar.png');
  const PLACEIMAGE = require('../../assets/img/place-image1.png');

  useEffect(() => {
    if (notification) {
      updateNotification(
        dispatch,
        {
          notification_id: notification.id,
        },
        token,
      )
        .then(res => {
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
        });
    }
  }, [notification]);

  const goRemove = () => {
    updateNotification(
      dispatch,
      {
        notification_id: notification.id,
        action: 'delete',
      },
      token,
    )
      .then(res => {
        navigation.goBack();
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
  };

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <View style={{flex: 1, backgroundColor: theme['color-basic-300']}}>
      <View
        style={{
          backgroundColor: theme['color-danger-500'],
          paddingHorizontal: '5%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: Platform.OS === 'ios' ? 100 : 80,
          paddingTop: Platform.OS === 'ios' ? 30 : 10,
        }}>
        <TouchableOpacity
          style={{
            height: 40,
            width: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={goBack}>
          {
            <AntDesign
              name="arrowleft"
              size={26}
              color={theme['color-basic-100']}
            />
          }
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            height: 40,
            width: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={goRemove}>
          <FontAwesome5 name="trash" color={'white'} size={20} />
        </TouchableOpacity>
      </View>
      <Spinner visible={loading} />
      <View style={{marginTop: -30, alignItems: 'center'}}>
        <Image
          source={
            !errorAvatar
              ? {uri: NOTI_URL + notification.notification_type.logo}
              : AVATAR
          }
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            resizeMode: 'cover',
            backgroundColor: theme['color-danger-500'],
          }}
          onError={() => {
            setErrorAvatar(true);
          }}
        />
      </View>
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: theme['color-basic-300'],
          paddingHorizontal: '5%',
          marginTop: 30,
        }}>
        <Text category="h3" style={{color: theme['color-basic-1000']}}>
          {notification.notification_type.title}
        </Text>
        <Text
          category="p2"
          style={{color: theme['color-basic-500'], marginTop: 4}}>
          {notification.updated_at}
        </Text>
        <Image
          source={
            !errorImage
              ? {uri: NOTI_URL + notification.notification_type.image}
              : PLACEIMAGE
          }
          style={{
            width: '100%',
            height: 170,
            resizeMode: 'cover',
            borderRadius: 10,
            marginTop: 20,
          }}
          onError={() => {
            setErrorImage(true);
          }}
        />
        <View style={{marginTop: 30}}>
          <RenderHtml
            // originWhitelist={['*']}
            source={{html: notification.notification_type.description}}
            // style={{
            //   width: '100%',
            // }}
            contentWidth={WIDTH}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  readNotiContainer: {
    backgroundColor: 'white',
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    width: '100%',
  },
  unreadNotiContainer: {
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    width: '100%',
  },
  notiBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
  recMarker: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#939393',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 1,
  },
  cardView: {
    display: 'flex',
    position: 'absolute',
    bottom: 30,
    paddingLeft: 10,
  },
  card: {
    height: 150,
    width: 260,
    flexDirection: 'column',
    backgroundColor: 'white',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#939393',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 1,
    marginRight: 20,
    borderRadius: 10,
  },
  online: {
    height: 8,
    width: 8,
    borderRadius: 4,
    marginLeft: 6,
  },
  distance: {
    position: 'absolute',
    right: 10,
    top: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
});
