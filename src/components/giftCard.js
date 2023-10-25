import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme, Text } from '@ui-kitten/components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { makeShort } from '../utils/makeShort';

export const GiftCard = ({
    title,
    description,
    items,
    used_count,
    expiry_date,
    purchased_status,
    onPress
}) => {
    const theme = useTheme();

    return (
        <View style={[styles.cardContainer, { backgroundColor: theme["color-primary-500"] }]}>
            <View style={{ alignItems: 'flex-start' }}>
                <Text category='h6' style={{ color: theme["color-basic-100"] }}>{makeShort(title, 16)}</Text>
            </View>
            <View style={{ borderStyle: 'dashed', borderWidth: 1, borderColor: theme["color-primary-300"], marginVertical: 20 }} />
            <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row',flexWrap: 'wrap', alignItems: 'center', maxWidth: '80%' }}>
                        {new Array(items).fill({}).map((item, i) => {
                            if(used_count === 0 && !purchased_status) {
                                return (
                                    <Ionicons key={i} name="pricetag" size={24} color={theme["color-basic-400"]} style={{ margin: 5 }} />
                                )
                            } else {
                                return (
                                    <Ionicons key={i} name="pricetag" size={24} color={(new Array(items).fill({}).length - i - 1) <= used_count - 1 ? theme["color-basic-400"] : theme["color-warning-500"]} style={{ margin: 5 }} />
                                )
                            }
                            // return (
                            //     <Ionicons key={i} name="pricetag" size={24} color={i <= used_count - 1 ? theme["color-basic-400"] : theme["color-warning-500"]} style={{ margin: 5 }} />
                            // )
                        })}
                    </View>
                    <Text status='basic' style={{ fontWeight: 'bold' }}>{items - used_count} left</Text>
                </View>
                <View style={{ backgroundColor: theme["color-basic-300"], paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10, marginTop: 20 }}>
                    <Text status='primary'>{makeShort(description, 100)}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 5 }}>
                        <Text status='danger' category='c2'>Valid until {expiry_date?.split(' ')[0]}</Text>
                        <TouchableOpacity onPress={onPress} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <Text status='danger' style={{ fontSize: 14 }}>{purchased_status ? 'Redeem Now' : 'Buy Now'}</Text>
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