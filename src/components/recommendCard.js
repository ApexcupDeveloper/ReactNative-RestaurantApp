import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Pressable } from 'react-native';
import { useTheme, Text } from '@ui-kitten/components';
import AntIcon from 'react-native-vector-icons/AntDesign';
import { makeShort } from '../utils/makeShort';
import { ASSET_URL } from '../api/constant';
import FastImage from 'react-native-fast-image';
import { getLeftDays } from '../utils/getLeftDays';
import { useSelector } from 'react-redux';
import { getDistance } from '../utils/getDistance';

export const RecommendCard = ({
  title,
  discount,
  crossed_price,
  price,
  main_image,
  listing_image,
  description,
  expiry_date,
  vendor,
  is_favorite_status,
  onPress
}) => {
  const theme = useTheme();
  const [errorImage, setErrorImage] = useState(false);
  const [errorAvatar, setErrorAvatar] = useState(false);
  const coordinate = useSelector(state => state.auth.location);

  const IMG_URL = ASSET_URL.replace('{TYPE}', 'deals');

  return (
    <Pressable style={[styles.dealsCard, { backgroundColor: theme["color-warning-500"] }]} onPress={onPress}>
      <FastImage
        source={!errorImage ? { uri: IMG_URL + main_image } : require("../../assets/img/place-image1.png")}
        style={{ width: '100%', height: 220, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
        resizeMode="cover"
        onError={() => { setErrorImage(true) }}
      />
      <View style={[styles.leftDays, { backgroundColor: theme["color-basic-100"] }]}>
        <Text status='danger' style={{ fontWeight: 'bold' }}>{getLeftDays(expiry_date)}</Text>
        <Text status='primary' category='c2'>Days Left</Text>
      </View>
      <View style={{ position: 'absolute', top: 20, left: 20 }}>
        <AntIcon size={24} name="heart" color={is_favorite_status ? theme["color-danger-500"] : '#E0E0E0'} />
      </View>
      <View style={[styles.distance, { backgroundColor: theme["color-basic-100"] }]}>
        <Text category='c2' style={{ color: theme["color-basic-1000"] }}>{getDistance(coordinate.latitude, coordinate.longitude, vendor.latitude, vendor.longitude)}</Text>
      </View>
      <View style={styles.priceContainer}>
        <View style={styles.offPercent}>
          <Image source={require("../../assets/img/discount.png")} style={{ width: 75, height: 50, resizeMode: 'contain' }} />
          <Text status='danger' category='p1' style={{ fontWeight: 'bold', position: 'absolute', top: 20, left: 10 }}>{discount}% Off</Text>
        </View>
        <View style={[styles.oldPrice, { backgroundColor: theme["color-primary-500"] }]}>
          <Text appearance='hint' style={{ textDecorationLine: 'line-through', marginRight: 10 }}>{crossed_price} kr.</Text>
          <Text category='p1' style={{ fontWeight: 'bold' }}>{price} kr.</Text>
        </View>
      </View>
      <View style={{ paddingHorizontal: 10 }}>
        <View style={{ paddingTop: 10, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <Image source={!errorAvatar ? { uri: IMG_URL + listing_image } : require("../../assets/img/place-avatar.png")} style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }} onError={() => { setErrorAvatar(true) }} />
          <Text category='h5' style={{ color: theme["color-basic-1000"] }}>{makeShort(title, 12)}</Text>
        </View>
        <Text status='primary' style={{ marginTop: 5 }}>{makeShort(description, 50)}</Text>
      </View>
      <TouchableOpacity onPress={onPress} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'absolute', right: 10, bottom: 10 }}>
        <Text status='danger' style={{ fontSize: 14 }}>Buy Now</Text>
        <AntIcon name='arrowright' size={16} color={theme["color-danger-500"]} />
      </TouchableOpacity>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  dealsCard: {
    height: 350,
    width: '100%',
    position: 'relative',
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
  leftDays: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 15,
    position: 'absolute',
    top: 10,
    right: 0,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
  distance: {
    position: 'absolute',
    right: 10,
    bottom: 140,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20
  },
  priceContainer: {
    position: 'absolute',
    bottom: 140,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    left: 10
  },
  oldPrice: {
    padding: 5,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    marginTop: -5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
  offPercent: {
  },
});