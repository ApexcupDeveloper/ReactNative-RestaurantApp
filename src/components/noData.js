import React from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { useTheme } from '@ui-kitten/components';
import AntIcon from 'react-native-vector-icons/AntDesign';

const WIDTH = Dimensions.get('screen').width;
const HEIGHT = Dimensions.get('screen').height;

export const NoData = () => {
    const theme = useTheme();

    return (
        <View style={[styles.container, { display: 'flex' }]}>
            <AntIcon name='frowno' size={38} color={theme["color-danger-500"]} />
            <Text style={{ color: theme["color-basic-600"], marginTop: 20, fontSize: 18 }}>Oops, No data found! </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginVertical: 30
    }
});