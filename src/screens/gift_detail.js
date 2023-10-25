import React, {useEffect, useState} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Pressable,
} from 'react-native';
import {Button, Text, useTheme} from '@ui-kitten/components';
import AntIcon from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import MapView, {Marker} from 'react-native-maps';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FastImage from 'react-native-fast-image';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {ASSET_URL} from '../api/constant';
import {useDispatch, useSelector} from 'react-redux';
import {getDistance} from '../utils/getDistance';
import {SET_DATA_LOADING} from '../redux/types';
import {checkAction} from '../redux/actions/data';
import Toast from 'react-native-toast-message';

export const GiftDetailScreen = ({navigation, route}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const {gift, vendor} = route.params;
  const coordinate = useSelector(state => state.auth.location);
  const token = useSelector(state => state.auth.token);
  const [action, setAction] = useState('purchase');
  const [errorImage, setErrorImage] = useState(false);
  const [errorAvatar, setErrorAvatar] = useState(false);
  const [total, setTotal] = useState(0);
  const [used, setUsed] = useState(0);

  useEffect(() => {
    if (gift) {
      setTotal(gift.items);
      setUsed(gift.used_count);
      checkAction(
        dispatch,
        {
          type: 'gift_card',
          id: gift.id,
        },
        token,
      )
        .then(res => {
          setAction(res.action);
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
  }, [gift]);

  const goBack = () => {
    navigation.goBack();
  };

  const goVendor = () => {
    navigation.navigate('RestaurantDetail', {
      vendor: vendor,
    });
  };

  const goCollect = () => {
    navigation.navigate('Collect', {
      type: 'gift_card',
      id: gift.id,
      title: gift.title,
      description: gift.description,
      action: action,
    });
  };
  // console.log("gift : ", gift)
  return (
    <>
      <View style={styles.toolbar}>
        <TouchableOpacity></TouchableOpacity>
        <TouchableOpacity style={styles.iconContainer} onPress={goBack}>
          <AntIcon name="close" size={24} color={theme['color-danger-500']} />
        </TouchableOpacity>
      </View>
      <ScrollView style={{flex: 1}}>
        <View style={{width: '100%', zIndex: 1}}>
          <FastImage
            source={
              !errorImage
                ? {
                    uri:
                      ASSET_URL.replace('{TYPE}', 'gift-cards') +
                      gift.main_image,
                  }
                : require('../../assets/img/place-image1.png')
            }
            style={{width: '100%', height: 250}}
            resizeMode="cover"
            onError={() => {
              setErrorImage(true);
            }}
          />
          <View
            style={{
              position: 'absolute',
              top: 200,
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 20,
              backgroundColor: 'white',
              right: '5%',
            }}>
            <Text category="c2" style={{color: theme['color-basic-1000']}}>
              {getDistance(
                coordinate.latitude,
                coordinate.longitude,
                vendor.latitude,
                vendor.longitude,
              )}
            </Text>
          </View>
          <View
            style={{
              position: 'absolute',
              bottom: 47,
              flexDirection: 'row',
              right: '5%',
              zIndex: 10,
            }}>
            <View
              style={[
                styles.priceContainer,
                {backgroundColor: theme['color-warning-500']},
              ]}>
              <Text
                category="p2"
                status="primary"
                style={{textDecorationLine: 'line-through'}}>
                {gift.crossed_price} kr.
              </Text>
              <Text
                category="p1"
                status="primary"
                style={{fontWeight: 'bold', marginLeft: 5}}>
                {gift.price} kr.
              </Text>
            </View>
          </View>
          <View
            style={[
              styles.infoContainer,
              {backgroundColor: theme['color-primary-500']},
            ]}>
            <Pressable
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 10,
              }}
              onPress={goVendor}>
              <Image
                source={
                  !errorAvatar
                    ? {
                        uri:
                          ASSET_URL.replace('{TYPE}', 'vendors') + vendor.logo,
                      }
                    : require('../../assets/img/place-avatar.png')
                }
                style={{width: 30, height: 30, borderRadius: 15}}
                onError={() => {
                  setErrorAvatar(true);
                }}
              />
              <View>
                <Text
                  category="h6"
                  style={{color: theme['color-basic-100'], marginLeft: 5}}>
                  {gift.title}
                </Text>
                {/* <Text category='c2' style={{ color: theme["color-basic-100"], marginLeft: 5, fontSize: 17 }}>{gift.title}</Text> */}
              </View>
            </Pressable>
            <Text status="primary" style={{color: theme['color-basic-100']}}>
              {gift.description}
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.shareContainer,
              {
                backgroundColor: theme['color-warning-500'],
                borderColor: theme['color-primary-500'],
              },
            ]}>
            <Entypo name="share" size={24} color={theme['color-primary-500']} />
          </TouchableOpacity>
        </View>
        <View style={styles.termsContainer}>
          <View style={{padding: 15, paddingVertical: 25}}>
            <Text status="primary" category="h6">
              Terms and Conditions
            </Text>
            <Text status="primary" style={{marginTop: 5}}>
              Information about goods and services on the Website is based on
              material provided by third party businesses('Vendors').
            </Text>
          </View>
          <View
            style={{
              borderStyle: 'dashed',
              borderWidth: 0.5,
              borderColor: theme['color-primary-300'],
              marginVertical: 10,
            }}
          />
          <View
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              paddingBottom: 20,
              paddingTop: 10,
            }}>
            <Text appearance="hint">Valid: {gift.expiry_date}</Text>
          </View>
        </View>
        <View style={styles.stampContainer}>
          <Text status="primary" category="h6">
            Available Items
          </Text>
          <View
            style={{flexDirection: 'row', alignItems: 'center', marginTop: 20}}>
            {new Array(total).fill({}).map((item, i) => {
              if (used === 0) {
                return (
                  <Ionicons
                    key={i}
                    name="pricetag"
                    size={24}
                    color={theme['color-basic-400']}
                    style={{marginHorizontal: 5}}
                  />
                );
              } else {
                return (
                  <Ionicons
                    key={i}
                    name="pricetag"
                    size={24}
                    color={
                      new Array(total).fill({}).length - i - 1 <= used - 1
                        ? theme['color-basic-400']
                        : theme['color-warning-600']
                    }
                    style={{marginHorizontal: 5}}
                  />
                );
              }
            })}
          </View>
        </View>
        <LinearGradient
          colors={['#FFFFFF', '#FFFFFF00']}
          style={styles.mapContainer}>
          <View
            style={{
              paddingVertical: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text status="primary" category="p2" style={{fontWeight: 'bold'}}>
              {vendor.address}
            </Text>
          </View>
          <View style={{height: 200, width: '100%'}}>
            <MapView
              style={{flex: 1, borderRadius: 20}}
              initialRegion={{
                latitude: Number(vendor.latitude),
                longitude: Number(vendor.longitude),
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}>
              <Marker
                coordinate={{
                  latitude: Number(vendor.latitude),
                  longitude: Number(vendor.longitude),
                }}
                onPress={e => {}}>
                <FontAwesome5
                  name="map-marker-alt"
                  size={36}
                  color={theme['color-primary-500']}
                />
              </Marker>
            </MapView>
          </View>
        </LinearGradient>
        <View style={{height: 150}} />
      </ScrollView>
      <TouchableOpacity
        style={{
          marginHorizontal: '5%',
          position: 'absolute',
          bottom: 30,
          backgroundColor:
            action === 'purchase'
              ? theme['color-success-500']
              : theme['color-primary-500'],
          width: '90%',
          height: 46,
          borderRadius: 23,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={goCollect}>
        <Text>
          {action === 'purchase' ? 'Purchase Gift Card' : 'Redeem Gift Card'}
        </Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  toolbar: {
    flexDirection: 'row',
    paddingHorizontal: '5%',
    justifyContent: 'space-between',
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    width: '100%',
    zIndex: 1000,
  },
  iconContainer: {
    height: 40,
    width: 40,
    borderRadius: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 6,
  },
  priceContainer: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
  infoContainer: {
    paddingHorizontal: '7%',
    paddingVertical: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.09,
    shadowRadius: 11,
  },
  shareContainer: {
    height: 40,
    width: 40,
    borderRadius: 20,
    borderWidth: 2,
    position: 'absolute',
    bottom: -20,
    right: '5%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
  termsContainer: {
    backgroundColor: 'white',
    marginHorizontal: '5%',
    zIndex: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.09,
    shadowRadius: 11,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingHorizontal: 10,
  },
  mapContainer: {
    marginTop: 20,
    marginHorizontal: '5%',
    borderRadius: 20,
    backgroundColor: 'white',
    height: 240,
  },
  stampContainer: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.09,
    shadowRadius: 11,
    backgroundColor: 'white',
    marginHorizontal: '5%',
    marginTop: 20,
    padding: 20,
    alignItems: 'center',
    borderRadius: 20,
  },
});
