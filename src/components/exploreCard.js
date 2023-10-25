import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Avatar, useTheme, Text } from '@ui-kitten/components';
import { makeShort } from '../utils/makeShort';
import { ASSET_URL } from '../api/constant';
import FastImage from 'react-native-fast-image';
import { getDistance } from '../utils/getDistance';
import { useSelector } from 'react-redux';

export const ExploreCard = ({
    name, 
    description,
    address,
    logo,
    main_image,
    rewards,
    deals,
    gift_cards,
    latitude,
    longitude,
    onPress
}) => {
    const theme = useTheme();
    const coordinate = useSelector(state => state.auth.location);
    const [errorImage, setErrorImage] = useState(false);
    const [errorAvatar, setErrorAvatar] = useState(false);
    const IMG_URL = ASSET_URL.replace('{TYPE}', 'vendors')

    return (
        <TouchableOpacity style={[styles.cardContainer, { backgroundColor: theme["color-basic-100"] }]} onPress={onPress}>
            <FastImage
                source={!errorImage ? { uri: IMG_URL + main_image } : require("../../assets/img/place-image1.png")}
                style={{ borderTopLeftRadius: 10, borderTopRightRadius: 10, width: '100%', height: 150 }}
                resizeMode="cover"
                onError={() => { setErrorImage(true) }}
            />
            <View style={styles.distance}>
                <Text status='primary' style={{ fontWeight: 'bold' }}>{getDistance(coordinate.latitude, coordinate.longitude, latitude, longitude )}</Text>
            </View>
            <View style={{ paddingVertical: 10, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center' }}>
                <Avatar source={!errorAvatar ? { uri: IMG_URL + logo } : require("../../assets/img/place-avatar.png")} size="giant" onError={() => { setErrorAvatar(true) }} />
                <View style={{ marginLeft: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                        <Text category='h5' style={{ color: theme["color-basic-1000"] }} >{makeShort(name, 20)}</Text>
                        <View style={[styles.online, { backgroundColor: theme["color-success-500"] }]}></View>
                    </View>
                    <Text status='primary' category='c1'>{makeShort(address, 40)}</Text>
                </View>
            </View>
            <View style={{ paddingVertical: 5, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingBottom: 15 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={require("../../assets/img/stack.png")} style={{ height: 20, width: 20, resizeMode: 'contain' }} />
                    <Text status='primary' style={{ fontWeight: 'bold', marginLeft: 5 }}>{rewards ? rewards.length : 0} Cards</Text>
                </View>
                <View style={{ backgroundColor: theme["color-primary-500"], width: 1, height: 18 }} />
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={require("../../assets/img/fire_yellow.png")} style={{ height: 20, width: 20, resizeMode: 'contain' }} />
                    <Text status='primary' style={{ fontWeight: 'bold', marginLeft: 5, color: theme["color-warning-600"] }}>{deals ? deals.length : 0} Deals</Text>
                </View>
                <View style={{ backgroundColor: theme["color-primary-500"], width: 1, height: 18 }} />
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={require("../../assets/img/gift_card_red.png")} style={{ height: 20, width: 20, resizeMode: 'contain' }} />
                    <Text status='primary' style={{ fontWeight: 'bold', marginLeft: 5, color: theme["color-danger-500"] }}>{gift_cards ? gift_cards.length : 0} Gift Cards</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        width: '100%',
        borderRadius: 10,
        marginVertical: 10,
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
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 30,
        backgroundColor: 'white',
        position: 'absolute',
        top: 10,
        right: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,

        elevation: 9,
    },
    online: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginLeft: 5
    }
});