import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Image,
  TouchableOpacity,
  View,
  ScrollView,
  Platform,
} from 'react-native';
import {Text, Layout, useTheme} from '@ui-kitten/components';
import {useDispatch, useSelector} from 'react-redux';
import {getNotifications} from '../redux/actions/data';
import {SET_DATA_LOADING, SET_NOTIFICATION} from '../redux/types';
import Toast from 'react-native-toast-message';
import {NOTI_URL} from '../api/constant';
import {makeShort} from '../utils/makeShort';
import AntDesign from 'react-native-vector-icons/AntDesign';

export const NotificationScreen = ({navigation}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const notifications = useSelector(state => state.data.notifiations);
  const token = useSelector(state => state.auth.token);
  const [errorImage, setErrorImage] = useState([]);
  const AVATAR = require('../../assets/img/place-avatar.png');

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getNotifications(dispatch, token)
        .then(res => {
          // console.log("rs : ", res)
          dispatch({
            type: SET_NOTIFICATION,
            payload: res.notifications,
          });
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
    });

    return unsubscribe;
  }, [navigation]);

  const goBack = () => {
    navigation.goBack();
  };

  const goDetail = noti => {
    navigation.navigate('NotificationDetail', {notification: noti});
  };

  return (
    <View style={{flex: 1}}>
      <Layout
        style={{
          backgroundColor: theme['color-basic-300'],
          paddingHorizontal: '5%',
          flexDirection: 'row',
          height: Platform.OS === 'ios' ? 100 : 70,
          paddingTop: Platform.OS === 'ios' ? 50 : 30,
        }}>
        <TouchableOpacity
          style={{height: 40, width: 40, marginTop: 3}}
          onPress={goBack}>
          {
            <AntDesign
              name="arrowleft"
              size={26}
              color={theme['color-basic-1000']}
            />
          }
        </TouchableOpacity>
        <View>
          <Text category="h4" style={{color: theme['color-basic-1000']}}>
            Notifications
          </Text>
          <Text category="p2" status="primary">
            Stay up to date with all Stambz!
          </Text>
        </View>
      </Layout>
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: theme['color-basic-300'],
          paddingHorizontal: '5%',
          marginTop: 30,
        }}>
        {notifications &&
          notifications.map((noti, index) => {
            if (noti.status == 2) {
              return (
                <TouchableOpacity
                  style={[styles.readNotiContainer]}
                  key={index}
                  onPress={() => goDetail(noti)}>
                  <Image
                    source={
                      !errorImage.includes(index)
                        ? {uri: NOTI_URL + noti.notification_type.logo}
                        : AVATAR
                    }
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 25,
                      marginRight: 5,
                      resizeMode: 'cover',
                    }}
                    onError={() => {
                      let temp = errorImage;
                      temp.push(index);
                      setErrorImage(temp);
                    }}
                  />
                  <View style={{width: '80%'}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                      }}>
                      <Text
                        category="h6"
                        style={{color: theme['color-basic-600'], fontSize: 16}}>
                        {makeShort(noti.notification_type.title, 15)}
                      </Text>
                      <Text
                        style={{
                          color: theme['color-basic-500'],
                          fontStyle: 'italic',
                          fontSize: 12,
                        }}>
                        {noti.updated_at}
                      </Text>
                    </View>
                    <View style={{width: '100%'}}>
                      <Text
                        category="p2"
                        status="primary"
                        style={{marginTop: 5}}>
                        {makeShort(
                          noti.notification_type.short_description,
                          40,
                        )}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            } else if (noti.status === 3) {
              return null;
            } else {
              return (
                <TouchableOpacity
                  style={[
                    styles.unreadNotiContainer,
                    {backgroundColor: theme['color-primary-400']},
                  ]}
                  key={index}
                  onPress={() => goDetail(noti)}>
                  <View
                    style={[
                      styles.notiBadge,
                      {backgroundColor: theme['color-warning-500']},
                    ]}
                  />
                  <Image
                    source={
                      !errorImage.includes(index)
                        ? {uri: NOTI_URL + noti.notification_type.logo}
                        : AVATAR
                    }
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 25,
                      marginRight: 5,
                      resizeMode: 'cover',
                    }}
                    onError={() => {
                      let temp = errorImage;
                      temp.push(index);
                      setErrorImage(temp);
                    }}
                  />
                  <View style={{width: '80%'}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                      }}>
                      <Text
                        category="h6"
                        style={{color: theme['color-basic-100'], fontSize: 16}}>
                        {makeShort(noti.notification_type.title, 15)}
                      </Text>
                      <Text
                        style={{
                          color: theme['color-basic-500'],
                          fontStyle: 'italic',
                          fontSize: 12,
                        }}>
                        {noti.updated_at}
                      </Text>
                    </View>
                    <View style={{width: '100%'}}>
                      <Text
                        category="p2"
                        status="primary"
                        style={{marginTop: 5, color: theme['color-basic-100']}}>
                        {makeShort(
                          noti.notification_type.short_description,
                          40,
                        )}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }
          })}
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
