import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableOpacity,
  View,
  ScrollView,
  Platform,
  PermissionsAndroid,
  RefreshControl,
} from 'react-native';
import {Button, Layout, useTheme, Text} from '@ui-kitten/components';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import FeatherIcon from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Geolocation from 'react-native-geolocation-service';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {StambzCard} from '../components/card';
import {getVendors, updateNotiToken} from '../redux/actions/data';
import Toast from 'react-native-toast-message';
import {useDispatch, useSelector} from 'react-redux';
import {
  SET_CATEGORY,
  SET_DATA_LOADING,
  SET_DEAL,
  SET_LOCATION,
  SET_USER_DEAL,
  SET_USER_GIFTCARD,
  SET_USER_REWARD,
  SET_USER_STAMP,
  SET_VENDOR,
} from '../redux/types';
import {API_GOOGLE_MAP} from '../api/constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Geocoder from 'react-native-geocoding';
import {NoData} from '../components/noData';
import {HTTPS} from '../api/http';
import {handleError} from '../api/handleError';
import {setAuthToken} from '../redux/actions/auth';

Geocoder.init(API_GOOGLE_MAP);

export const HomeScreen = ({navigation, route}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const ref = useRef(null);
  const [selectedCategory, setSelectedCatory] = useState(null);
  const [visibleMenu, setVisibleMenu] = useState(false);
  const [address, setAddress] = useState(null);
  const [selectedCategoryId, setSelectedCatoryId] = useState(null);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const notifications = useSelector(state => state.data.notifiations);
  const loading = useSelector(state => state.data.loading);
  const token = useSelector(state => state.auth.token);
  const coordinate = useSelector(state => state.auth.location);
  const vendors = useSelector(state => state.data.vendors);
  const categories = useSelector(state => state.data.categories);
  console.log('token : ', token);
  useEffect(() => {
    async function updateToken() {
      if (token) {
        const deviceType = await AsyncStorage.getItem('deviceType');
        const deviceToken = await AsyncStorage.getItem('deviceToken');
        if (deviceToken && deviceType) {
          await updateNotiToken(deviceToken, deviceType, token);
        }
      }
    }
    updateToken();
  }, [token]);

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
  }, [address, dispatch]);

  useEffect(() => {
    useMylocation();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getData();
    });

    return unsubscribe;
  }, [coordinate, navigation]);

  useEffect(() => {
    if (coordinate) {
      ref.current?.setAddressText(coordinate.address);
      getData();
    }
  }, [coordinate]);

  useEffect(() => {
    if (vendors && vendors.length > 0) {
      if (selectedCategoryId) {
        setFilteredVendors(
          vendors.filter(
            item => item.vendor_category_id === selectedCategoryId,
          ),
        );
      } else {
        setFilteredVendors(vendors);
      }
    }
  }, [vendors, selectedCategoryId]);

  const getData = () => {
    getVendors(
      dispatch,
      {
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
      },
      token,
    )
      .then(res => {
        // console.log("res.vendors : ", res.vendors)
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
  };

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

  const goAround = () => {
    navigation.navigate('Around');
  };

  const goNotification = () => {
    navigation.navigate('Notification');
  };

  const goRestaurantDetail = vendor => {
    navigation.navigate('RestaurantDetail', {vendor});
  };

  // const renderToggleButton = () => (
  //   <TouchableOpacity
  //     style={{flexDirection: 'row', alignItems: 'center'}}
  //     onPress={() => setVisibleMenu(true)}>
  //     <Text
  //       status="primary"
  //       style={{
  //         marginRight: 6,
  //         fontWeight: 'bold',
  //         color: theme['color-primary-400'],
  //       }}>
  //       Categories
  //     </Text>
  //     <FontAwesomeIcon
  //       size={16}
  //       name="chevron-down"
  //       color={theme['color-danger-default']}
  //     />
  //   </TouchableOpacity>
  // );

  // const onItemSelect = index => {
  //   setSelectedCatory(index);
  //   setVisibleMenu(false);
  // };

  // const onSelectItem = id => {
  //   setSelectedCatoryId(id);
  // };

  const goStampDetail = (stamp, vendor) => {
    navigation.navigate('StambzDetail', {stamp, vendor, action: 'collect'});
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <Layout
        style={{
          backgroundColor: theme['color-basic-300'],
          paddingHorizontal: '5%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: Platform.OS === 'ios' ? 50 : 70,
          paddingTop: Platform.OS === 'ios' ? 0 : 20,
        }}>
        <Image
          source={require('../../assets/img/logo_front.png')}
          style={{width: 120, resizeMode: 'contain'}}
        />
        <TouchableOpacity
          style={[
            styles.notiButton,
            {backgroundColor: theme['color-warning-500']},
          ]}
          onPress={goNotification}>
          <FontAwesomeIcon
            size={20}
            name="bell"
            color={theme['color-primary-default']}
          />
          {notifications &&
            notifications.filter(noti => noti.status === 1).length > 0 && (
              <View
                style={[
                  styles.notiBadge,
                  {backgroundColor: theme['color-danger-500']},
                ]}
              />
            )}
        </TouchableOpacity>
      </Layout>
      <Layout
        style={{
          paddingVertical: 0,
          paddingHorizontal: 20,
          backgroundColor: theme['color-basic-300'],
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
            listViewDisplayed="auto"
            enablePoweredByContainer={false}
            onPress={(data, details = null) => {
              setAddress(data.description);
            }}
            query={{
              key: API_GOOGLE_MAP,
              language: 'en',
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
                  flexDirection: 'row',
                  alignItems: 'center',
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
                  onPress={goAround}>
                  Map View
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
              // row: {
              //   color: 'white',
              //   backgroundColor: theme["color-primary-300"],
              // },
            }}
          />
        </View>
      </Layout>
      <ScrollView
        style={{
          paddingHorizontal: '5%',
          backgroundColor: theme['color-basic-300'],
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={getData} />
        }>
        <View
          style={{
            marginTop: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text status="primary" category="h6">
            Stamp Cards
          </Text>
          {/* <OverflowMenu
            anchor={renderToggleButton}
            visible={visibleMenu}
            selectedIndex={selectedCategory}
            onSelect={onItemSelect}
            onBackdropPress={() => setVisibleMenu(false)}
            appearance="noDivider"
          >
            {categories && categories.map((category, index) => {
              return (
                <MenuItem
                  key={index}
                  accessoryLeft={() => <Image source={{ uri: ASSET_URL.replace('{TYPE}', 'categories') + category.icon }} style={{ width: 20, height: 20, borderRadius: 10, resizeMode: 'cover' }} />}
                  title={() => <Text status='primary' style={{ position: 'absolute', marginLeft: 40 }}>{category.name}</Text>}
                  style={{ backgroundColor: 'white' }}
                  onPress={() => onSelectItem(category.id)}
                />
              )
            })}
          </OverflowMenu> */}
        </View>
        {filteredVendors && filteredVendors.length > 0 ? (
          filteredVendors.map((item, index) => {
            return (
              <StambzCard
                {...item}
                key={index}
                onPress={() => goRestaurantDetail(item)}
                onPressSee={reward => {
                  goStampDetail(reward, item);
                }}
              />
            );
          })
        ) : (
          <NoData />
        )}
        <View style={{height: 100}} />
      </ScrollView>
    </SafeAreaView>
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
});
