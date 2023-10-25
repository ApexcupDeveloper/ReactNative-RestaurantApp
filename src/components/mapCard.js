import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image'
import { useTheme, Text } from '@ui-kitten/components';
import { ASSET_URL } from '../api/constant';
import { makeShort } from '../utils/makeShort';
import { getDistance } from '../utils/getDistance';
import { useSelector } from 'react-redux';

export const MapCard = ({
    id,
    vendor_category_id,
    main_image,
    logo,
    distance_in_km,
    latitude,
    longitude,
    name,
    address,
    onPress
}) => {
    const theme = useTheme();
    const coordinate = useSelector(state => state.auth.location);
    const IMG_URL = ASSET_URL.replace('{TYPE}', 'vendors');
    const [errorImage, setErrorImage] = useState(false);

    return (
        <TouchableOpacity style={styles.card}
            onPress={onPress}>
            <FastImage
                source={!errorImage ? { uri: IMG_URL + main_image } : require('../../assets/img/place-image1.png')}
                onError={() => { setErrorImage(true) }}
                style={{ height: 90, width: '100%', borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
                resizeMode={'cover'}
            />
            <View style={styles.distance}>
                <Text status='danger' category='c2' >{getDistance(coordinate.latitude, coordinate.longitude, latitude, longitude)}</Text>
            </View>
            <View style={{ display: 'flex', height: 60, justifyContent: 'center', alignItems: 'flex-start', width: '100%', paddingHorizontal: 10 }}>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <Text category='h6' style={{ color: theme["color-basic-1000"] }} >{makeShort(name, 20)}</Text>
                    {/* {item.online && (<View style={[styles.online, { backgroundColor: theme["color-success-500"] }]} />)} */}
                </View>
                <Text category='c1' appearance="hint" >{makeShort(address, 40)}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        height: 150,
        width: 260,
        flexDirection: 'column',
        backgroundColor: 'white',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: "#939393",
        shadowOffset: {
            width: 1,
            height: 1,
        },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 1,
        marginRight: 20,
        borderRadius: 10
    },
    online: {
        height: 8,
        width: 8,
        borderRadius: 4,
        marginLeft: 6
    },
    distance: {
        position: 'absolute',
        right: 10,
        top: 10,
        backgroundColor: 'white',
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,

        elevation: 4,
    }
});