import React, {useEffect, useState} from 'react';
import {TouchableOpacity, View, FlatList, Platform} from 'react-native';
import {Text, Layout, useTheme} from '@ui-kitten/components';
import {ExploreCard} from '../components/exploreCard';
import {useDispatch, useSelector} from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Toast from 'react-native-toast-message';
import {getProfileData} from '../redux/actions/data';
import {SET_DATA_LOADING, SET_USER_VENUES} from '../redux/types';

export const VenuesScreen = ({navigation}) => {
  const theme = useTheme();
  const userVenues = useSelector(state => state.data.userVenues);
  const [selectedId, setSelectedId] = useState(null);
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const token = useSelector(state => state.auth.token);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (user) {
        getProfileData(dispatch, token)
          .then(res => {
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
      }
    });

    return unsubscribe;
  }, [user]);

  const goBack = () => {
    navigation.goBack();
  };

  const goRestaurantDetail = vendor => {
    navigation.navigate('RestaurantDetail', {vendor});
  };

  const _renderFooter = () => <View style={{height: 100}}></View>;

  const _renderItem = ({item, index}) => {
    return (
      <ExploreCard
        key={index}
        {...item}
        onPress={() => goRestaurantDetail(item)}
      />
    );
  };

  return (
    <View style={{flex: 1}}>
      <Layout
        style={{
          backgroundColor: theme['color-primary-500'],
          flexDirection: 'row',
          height: Platform.OS === 'ios' ? 120 : 100,
          paddingTop: Platform.OS === 'ios' ? 50 : 25,
          paddingHorizontal: '5%',
        }}>
        <TouchableOpacity
          style={{height: 40, width: 40, marginTop: 3}}
          onPress={goBack}>
          <AntDesign
            name="arrowleft"
            size={26}
            color={theme['color-basic-100']}
          />
        </TouchableOpacity>
        <View>
          <Text category="h4" style={{color: theme['color-warning-500']}}>
            Your Venues
          </Text>
          <Text category="p2" style={{color: theme['color-basic-100']}}>
            Here is your saved venues!
          </Text>
        </View>
      </Layout>
      <FlatList
        data={userVenues}
        numColumns={1}
        keyExtractor={item => item.id}
        extraData={selectedId}
        renderItem={_renderItem}
        showsVerticalScrollIndicator={false}
        style={{paddingHorizontal: '5%', paddingTop: 10}}
        ListFooterComponent={_renderFooter}
      />
    </View>
  );
};
