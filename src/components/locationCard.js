import React, { useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme, Text } from '@ui-kitten/components';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { makeShort } from '../utils/makeShort';
import { ASSET_URL } from '../api/constant';
import { getDistance } from '../utils/getDistance';
import { useSelector } from 'react-redux';

export const LocationCard = ({
    logo,
    title,
    address,
    working_hours,
    latitude,
    longitude,
    onPress
}) => {
    const theme = useTheme();
    const coordinate = useSelector(state => state.auth.location);
    const [errorAvatar, setErrorAvatar] = useState(false);

    return (
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
                source={!errorAvatar ? { uri: ASSET_URL.replace('{TYPE}', 'vendors') + logo } : require("../../assets/img/place-avatar.png")}
                style={{ width: 70, height: 70, borderRadius: 35, zIndex: 10 }}
                onError={() => { setErrorAvatar(true) }}
            />
            <View style={styles.cardContainer}>
                <Text category='h6' style={{ color: theme["color-basic-1000"] }}>{makeShort(title, 16)}</Text>
                <Text status='primary' category='c1'>{makeShort(address, 50)}</Text>
                <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={[styles.online, { backgroundColor: theme["color-success-500"] }]} />
                        <Text status='primary' category='c2'>{working_hours}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <FontAwesome name='send' size={16} color={theme["color-warning-500"]} style={{ marginRight: 5 }} />
                        <Text status='primary' category='c2'>{getDistance(coordinate.latitude, coordinate.longitude, latitude, longitude)}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        flexDirection: 'column',
        backgroundColor: 'white',
        padding: 10,
        marginLeft: -35,
        borderRadius: 10,
        marginVertical: 10,
        paddingLeft: 45,
        width: '85%',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,

        elevation: 4,
    },
    online: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 5
    }
});