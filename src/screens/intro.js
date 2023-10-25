import React, { useState } from 'react';
import { TouchableOpacity, View, Dimensions, Text } from 'react-native';
import { Layout, useTheme } from '@ui-kitten/components';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import INTRO_IMG1 from '../../assets/img/intro1.png';
import INTRO_IMG2 from '../../assets/img/intro2.png';
import INTRO_IMG3 from '../../assets/img/intro3.png';
import FastImage from 'react-native-fast-image';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;

const DATA = [
    {
        id: 1,
        img: INTRO_IMG1,
        title: 'Stamp Cards',
        description: 'All your stambz in one secure place ready to be used for some cool reward. Find them in profile.'
    },
    {
        id: 2,
        img: INTRO_IMG2,
        title: 'Favorite Deals',
        description: 'Der er penge at spare med Stambz, Nar du har optjent nok stempler kan du vaelge at indlese dit'
    },
    {
        id: 3,
        img: INTRO_IMG3,
        title: 'Stamp Cards',
        description: 'Der er penge at spare med Stambz, Nar du har optjent nok stempler kan du vaelge at indlese dit'
    },
]

export const IntroScreen = ({ navigation }) => {
    const theme = useTheme();
    const [activeIndex, setActiveIndex] = useState(0);

    const _renderItem = ({ item, index }) => {
        return (
            <>
                <FastImage
                    source={item.img}
                    style={{ width: '100%', height: screenHeight * 0.6, resizeMode: 'cover' }}
                />
                <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 28, textAlign: 'center', marginTop: 20, color: 'white', fontWeight: 'bold' }}>{item.title}</Text>
                    <Text style={{ fontSize: 14, textAlign: 'center', marginTop: 20, color: 'white', width: '80%' }}>{item.description}</Text>
                </View>
                {index === 2 && (
                    <View style={{ alignItems: 'center', display: 'flex', marginTop: 40 }}>
                        <TouchableOpacity onPress={async () => {
                            await AsyncStorage.setItem("intro", "true")
                            navigation.navigate("Splash")
                        }}>
                            <Text style={{ color: theme["color-danger-500"], fontSize: 18 }}>Get Started</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </>
        )
    }

    return (
        <View style={{ flex: 1, backgroundColor: theme["color-primary-500"] }}>
            <Carousel
                layout={'default'}
                data={DATA}
                renderItem={_renderItem}
                sliderWidth={screenWidth}
                itemWidth={screenWidth}
                inactiveSlideScale={0.9}
                onSnapToItem={(index) => { setActiveIndex(index) }}
            />
            <Pagination
                dotsLength={DATA.length}
                activeDotIndex={activeIndex}
                containerStyle={{ position: 'absolute', width: '100%', bottom: -10 }}
                dotStyle={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    borderWidth: 3,
                    borderColor: theme["color-basic-100"],
                    backgroundColor: theme["color-basic-100"],
                }}
                inactiveDotStyle={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    borderWidth: 3,
                    borderColor: theme["color-basic-100"],
                    backgroundColor: 'transparent'
                }}
                inactiveDotOpacity={0.8}
                inactiveDotScale={1}
            />
        </View>
    );
};