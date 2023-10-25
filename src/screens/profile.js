import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Image,
  View,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import {Layout, useTheme, Text} from '@ui-kitten/components';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {StampCard} from '../components/stampCard';
import {GiftCard} from '../components/giftCard';
import {useDispatch, useSelector} from 'react-redux';
import {getProfileData} from '../redux/actions/data';
import Toast from 'react-native-toast-message';
import {
  LOG_OUT,
  SET_DATA_LOADING,
  SET_USER,
  SET_USER_VENUES,
} from '../redux/types';
import {PROFILE_URL} from '../api/constant';
import {Spinner} from '../components/spinner';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ProfileScreen = ({navigation}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const vendors = useSelector(state => state.data.vendors);
  const userDeals = useSelector(state => state.data.userDeals);
  const userRewards = useSelector(state => state.data.userRewards);
  const userStamps = useSelector(state => state.data.userStamps);
  const userGiftcards = useSelector(state => state.data.userGiftcards);
  const userVenues = useSelector(state => state.data.userVenues);
  const loading = useSelector(state => state.data.loading);
  const token = useSelector(state => state.auth.token);
  const [selectedType, setSelectedType] = useState('stamps');

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getProfileData(dispatch, token)
        .then(res => {
          dispatch({
            type: SET_USER,
            payload: res.my_user_detail,
          });
          dispatch({
            type: SET_USER_VENUES,
            payload: res.my_favorite_vendor,
          });
          dispatch({
            type: SET_DATA_LOADING,
            payload: false,
          });
        })
        .catch(err => {
          dispatch({
            type: SET_DATA_LOADING,
            payload: false,
          });
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: err,
          });
        });
    });

    return unsubscribe;
  }, [user]);

  const goRewards = () => {
    navigation.navigate('Rewards');
  };

  const goVenues = () => {
    navigation.navigate('Venues');
  };

  const goYourDeals = () => {
    navigation.navigate('YourDeals');
  };

  const goStambzDetail = (stamp, used_count) => {
    const vendor = vendors.filter(item => item.id === stamp.vendor_id)[0];
    navigation.navigate('StambzDetail', {
      stamp: {...stamp, used_count},
      vendor,
      action: 'collect',
    });
  };

  const goGiftDetail = (gift, used_count) => {
    const vendor = vendors.filter(item => item.id === gift.vendor_id)[0];
    navigation.navigate('GiftDetail', {gift: {...gift, used_count}, vendor});
  };

  const goEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  const goLogout = () => {
    Alert.alert('Confirm', 'You are sure you want to logout?', [
      {
        text: 'Logout',
        onPress: async () => {
          dispatch({
            type: LOG_OUT,
            payload: '',
          });
          await AsyncStorage.setItem('token', '');
          navigation.navigate('Splash');
        },
      },
      {
        text: 'Cancel',
        onPress: () => {},
      },
    ]);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      {/* <Spinner visible={loading} /> */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <Layout
          style={{
            backgroundColor: theme['color-basic-300'],
            paddingHorizontal: '5%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: Platform.OS === 'ios' ? 20 : 30,
          }}>
          <TouchableOpacity onPress={goLogout}>
            <Entypo name="log-out" color={'black'} size={24} />
          </TouchableOpacity>
          <TouchableOpacity onPress={goEditProfile}>
            <Entypo name="dots-three-vertical" color={'black'} size={24} />
          </TouchableOpacity>
        </Layout>
        <Layout
          style={{
            backgroundColor: theme['color-basic-300'],
            paddingHorizontal: '5%',
            alignItems: 'center',
          }}>
          <View style={styles.avatar}>
            <Image
              source={
                !user.image
                  ? require('../../assets/img/img_avatar.png')
                  : {uri: PROFILE_URL + user.image}
              }
              style={{height: 100, width: 100, borderRadius: 50}}
            />
          </View>
          <Text
            category="h4"
            style={{
              color: theme['color-basic-1000'],
              marginTop: 10,
              marginBottom: 5,
            }}>
            {user.first_name + ' ' + user.last_name}
          </Text>
          <Text category="p1" status="primary">
            {user.email}
          </Text>
        </Layout>
        <Layout
          style={{
            paddingVertical: 0,
            paddingHorizontal: '5%',
            backgroundColor: theme['color-basic-300'],
            marginTop: 30,
          }}>
          {(!user.first_name ||
            !user.last_name ||
            !user.email ||
            !user.phone ||
            !user.image ||
            !user.zip) && (
            <View
              style={[
                styles.incomplete,
                {backgroundColor: theme['color-danger-400']},
              ]}>
              <View
                style={{
                  backgroundColor: theme['color-danger-500'],
                  height: 40,
                  borderRadius: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text category="h6">Incomplete Profile!</Text>
              </View>
              <View style={{paddingHorizontal: 20, paddingVertical: 16}}>
                <Text>
                  Add required information in order to unlock all features.
                </Text>
              </View>
              <TouchableOpacity
                style={{position: 'absolute', right: 10, bottom: 5}}
                onPress={goEditProfile}>
                <AntDesign name="arrowright" size={24} color="white" />
              </TouchableOpacity>
            </View>
          )}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 30,
            }}>
            <TouchableOpacity style={styles.card} onPress={goRewards}>
              <Text category="h6" style={{color: theme['color-basic-1000']}}>
                Rewards
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 5,
                }}>
                <FontAwesome
                  name="gift"
                  size={24}
                  color={theme['color-danger-500']}
                />
                <Text status="primary" category="h4" style={{marginLeft: 10}}>
                  {userRewards ? userRewards.length : 0}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.card} onPress={goYourDeals}>
              <Text category="h6" style={{color: theme['color-basic-1000']}}>
                Deals
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 5,
                }}>
                <FontAwesome5
                  name="fire"
                  size={24}
                  color={theme['color-danger-500']}
                />
                <Text status="primary" category="h4" style={{marginLeft: 10}}>
                  {userDeals ? userDeals.length : 0}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.card} onPress={goVenues}>
              <Text category="h6" style={{color: theme['color-basic-1000']}}>
                Venues
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 5,
                }}>
                <FontAwesome5
                  name="map-marker-alt"
                  size={24}
                  color={theme['color-danger-500']}
                />
                <Text status="primary" category="h4" style={{marginLeft: 10}}>
                  {userVenues ? userVenues.length : 0}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View
            style={{flexDirection: 'row', alignItems: 'center', marginTop: 30}}>
            <TouchableOpacity
              style={{marginRight: 30}}
              onPress={() => {
                setSelectedType('stamps');
              }}>
              <Text
                category={selectedType === 'stamps' ? 'h6' : 'p1'}
                status="primary">
                My Stamps ({userStamps ? userStamps.length : 0})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setSelectedType('gift');
              }}>
              <Text
                category={selectedType === 'gift' ? 'h6' : 'p1'}
                status="primary">
                My Gift Cards ({userGiftcards ? userGiftcards.length : 0})
              </Text>
            </TouchableOpacity>
          </View>
          {selectedType === 'gift' && (
            <View style={{marginTop: 20}}>
              {userGiftcards.map((card, index) => {
                return (
                  <GiftCard
                    key={index}
                    {...card.gift_card}
                    used_count={card.used_count}
                    onPress={() =>
                      goGiftDetail(card.gift_card, card.used_count)
                    }
                  />
                );
              })}
            </View>
          )}
          {selectedType === 'stamps' && (
            <View style={{marginTop: 20}}>
              {userStamps.map((card, index) => {
                return (
                  <StampCard
                    key={index}
                    {...card.reward}
                    used_count={card.used_count}
                    onPress={() => goStambzDetail(card.reward, card.used_count)}
                  />
                );
              })}
            </View>
          )}
        </Layout>
        <View style={{height: 100}} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  avatar: {
    padding: 6,
    backgroundColor: 'white',
    borderRadius: 60,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
  incomplete: {
    width: '100%',
    borderRadius: 10,
  },
  card: {
    width: '31%',
    backgroundColor: 'white',
    padding: 14,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
});
