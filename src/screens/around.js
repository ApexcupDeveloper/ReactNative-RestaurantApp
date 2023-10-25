import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Animated,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {Button, Text, Layout, useTheme} from '@ui-kitten/components';
import FeatherIcon from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import MapView, {Marker} from 'react-native-maps';
import {useDispatch, useSelector} from 'react-redux';
import {MapCard} from '../components/mapCard';
import {API_GOOGLE_MAP} from '../api/constant';
import {
  SET_CATEGORY,
  SET_DATA_LOADING,
  SET_DEAL,
  SET_FAVORITE,
  SET_GIFTCARD,
  SET_LOCATION,
  SET_REWARD,
  SET_USER_DEAL,
  SET_USER_GIFTCARD,
  SET_USER_REWARD,
  SET_USER_STAMP,
  SET_VENDOR,
} from '../redux/types';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import {handleError} from '../api/handleError';
import {getVendors} from '../redux/actions/data';
import {Spinner} from '../components/spinner';
import Geolocation from 'react-native-geolocation-service';

export const AroundmeScreen = ({navigation}) => {
  const theme = useTheme();
  const ref = React.useRef(null);
  const _map = React.useRef(null);
  const _scrollView = React.useRef(null);
  const dispatch = useDispatch();
  const vendors = useSelector(state => state.data.vendors);
  const coordinate = useSelector(state => state.auth.location);
  const loading = useSelector(state => state.data.loading);
  const token = useSelector(state => state.auth.token);
  const [address, setAddress] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState({
    latitude: Number(vendors[0]?.latitude || coordinate.latitude),
    longitude: Number(vendors[0]?.longitude || coordinate.longitude),
  });

  let mapIndex = 0;
  let mapAnimations = new Animated.Value(0);

  useEffect(() => {
    if (coordinate) {
      ref.current?.setAddressText(coordinate.address);
    }
  }, [coordinate]);

  useEffect(() => {
    if (address) {
      axios
        .request({
          method: 'post',
          url: `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${API_GOOGLE_MAP}`,
        })
        .then(response => {
          ref.current?.setAddressText(address);
          dispatch({
            type: SET_LOCATION,
            payload: {
              latitude: response.data.results[0].geometry.location.lat,
              longitude: response.data.results[0].geometry.location.lng,
              address: address,
            },
          });
        })
        .catch(err => {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: handleError(err),
          });
        });
    }
  }, [address]);

  useEffect(() => {
    getVendors(
      dispatch,
      {
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
      },
      token,
    )
      .then(res => {
        dispatch({
          type: SET_VENDOR,
          payload: res.vendors,
        });
        dispatch({
          type: SET_DEAL,
          payload: res.deals,
        });
        dispatch({
          type: SET_CATEGORY,
          payload: res.categories,
        });
        dispatch({
          type: SET_GIFTCARD,
          payload: res.gift_cards,
        });

        dispatch({
          type: SET_REWARD,
          payload: res.rewards,
        });
        dispatch({
          type: SET_FAVORITE,
          payload: res.favorites,
        });
        dispatch({
          type: SET_USER_DEAL,
          payload: res.all_user_deals,
        });
        dispatch({
          type: SET_USER_REWARD,
          payload: res.all_user_rewards,
        });
        dispatch({
          type: SET_USER_STAMP,
          payload: res.all_user_stamps,
        });
        dispatch({
          type: SET_USER_GIFTCARD,
          payload: res.all_user_gift_cards,
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
  }, [coordinate]);

  useEffect(() => {
    mapAnimations.addListener(({value}) => {
      let index = Math.floor(value / 260);

      if (index >= vendors.length) {
        index = vendors.length - 1;
      }
      if (index <= 0) {
        index = 0;
      }

      if (mapIndex !== index) {
        mapIndex = index;
        const latitude = Number(vendors[index].latitude);
        const longitude = Number(vendors[index].longitude);
        _map.current.animateToRegion(
          {
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.00922,
            longitudeDelta: 0.00421,
          },
          280,
        );
      }
    });
  });

  const useMylocation = () => {
    ref.current?.setAddressText('');
    Geolocation.getCurrentPosition(info => {
      dispatch({
        type: SET_LOCATION,
        payload: {
          latitude: info.coords.latitude,
          longitude: info.coords.longitude,
          address: '',
        },
      });
    });
  };

  const onMarkerPress = (e, location) => {
    // const markerId = e._targetInst.return.key;
    const markerId = e;
    let x = markerId * 260 + markerId * 20;
    setSelectedLocation(location);
    _scrollView.current.scrollTo({
      x: x,
      y: 0,
      animated: true,
    });
  };

  const goBack = () => {
    navigation.goBack();
  };

  const goRestaurantDetail = vendor => {
    navigation.navigate('RestaurantDetail', {vendor});
  };

  const getRandomColor = index => {
    var randomColor =
      '#' + Math.floor(((index + 1) % 10) * 1677900).toString(16);
    return randomColor;
  };

  return (
    <View style={{flex: 1}}>
      <Spinner visible={loading} />
      <Layout
        style={{
          backgroundColor: theme['color-basic-300'],
          paddingHorizontal: '5%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          height: Platform.OS === 'ios' ? 100 : 80,
          paddingTop: Platform.OS === 'ios' ? 50 : 30,
        }}>
        <Text category="h4" style={{color: theme['color-basic-1000']}}>
          Around Me
        </Text>
      </Layout>
      <Layout style={{flex: 1}}>
        <Layout
          style={{
            paddingVertical: 0,
            paddingHorizontal: 20,
            backgroundColor: 'transparent',
            position: 'absolute',
            top: 10,
            zIndex: 100,
            width: '100%',
          }}>
          <View
            style={[
              styles.searchBar,
              {backgroundColor: theme['color-basic-100'], marginVertical: 5},
            ]}>
            <GooglePlacesAutocomplete
              ref={ref}
              placeholder="Search"
              textInputProps={{
                placeholderTextColor: theme['color-basic-500'],
                returnKeyType: 'search',
              }}
              enablePoweredByContainer={false}
              onPress={(data, details = null) => {
                // 'details' is provided when fetchDetails = true
                setAddress(data.description);
              }}
              query={{
                key: API_GOOGLE_MAP,
                language: 'en',
              }}
              onFail={err => {
                console.log('err : ', err);
              }}
              renderLeftButton={() => (
                <View
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 5,
                  }}>
                  <FeatherIcon
                    name="search"
                    size={24}
                    color={theme['color-primary-500']}
                  />
                </View>
              )}
              renderRightButton={() => (
                <View
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginBottom: 5,
                  }}>
                  {ref.current?.getAddressText() ? (
                    <TouchableOpacity
                      style={{marginRight: 4}}
                      onPress={() => {
                        ref.current?.setAddressText('');
                        setAddress('');
                      }}>
                      <AntDesign
                        name="closecircle"
                        size={20}
                        color={theme['color-basic-500']}
                      />
                    </TouchableOpacity>
                  ) : null}
                  <TouchableOpacity
                    style={{marginRight: 10}}
                    onPress={useMylocation}>
                    <MaterialIcons
                      name="my-location"
                      size={24}
                      color={theme['color-danger-500']}
                    />
                  </TouchableOpacity>
                  <Button
                    status="primary"
                    size="tiny"
                    style={{borderRadius: 14, height: 28}}
                    onPress={goBack}>
                    List View
                  </Button>
                </View>
              )}
              styles={{
                container: {
                  paddingTop: 5,
                },
                textInputContainer: {
                  alignSelf: 'center',
                },
                textInput: {
                  color: theme['color-primary-500'],
                  fontWeight: 'bold',
                  backgroundColor: 'white',
                },
                description: {
                  color: 'gray',
                },
              }}
            />
          </View>
        </Layout>
        <MapView
          ref={_map}
          style={{flex: 1}}
          showsMyLocationButton
          mapType={'standard'}
          initialRegion={{
            latitude: Number(vendors[0]?.latitude || coordinate.latitude),
            longitude: Number(vendors[0]?.longitude || coordinate.longitude),
            latitudeDelta: 0.00922,
            longitudeDelta: 0.00421,
          }}
          // region={{
          //   latitude: selectedLocation.latitude,
          //   longitude: selectedLocation.longitude,
          //   latitudeDelta: 0.00922,
          //   longitudeDelta: 0.00421
          // }}
        >
          {vendors &&
            vendors.length > 0 &&
            vendors.map((vendor, index) => {
              return (
                <Marker
                  key={index}
                  coordinate={{
                    latitude: Number(vendor.latitude),
                    longitude: Number(vendor.longitude),
                  }}
                  onPress={e =>
                    onMarkerPress(index, {
                      latitude: Number(vendor.latitude),
                      longitude: Number(vendor.longitude),
                    })
                  }>
                  <Animated.View style={styles.recMarker}>
                    <FontAwesome5
                      name="map-marker-alt"
                      size={36}
                      color={getRandomColor(index)}
                    />
                  </Animated.View>
                </Marker>
              );
            })}
        </MapView>
        <Animated.ScrollView
          ref={_scrollView}
          horizontal
          scrollEventThrottle={1}
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          snapToInterval={280}
          snapToAlignment="start"
          style={styles.cardView}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {
                    x: mapAnimations,
                  },
                },
              },
            ],
            {useNativeDriver: true},
          )}>
          {vendors &&
            vendors.map((vendor, index) => {
              return (
                <MapCard
                  key={index}
                  {...vendor}
                  onPress={() => goRestaurantDetail(vendor)}
                />
              );
            })}
        </Animated.ScrollView>
      </Layout>
    </View>
  );
};

const styles = StyleSheet.create({
  notiButton: {
    height: 36,
    width: 36,
    borderRadius: 18,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notiBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    position: 'absolute',
    top: 2,
    right: 2,
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
