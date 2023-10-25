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
import {getDistance} from '../utils/getDistance';
import {useDispatch, useSelector} from 'react-redux';
import {makeShort} from '../utils/makeShort';
import {getLeftDays} from '../utils/getLeftDays';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FastImage from 'react-native-fast-image';
import {ASSET_URL} from '../api/constant';
import {addFavorite, getVendors, removeFavorite} from '../redux/actions/data';
import Toast from 'react-native-toast-message';
import {
  SET_CATEGORY,
  SET_DATA_LOADING,
  SET_DEAL,
  SET_USER_DEAL,
  SET_USER_GIFTCARD,
  SET_USER_REWARD,
  SET_USER_STAMP,
  SET_VENDOR,
} from '../redux/types';
import {Spinner} from '../components/spinner';
import Share from 'react-native-share';

export const DealDetailScreen = ({navigation, route}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const coordinate = useSelector(state => state.auth.location);
  const loading = useSelector(state => state.data.loading);
  const token = useSelector(state => state.auth.token);
  const [errorImage, setErrorImage] = useState(false);
  const [errorAvatar, setErrorAvatar] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [action, setAction] = useState('redeem');
  const [hide, setHide] = useState(false);

  const {deal, vendor} = route.params;
  const myVendor = deal?.vendor ?? vendor;

  useEffect(() => {
    if (deal && deal.is_favorite_status) {
      setFavorite(true);
    } else {
      setFavorite(false);
    }
  }, [deal]);

  // useEffect(() => {
  //   if (deal) {
  //     checkAction(dispatch, {
  //       type: 'deal',
  //       id: deal.id
  //     }).then((res) => {
  //       setAction(res.action)
  //       dispatch({
  //         type: SET_DATA_LOADING,
  //         payload: false
  //       })
  //     }).catch((err) => {
  //       dispatch({
  //         type: SET_DATA_LOADING,
  //         payload: false
  //       })
  //       Toast.show({
  //         type: 'error',
  //         text1: 'Error',
  //         text2: err
  //       });
  //     })
  //   }
  // }, [deal])

  const goBack = () => {
    navigation.goBack();
  };

  const goVendor = () => {
    navigation.navigate('RestaurantDetail', {
      vendor: myVendor,
    });
  };

  const goCollect = () => {
    navigation.navigate('Collect', {
      type: 'deal',
      id: deal.id,
      title: deal.title,
      description: deal.description,
      action: action,
    });
  };

  const goFavorite = () => {
    if (loading) {
      return;
    }
    if (favorite) {
      dispatch({
        type: SET_DATA_LOADING,
        payload: true,
      });
      removeFavorite(
        {
          type: 'deal',
          entity_id: deal.id,
        },
        token,
      )
        .then(res => {
          // getData();
          dispatch({
            type: SET_DATA_LOADING,
            payload: false,
          });
          setFavorite(false);
        })
        .catch(err => {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: err,
          });
          dispatch({
            type: SET_DATA_LOADING,
            payload: false,
          });
        });
    } else {
      dispatch({
        type: SET_DATA_LOADING,
        payload: true,
      });
      addFavorite(
        {
          type: 'deal',
          entity_id: deal.id,
        },
        token,
      )
        .then(res => {
          // getData();
          setFavorite(true);
          dispatch({
            type: SET_DATA_LOADING,
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
            type: SET_DATA_LOADING,
            payload: false,
          });
        });
    }
  };

  const onShare = () => {
    const shareOptions = {
      title: `Share ${myVendor.name}`,
      message:
        deal.title +
        ' - ' +
        myVendor.name +
        '\n' +
        'PHONE : ' +
        myVendor.phone +
        '\n' +
        'ADDRESS : ' +
        myVendor.address +
        '\n\n' +
        deal.description,
      url: myVendor.website,
      filename: myVendor.name, // only for base64 file in Android
    };
    Share.open(shareOptions)
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        err && console.log(err);
      });
  };

  return (
    <>
      <TouchableOpacity
        style={[
          styles.iconContainer,
          {
            right: '5%',
            position: 'absolute',
            zIndex: 1000,
            top: Platform.OS === 'ios' ? 50 : 30,
            elevation: 6,
          },
        ]}
        onPress={goBack}>
        <AntIcon name="close" size={24} color={theme['color-danger-500']} />
      </TouchableOpacity>
      <ScrollView style={{flex: 1}}>
        <Spinner visible={loading} />
        <View style={{width: '100%', zIndex: 1}}>
          <FastImage
            source={
              !errorImage
                ? {uri: ASSET_URL.replace('{TYPE}', 'deals') + deal.main_image}
                : require('../../assets/img/place-image1.png')
            }
            style={{width: '100%', height: 250}}
            resizeMode="cover"
            onError={() => {
              setErrorImage(true);
            }}
          />
          <View style={styles.toolbar}>
            <TouchableOpacity
              style={[styles.iconContainer, {backgroundColor: 'transparent'}]}
              onPress={goFavorite}>
              <AntIcon
                name="heart"
                size={24}
                color={favorite ? theme['color-danger-500'] : '#E0E0E0'}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              position: 'absolute',
              top: 180,
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 20,
              backgroundColor: 'white',
              right: '5%',
            }}>
            <Text category="c2" style={{color: theme['color-basic-1000']}}>
              {getDistance(
                coordinate?.latitude,
                coordinate?.longitude,
                myVendor?.latitude,
                myVendor?.longitude,
              )}
            </Text>
          </View>
          <View
            style={{
              position: 'absolute',
              top: 237,
              flexDirection: 'row',
              right: '5%',
              zIndex: 10,
            }}>
            <View
              style={[
                styles.priceContainer,
                {backgroundColor: theme['color-primary-500']},
              ]}>
              <Text category="p2" style={{textDecorationLine: 'line-through'}}>
                {deal.crossed_price} kr.
              </Text>
              <Text category="p1" style={{fontWeight: 'bold', marginLeft: 5}}>
                {deal.price} kr.
              </Text>
            </View>
            <View
              style={[
                styles.priceContainer,
                {backgroundColor: 'white', marginLeft: 15},
              ]}>
              <Text
                category="p1"
                style={{color: theme['color-danger-500'], fontWeight: 'bold'}}>
                {deal.discount}% off
              </Text>
            </View>
          </View>
          <View style={styles.infoContainer}>
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
                          ASSET_URL.replace('{TYPE}', 'deals') +
                          deal.listing_image,
                      }
                    : require('../../assets/img/place-avatar.png')
                }
                style={{width: 40, height: 40, borderRadius: 20}}
              />
              <View style={{display: 'flex', flexDirection: 'column'}}>
                <Text
                  category="h5"
                  style={{color: theme['color-basic-1000'], marginLeft: 5}}>
                  {makeShort(myVendor?.name, 20)}
                </Text>
                <Text
                  category="c2"
                  style={{
                    color: theme['color-basic-700'],
                    marginLeft: 5,
                    fontSize: 17,
                  }}>
                  {makeShort(deal.title, 36)}
                </Text>
              </View>
            </Pressable>
            <Text status="primary">{deal.description}</Text>
          </View>
          <TouchableOpacity
            style={[
              styles.shareContainer,
              {
                backgroundColor: theme['color-warning-500'],
                borderColor: theme['color-primary-500'],
              },
            ]}
            onPress={onShare}>
            <Entypo name="share" size={24} color={theme['color-primary-500']} />
          </TouchableOpacity>
        </View>
        <Pressable
          style={styles.termsContainer}
          onPress={() => {
            setHide(prev => !prev);
          }}>
          <View style={{padding: 15, paddingVertical: 25}}>
            <Text status="primary" category="h6">
              Terms and Conditions
            </Text>
            {!hide && (
              <Text status="primary" style={{marginTop: 5}}>
                Information about goods and services on the Website is based on
                material provided by third party businesses('Vendors').
              </Text>
            )}
          </View>
          {!hide && (
            <>
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
                <Text appearance="hint">
                  {getLeftDays(deal.expiry_date)} days left
                </Text>
              </View>
            </>
          )}
        </Pressable>
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
              {myVendor?.address}
            </Text>
          </View>
          <View style={{height: 200, width: '100%'}}>
            <MapView
              style={{flex: 1, borderRadius: 20}}
              initialRegion={{
                latitude: Number(myVendor?.latitude || 12.3453),
                longitude: Number(myVendor?.longitude || 23.342),
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}>
              <Marker
                coordinate={{
                  latitude: Number(myVendor?.latitude || 12.3453),
                  longitude: Number(myVendor?.longitude || 23.342),
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
          backgroundColor: theme['color-primary-500'],
          width: '90%',
          height: 46,
          borderRadius: 23,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={goCollect}>
        <Text>
          {action === 'redeem' ? 'Redeem the Deal' : 'Collect the Deal'}
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
    elevation: 10,
  },
  infoContainer: {
    paddingHorizontal: '7%',
    paddingVertical: 20,
    backgroundColor: 'white',
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.09,
    shadowRadius: 11,
    elevation: 10,
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
    elevation: 10,
    zIndex: 100,
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
});
