import React, {useEffect, useState} from 'react';
import {TouchableOpacity, View, FlatList, Platform} from 'react-native';
import {Text, Layout, useTheme} from '@ui-kitten/components';
import {DealCard} from '../components/dealCard';
import {useDispatch, useSelector} from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  SET_CATEGORY,
  SET_DATA_LOADING,
  SET_DEAL,
  SET_USER_DEAL,
  SET_USER_GIFTCARD,
  SET_USER_REWARD,
  SET_USER_STAMP,
  SET_VENDOR,
} from '../redux/types';
import Toast from 'react-native-toast-message';
import {getVendors} from '../redux/actions/data';

export const YourDealsScreen = ({navigation}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [selectedId, setSelectedId] = useState(null);
  const vendors = useSelector(state => state.data.vendors);
  const userDeals = useSelector(state => state.data.userDeals);
  const coordinate = useSelector(state => state.auth.location);
  const token = useSelector(state => state.auth.token);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getData();
    });

    return unsubscribe;
  }, [coordinate]);

  const getData = () => {
    getVendors(
      dispatch,
      {
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
      },
      token,
    )
      .then(res => {
        dispatch({
          type: SET_VENDOR,
          payload: res.vendors,
        });
        dispatch({
          type: SET_DEAL,
          payload: res.deals,
        });
        dispatch({
          type: SET_CATEGORY,
          payload: res.categories,
        });
        dispatch({
          type: SET_USER_DEAL,
          payload: res.all_user_deals,
        });
        dispatch({
          type: SET_USER_REWARD,
          payload: res.all_user_rewards,
        });
        dispatch({
          type: SET_USER_STAMP,
          payload: res.all_user_stamps,
        });
        dispatch({
          type: SET_USER_GIFTCARD,
          payload: res.all_user_gift_cards,
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
  };

  const goBack = () => {
    navigation.goBack();
  };

  const goDealDetail = (deal, vendor) => {
    navigation.navigate('DealDetail', {deal, vendor});
  };

  const _renderFooter = () => <View style={{height: 100}} />;

  const _renderItem = ({item, index}) => {
    const vendor = vendors.filter(ven => ven.id === item.deal?.vendor_id)[0];

    return (
      <DealCard
        key={index}
        {...item.deal}
        vendor={vendor}
        onPress={() => goDealDetail(item.deal, vendor)}
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
            Your Deals
          </Text>
          <Text category="p2" style={{color: theme['color-basic-100']}}>
            Here is your saved deals!
          </Text>
        </View>
      </Layout>
      <FlatList
        data={userDeals}
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
