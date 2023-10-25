import React, { useState } from 'react';
import { Pressable, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image'
import { CAROUSEL_URL } from '../api/constant';

export const CarouselCard = ({
    url,
    onPress
}) => {
    const [errorImage, setErrorImage] = useState(false);

    return (
        <Pressable onPress={onPress}>
            <FastImage
                source={!errorImage ? { uri: CAROUSEL_URL + url } : require("../../assets/img/place-image1.png")}
                style={{ width: '100%', height: 200, resizeMode: 'cover', borderRadius: 10 }}
                onError={() => { setErrorImage(true) }}
            />
        </Pressable>
    );
};