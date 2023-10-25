import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableOpacity,
  View,
  ScrollView,
  Dimensions,
  Platform,
  RefreshControl,
} from 'react-native';
import {Button, Text, Layout, useTheme} from '@ui-kitten/components';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import AntIcon from 'react-native-vector-icons/AntDesign';
import Carousel from 'react-native-snap-carousel';
import {ExploreCard} from '../components/exploreCard';
import {NewDealsCard} from '../components/newDealsCard';
import {useDispatch, useSelector} from 'react-redux';
import {ASSET_URL} from '../api/constant';
import {makeShort} from '../utils/makeShort';
import {NoData} from '../components/noData';
import {getVendors} from '../redux/actions/data';
import Toast from 'react-native-toast-message';
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

const screenWidth = Dimensions.get('screen').width;

export const ExploreScreen = ({navigation}) => {
  const theme = useTheme();
  const categories = useSelector(state => state.data.categories);
  const deals = useSelector(state => state.data.deals);
  const vendors = useSelector(state => state.data.vendors);
  const notifications = useSelector(state => state.data.notifiations);
  const coordinate = useSelector(state => state.auth.location);
  const loading = useSelector(state => state.data.loading);
  const token = useSelector(state => state.auth.token);

  const [filteredVendors, setFilteredVendors] = useState([]);
  const [selectedCategoryId, setSelectedCatoryId] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getData();
    });

    return unsubscribe;
  }, [coordinate]);

  useEffect(() => {
    if (vendors && vendors.length > 0) {
      if (selectedCategoryId) {
        setFilteredVendors(
          vendors.filter(vendor => vendor.category.id === selectedCategoryId),
        );
      } else {
        setFilteredVendors(vendors);
      }
    }
  }, [vendors, selectedCategoryId]);

  const goNotification = () => {
    navigation.navigate('Notification');
  };

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

  const selectCategory = id => {
    if (selectedCategoryId === id) {
      setSelectedCatoryId(null);
    } else {
      setSelectedCatoryId(id);
    }
  };

  const ArrowIcon = props => (
    <AntIcon name="right" size={16} color={theme['color-danger-500']} />
  );

  const ArrowLeftIcon = props => (
    <AntIcon name="left" size={16} color={theme['color-danger-500']} />
  );

  const goDealsDetail = deal => {
    navigation.navigate('DealDetail', {deal});
  };

  const goAllDeals = () => {
    navigation.navigate('AllDeals');
  };

  const goRestaurantDetail = vendor => {
    navigation.navigate('RestaurantDetail', {vendor});
  };

  const _renderItem = ({item, index}) => {
    return (
      <NewDealsCard {...item} key={index} onPress={() => goDealsDetail(item)} />
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <Layout
        style={{
          backgroundColor: theme['color-basic-300'],
          paddingHorizontal: '5%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: Platform.OS === 'ios' ? 50 : 70,
          paddingTop: Platform.OS === 'ios' ? 0 : 20,
        }}>
        <Text status="primary" category="h3">
          Explore
        </Text>
        <TouchableOpacity
          style={[
            styles.notiButton,
            {backgroundColor: theme['color-warning-500']},
          ]}
          onPress={goNotification}>
          <FontAwesomeIcon
            size={20}
            name="bell"
            color={theme['color-primary-default']}
          />
          {notifications &&
            notifications.filter(noti => noti.status === 1).length > 0 && (
              <View
                style={[
                  styles.notiBadge,
                  {backgroundColor: theme['color-danger-500']},
                ]}
              />
            )}
        </TouchableOpacity>
      </Layout>
      <ScrollView
        style={{backgroundColor: theme['color-basic-300']}}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={getData} />
        }>
        <Layout
          style={{
            paddingHorizontal: '5%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: theme['color-basic-300'],
            marginTop: 15,
          }}>
          <Text category="p1" status="primary" style={{fontWeight: 'bold'}}>
            New Deals
          </Text>
          <Button
            appearance="ghost"
            accessoryRight={e => ArrowIcon()}
            style={{paddingHorizontal: 0}}
            onPress={goAllDeals}>
            View all
          </Button>
        </Layout>
        {deals.length > 0 ? (
          <Layout
            style={{
              backgroundColor: theme['color-basic-300'],
              height: 370,
              paddingTop: 10,
            }}>
            <Carousel
              layout={'default'}
              data={deals}
              renderItem={_renderItem}
              sliderWidth={screenWidth}
              itemWidth={screenWidth * 0.6}
              inactiveSlideScale={0.8}
            />
          </Layout>
        ) : (
          <NoData />
        )}
        <Layout
          style={{
            paddingHorizontal: '5%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: theme['color-basic-300'],
            marginVertical: 15,
          }}>
          <Button
            appearance="ghost"
            accessoryLeft={e => ArrowLeftIcon()}
            style={{paddingHorizontal: 0, fontWeight: 'bold'}}
            onPress={() => {
              setSelectedCatoryId(null);
            }}>
            Categories
          </Button>
        </Layout>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories &&
            categories.length > 0 &&
            categories.map((category, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.category,
                  {
                    backgroundColor:
                      selectedCategoryId === category.id
                        ? theme['color-primary-400']
                        : theme['color-basic-400'],
                    marginLeft: index === 0 ? screenWidth * 0.05 : 14,
                  },
                ]}
                onPress={() => selectCategory(category.id)}>
                <Image
                  source={{
                    uri:
                      ASSET_URL.replace('{TYPE}', 'categories') + category.icon,
                  }}
                  style={{width: 20, height: 20, resizeMode: 'contain'}}
                />
                <Text
                  category="p2"
                  style={{color: theme['color-basic-1000'], marginTop: 5}}>
                  {makeShort(category.name, 7)}
                </Text>
              </TouchableOpacity>
            ))}
        </ScrollView>
        <Layout
          style={{
            paddingHorizontal: '5%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: theme['color-basic-300'],
            marginTop: 25,
          }}>
          <Text category="p1" status="primary" style={{fontWeight: 'bold'}}>
            Newly Added Venues
          </Text>
        </Layout>
        <Layout
          style={{
            paddingHorizontal: '5%',
            backgroundColor: theme['color-basic-300'],
          }}>
          {filteredVendors && filteredVendors.length > 0 ? (
            filteredVendors.map((vendor, index) => {
              return (
                <ExploreCard
                  key={index}
                  {...vendor}
                  onPress={() => goRestaurantDetail(vendor)}
                />
              );
            })
          ) : (
            <NoData />
          )}
        </Layout>
        <View style={{height: 100}} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  notiButton: {
    height: 36,
    width: 36,
    borderRadius: 18,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notiBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    position: 'absolute',
    top: 2,
    right: 2,
  },
  leftDays: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 15,
    position: 'absolute',
    top: 10,
    right: 0,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
  distance: {
    position: 'absolute',
    right: 10,
    bottom: 170,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  priceContainer: {
    position: 'absolute',
    bottom: 120,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    right: 10,
  },
  oldPrice: {
    padding: 5,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
  offPercent: {
    padding: 5,
    backgroundColor: 'white',
    borderRadius: 20,
    marginLeft: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
  exploreCard: {
    height: 350,
    width: '100%',
    position: 'relative',
    backgroundColor: 'white',
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
  category: {
    width: 64,
    height: 64,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
