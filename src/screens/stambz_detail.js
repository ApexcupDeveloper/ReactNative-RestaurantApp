import React, { useEffect, useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, ScrollView, Platform, Pressable } from 'react-native';
import { Button, Text, useTheme } from '@ui-kitten/components';
import AntIcon from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import MapView, { Marker } from 'react-native-maps';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { ASSET_URL } from '../api/constant';
import FastImage from 'react-native-fast-image';
import { getDistance } from '../utils/getDistance';
import { useDispatch, useSelector } from 'react-redux';
import { checkAction } from '../redux/actions/data';
import { SET_DATA_LOADING } from '../redux/types';
import Toast from 'react-native-toast-message';
import Share from 'react-native-share';

export const StambzDetailScreen = ({ navigation, route }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { stamp, vendor, action } = route.params;
  const [errorImage, setErrorImage] = useState(false);
  const [errorAvatar, setErrorAvatar] = useState(false);
  const coordinate = useSelector(state => state.auth.location);
  const [total, setTotal] = useState(0);
  const [used, setUsed] = useState(0);
  const [hide, setHide] = useState(false);

  useEffect(() => {
    if (stamp) {
      setTotal(stamp.total_stambz);
      setUsed(stamp.used_count);
      // checkAction(dispatch, {
      //   type: 'stamp',
      //   id: stamp.id
      // }).then((res) => {
      //   setAction(res.action)
      //   dispatch({
      //     type: SET_DATA_LOADING,
      //     payload: false
      //   })
      // }).catch((err) => {
      //   dispatch({
      //     type: SET_DATA_LOADING,
      //     payload: false
      //   })
      //   Toast.show({
      //     type: 'error',
      //     text1: 'Error',
      //     text2: err
      //   });
      // })
    }
  }, [stamp])

  const goBack = () => {
    navigation.goBack();
  };

  const goCollect = () => {
    if (new Date(stamp.expiry_date) > new Date()) {
      navigation.navigate("Collect", {
        type: 'stamp',
        id: stamp.id,
        title: stamp.title,
        description: stamp.description,
        action: action
      })
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Oops, this card has been expired!.'
      });
    }

  }


  const goVendor = () => {
    navigation.navigate("RestaurantDetail", {
      vendor: vendor,
    })
  }

  const onShare = () => {
    const shareOptions = {
      title: `Share ${vendor.name}`,
      message: stamp.title + ' - ' + vendor.name + '\n' + 'PHONE : ' + vendor.phone + '\n' + 'ADDRESS : ' + vendor.address + '\n\n' + stamp.description,
      url: vendor.website,
      filename: vendor.name, // only for base64 file in Android
    };
    Share.open(shareOptions)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        err && console.log(err);
      });
  }

  return (
    <>
      <View style={styles.toolbar}>
        <TouchableOpacity>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.iconContainer]} onPress={goBack}>
          <AntIcon name='close' size={24} color={theme["color-danger-500"]} />
        </TouchableOpacity>
      </View>
      <ScrollView style={{ flex: 1 }}>
        <View style={{ width: '100%', zIndex: 1 }}>
          <FastImage
            source={!errorImage ? { uri: ASSET_URL.replace('{TYPE}', 'rewards') + stamp.main_image } : require("../../assets/img/place-image1.png")}
            style={{ width: '100%', height: 250 }}
            resizeMode="cover"
            onError={() => { setErrorImage(true) }}
          />

          <View style={{ position: 'absolute', top: 200, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, backgroundColor: 'white', right: '5%' }}>
            <Text category='c2' style={{ color: theme["color-basic-1000"] }}>{getDistance(coordinate.latitude, coordinate.longitude, vendor.latitude, vendor.longitude)}</Text>
          </View>
          {/* <View style={{ position: 'absolute', top: 237, flexDirection: 'row', right: '5%', zIndex: 10 }}>
          <View style={[styles.priceContainer, { backgroundColor: theme["color-primary-500"] }]}>
            <Text category='p2' style={{ textDecorationLine: 'line-through' }}>149 kr.</Text>
            <Text category='p1' style={{ fontWeight: 'bold', marginLeft: 5 }}>99 kr.</Text>
          </View>
          <View style={[styles.priceContainer, { backgroundColor: 'white', marginLeft: 15 }]}>
            <Text category='p1' style={{ color: theme["color-danger-500"], fontWeight: 'bold' }}>50% off</Text>
          </View>
        </View> */}
          <View style={styles.infoContainer}>
            <Pressable style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }} onPress={goVendor}>
              <Image
                source={!errorAvatar ? { uri: ASSET_URL.replace("{TYPE}", 'vendors') + vendor.logo } : require("../../assets/img/place-avatar.png")}
                style={{ width: 40, height: 40, borderRadius: 20 }}
                onError={() => { setErrorAvatar(true) }}
              />
              <View>
                <Text category='h6' style={{ color: theme["color-basic-1000"], marginLeft: 5 }}>{vendor.name}</Text>
                <Text category='c2' style={{ color: theme["color-basic-700"], marginLeft: 5, fontSize: 17 }}>{stamp.title}</Text>
              </View>
            </Pressable>
            <Text status='primary'>{stamp.description}</Text>
          </View>
          <TouchableOpacity style={[styles.shareContainer, { backgroundColor: theme["color-warning-500"], borderColor: theme["color-primary-500"] }]} onPress={onShare}>
            <Entypo name='share' size={24} color={theme["color-primary-500"]} />
          </TouchableOpacity>
        </View>
        <Pressable style={styles.termsContainer} onPress={() => { setHide(prev => !prev) }}>
          <View style={{ padding: 15, paddingVertical: 25 }}>
            <Text status='primary' category='h6'>Terms and Conditions</Text>
            {!hide && (
              <Text status='primary' style={{ marginTop: 5 }}>Information about goods and services on the Website is based on material provided by third party businesses('Vendors').</Text>
            )}
          </View>
          {!hide && (
            <>
              <View style={{ borderStyle: 'dashed', borderWidth: 0.5, borderColor: theme["color-primary-300"], marginVertical: 10 }} />
              <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingBottom: 20, paddingTop: 10 }}>
                <Text appearance='hint'>Valid: {stamp.expiry_date}</Text>
              </View>
            </>
          )}
        </Pressable>
        <View style={styles.stampContainer}>
          <Text status='primary' category='h6'>Collected Stamps</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', marginTop: 20 }}>
            {new Array(total).fill({}).map((item, index) => {
              if (used === 0) {
                return (
                  <FontAwesome5 key={index} name="stamp" size={24} color={theme["color-basic-400"]} style={{ margin: 5 }} />
                )
              } else {
                return (
                  <FontAwesome5 key={index} name="stamp" size={24} color={index <= used - 1 ? theme["color-primary-500"] : theme["color-basic-400"]} style={{ margin: 5 }} />
                )
              }
            })}
          </View>
        </View>
        <LinearGradient colors={['#FFFFFF', '#FFFFFF00']} style={styles.mapContainer}>
          <View style={{ paddingVertical: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Text status='primary' category='p2' style={{ fontWeight: 'bold' }}>{vendor.address}</Text>
          </View>
          <View style={{ height: 200, width: '100%' }}>
            <MapView
              style={{ flex: 1, borderRadius: 20 }}
              initialRegion={{
                latitude: Number(vendor.latitude),
                longitude: Number(vendor.longitude),
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421
              }}
            >
              <Marker
                coordinate={{ latitude: Number(vendor.latitude), longitude: Number(vendor.longitude) }}
                onPress={(e) => { }}
              >
                <FontAwesome5 name='map-marker-alt' size={36} color={theme["color-primary-500"]} />
              </Marker>
            </MapView>
          </View>
        </LinearGradient>
        <View style={{ height: 150 }} />
      </ScrollView>
      <TouchableOpacity style={{ marginHorizontal: '5%', position: 'absolute', bottom: 30, backgroundColor: theme["color-primary-500"], width: '90%', height: 46, borderRadius: 23, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onPress={goCollect}>
        <Text>{action === 'collect' ? 'Collect Stamp' : 'Redeem Reward'}</Text>
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
    zIndex: 1000
  },
  iconContainer: {
    height: 40,
    width: 40,
    borderRadius: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 10
  },
  priceContainer: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 10
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
    elevation: 10
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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 10
  },
  termsContainer: {
    backgroundColor: 'white',
    marginHorizontal: '5%',
    zIndex: 0,
    shadowColor: "#000",
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
    height: 240
  },
  stampContainer: {
    shadowColor: "#000",
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
  }
});