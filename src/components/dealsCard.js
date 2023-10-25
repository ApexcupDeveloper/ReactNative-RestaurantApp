import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme, Text } from '@ui-kitten/components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { makeShort } from '../utils/makeShort';

export const DealsCard = ({
    title,
    description,
    crossed_price,
    price,
    expiry_date,
    used_count,
    total_stambz,
    amount_uses,
    onPress
}) => {
    const theme = useTheme();

    return (
        <View style={[styles.cardContainer, { backgroundColor: theme["color-basic-600"] }]}>
            <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: theme["color-warning-500"], paddingVertical: 3, paddingHorizontal: 6, borderRadius: 30 }}>
                    <Text status='primary' category='p2' style={{ textDecorationLine: 'line-through', marginRight: 4 }}>{crossed_price} kr.</Text>
                    <Text status='primary' category='h6'>{price} Kr.</Text>
                </View>
                <Text category='h6' style={{ color: theme["color-basic-100"] }}>{makeShort(title, 16)}</Text>
            </View>
            <View style={{ borderStyle: 'dashed', borderWidth: 1, borderColor: theme["color-primary-300"], marginVertical: 20 }} />
            {amount_uses === null ? (
                <View>
                    <View style={{ backgroundColor: theme["color-basic-300"], paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10, marginTop: 20 }}>
                        <Text status='primary'>{makeShort(description, 100)}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 5 }}>
                            <Text status='danger' category='c2'>Valid until {expiry_date}</Text>
                            <TouchableOpacity onPress={onPress} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <Text status='danger' style={{ fontSize: 14 }}>Buy Now</Text>
                                <AntDesign name='arrowright' size={16} color={theme["color-danger-500"]} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            ) : (
                <View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {new Array(used_count ?? 0).fill({}).map((item, i) => {
                                return (
                                    <Ionicons key={i} name="pricetag" size={24} color={theme["color-warning-500"]} style={{ marginHorizontal: 5 }} />
                                )
                            })}
                        </View>
                        <Text style={{ fontWeight: 'bold', color: theme["color-basic-100"] }}>{used_count} left</Text>
                    </View>
                    <View style={{ backgroundColor: theme["color-basic-300"], paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10, marginTop: 20 }}>
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
            )}

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