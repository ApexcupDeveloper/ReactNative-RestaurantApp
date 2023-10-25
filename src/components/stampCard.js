import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme, Text } from '@ui-kitten/components';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { makeShort } from '../utils/makeShort';

export const StampCard = ({
    title,
    description,
    used_count,
    total_stambz,
    expiry_date,
    onPress
}) => {
    const theme = useTheme();

    return (
        <View style={styles.cardContainer}>
            <View style={{ alignItems: 'flex-start' }}>
                <Text category='h6' style={{ color: theme["color-basic-1000"] }}>{makeShort(title, 16)}</Text>
            </View>
            <View style={{ borderStyle: 'dashed', borderWidth: 1, borderColor: theme["color-primary-300"], marginVertical: 20 }} />
            <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', maxWidth: '70%' }}>
                        {new Array(total_stambz).fill({}).map((item, i) => {
                            return (
                                <FontAwesome5 key={i} name="stamp" size={24} color={i <= used_count - 1 ? theme["color-primary-500"] : theme["color-basic-500"]} style={{ margin: 5 }} />
                            )
                        })}
                    </View>
                    <Text status='danger' style={{ fontWeight: 'bold' }}>{(used_count) + ` of ` + total_stambz}</Text>
                </View>
                <View style={{ backgroundColor: theme["color-warning-500"], paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10, marginTop: 20 }}>
                    <Text status='primary'>{makeShort(description, 100)}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 5 }}>
                        <Text status='danger' category='c2'>Valid until {expiry_date?.split(' ')[0]}</Text>
                        <TouchableOpacity onPress={onPress} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <Text status='danger' style={{ fontSize: 14 }}>Buy Now</Text>
                            <AntDesign name='arrowright' size={16} color={theme["color-danger-500"]} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        width: '100%',
        backgroundColor: 'white',
        padding: 20,
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

});