import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Text, Layout, useTheme, Input } from '@ui-kitten/components';
import InputScrollView from 'react-native-input-scroll-view';
import { validateEmail } from '../utils/validateEmail';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import { SET_AUTH, SET_LOADING, SET_TOKEN, SET_USER } from '../redux/types';
import { Spinner } from '../components/spinner';
import { updateProfileData } from '../redux/actions/data';
import { isNumber } from '../utils/checkNumber';
import { HTTPS } from '../api/http';
import { zipcodes } from '../utils/validateZipcode';

export const SignupPhoneScreen = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user);
    const loading = useSelector(state => state.auth.loading);
    const token = useSelector(state => state.auth.token);
    const [zip, setZip] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [first, setFirst] = React.useState('');
    const [last, setLast] = React.useState('');
    const [firstBorder, setFirstBorder] = React.useState(theme["color-basic-600"])
    const [lastBorder, setLastBorder] = React.useState(theme["color-basic-600"])
    const [mailBorder, setMailBorder] = React.useState(theme["color-basic-600"])
    const [zipBorder, setZipBorder] = React.useState(theme["color-basic-600"])

    useEffect(() => {
        if (user) {
            setEmail(user.email);
            setFirst(user.first_name);
            setLast(user.last_name);
            setZip(user.zip);
        }
    }, [user])

    const goComplete = () => {
        if (!validateEmail(email)) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Eamil is not valid.'
            });
            return
        }
        if (!first || !last) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Please type your name correctly.'
            });
            return
        }
        if (first.length > 15 || first.length < 2) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'First name length must be in between 2 and 15'
            });
            return
        }
        if (last.length > 15 || last.length < 2) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Last name length must be in between 2 and 15'
            });
            return
        }

        if (!zip) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Please type your zip code'
            });
            return
        }

        if (zip.length !== 4) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Invalid zip code'
            });
            return
        }
        
        if (!zipcodes.includes(Number(zip))) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Invalid zip code'
            });
            return
        }
        HTTPS.defaults.headers.common['Authorization'] = 'Bearer ' + token;
        const bodyData = new FormData();
        bodyData.append("first_name", first);
        bodyData.append("last_name", last);
        bodyData.append("email", email);
        bodyData.append("zip", zip);

        updateProfileData(dispatch, bodyData, token)
            .then((res) => {
                dispatch({
                    type: SET_AUTH,
                    payload: true
                })
                dispatch({
                    type: SET_LOADING,
                    payload: false
                })
                dispatch({
                    type: SET_TOKEN,
                    payload: res.token
                })
                dispatch({
                    type: SET_USER,
                    payload: res
                })
            }).catch((err) => {
                dispatch({
                    type: SET_LOADING,
                    payload: false
                })
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: err
                });
            })
    }

    // const goSkip = () => {
    //     dispatch({
    //         type: SET_TOKEN,
    //         payload: user.token
    //     })
       
    //     dispatch({
    //         type: SET_AUTH,
    //         payload: true
    //     })
    // }

    return (
        <Layout style={{ flex: 1, backgroundColor: theme['color-primary-500'], flexDirection: 'column' }}>
            <Spinner visible={loading} />
            <InputScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                <Layout style={[styles.container, { backgroundColor: theme['color-primary-default'] }]}>
                    <Text category='h4' style={{ marginBottom: 30, color: 'white' }}>Complete Account</Text>
                    <Layout style={{ width: '80%', marginBottom: 30 }}>
                        <Input
                            value={first}
                            label='First name'
                            placeholder='John'
                            style={{ borderColor: firstBorder, marginVertical: 8 }}
                            onFocus={() => { setFirstBorder(theme["color-basic-100"]) }}
                            onBlur={() => { setFirstBorder(theme["color-basic-600"]) }}
                            onChangeText={nextValue => setFirst(nextValue)}
                        />
                        <Input
                            value={last}
                            label='Last name'
                            placeholder='Die'
                            style={{ borderColor: lastBorder, marginVertical: 8 }}
                            onFocus={() => { setLastBorder(theme["color-basic-100"]) }}
                            onBlur={() => { setLastBorder(theme["color-basic-600"]) }}
                            onChangeText={nextValue => setLast(nextValue)}
                        />
                        <Input
                            value={email}
                            label='Email'
                            placeholder='test@mail.com'
                            keyboardType='email-address'
                            style={{ borderColor: mailBorder, marginVertical: 8 }}
                            onFocus={() => { setMailBorder(theme["color-basic-100"]) }}
                            onBlur={() => { setMailBorder(theme["color-basic-600"]) }}
                            onChangeText={nextValue => setEmail(nextValue)}
                        />
                        <Input
                            value={zip}
                            label='Zip Code'
                            placeholder='12345'
                            keyboardType='number-pad'
                            style={{ borderColor: zipBorder, marginVertical: 8 }}
                            onFocus={() => { setZipBorder(theme["color-basic-100"]) }}
                            onBlur={() => { setZipBorder(theme["color-basic-600"]) }}
                            onChangeText={nextValue => setZip(nextValue)}
                        />
                    </Layout>
                    <Button style={styles.button} status='success' onPress={goComplete}>Complete</Button>
                    {/* <Button style={styles.button} status='basic' onPress={goSkip}>Skip</Button> */}
                </Layout>
            </InputScrollView>
        </Layout>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        paddingTop: 80,
        paddingBottom: 30,
    },
    button: {
        height: 48,
        width: '80%',
        borderRadius: 24,
        marginVertical: 5
    },
    captionContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    captionIcon: {
        width: 10,
        height: 10,
        marginRight: 5
    },
    captionText: {
        fontSize: 12,
        fontWeight: "400",
        color: "#8F9BB3",
    }
});