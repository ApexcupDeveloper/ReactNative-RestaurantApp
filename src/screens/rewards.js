import React, {useState} from 'react';
import {
  TouchableOpacity,
  View,
  FlatList,
  StyleSheet,
  Platform,
} from 'react-native';
import {Text, Layout, useTheme} from '@ui-kitten/components';
import {useSelector} from 'react-redux';
import FastImage from 'react-native-fast-image';
import {ASSET_URL} from '../api/constant';
import {makeShort} from '../utils/makeShort';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export const RewardsScreen = ({navigation}) => {
  const theme = useTheme();
  const [selectedId, setSelectedId] = useState(null);
  const vendors = useSelector(state => state.data.vendors);
  const userRewards = useSelector(state => state.data.userRewards);

  const goBack = () => {
    navigation.goBack();
  };

  const goStambzDetail = (stamp, used_count) => {
    const vendor = vendors.filter(ven => ven.id === stamp.vendor_id)[0];
    navigation.navigate('StambzDetail', {
      stamp: {...stamp, used_count},
      vendor,
      action: 'redeem',
    });
  };

  const _renderFooter = () => <View style={{height: 100}} />;

  const _renderItem = ({item, index}) => {
    let errorLoad = false;

    return (
      <TouchableOpacity
        key={index}
        style={styles.item}
        onPress={() => goStambzDetail(item.reward, item.used_count)}>
        <FastImage
          source={
            !errorLoad
              ? {
                  uri:
                    ASSET_URL.replace('{TYPE}', 'rewards') +
                    item.reward.main_image,
                }
              : require('../../assets/img/place-image1.png')
          }
          style={{
            width: '100%',
            height: 150,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          }}
          resizeMode="cover"
          onError={() => {
            errorLoad = true;
          }}
        />
        <View
          style={{
            position: 'absolute',
            paddingVertical: 5,
            paddingHorizontal: 10,
            borderRadius: 20,
            backgroundColor: theme['color-primary-500'],
            top: 115,
            right: 10,
          }}>
          <Text category="c1">Redeem</Text>
        </View>
        <View style={{padding: 10}}>
          <Text
            style={{
              color: theme['color-basic-1000'],
              fontWeight: 'bold',
              marginTop: 5,
            }}>
            {makeShort(item.reward.title, 12)}
          </Text>
          <Text status="primary" style={{fontSize: 12}}>
            {makeShort(item.reward.description, 26)}
          </Text>

          <Text appearance="hint" style={{fontSize: 11, marginTop: 5}}>
            Valid: {item.reward.expiry_date}
          </Text>
        </View>
      </TouchableOpacity>
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
          {
            <AntDesign
              name="arrowleft"
              size={26}
              color={theme['color-basic-100']}
            />
          }
        </TouchableOpacity>
        <View>
          <Text category="h4" style={{color: theme['color-warning-500']}}>
            Rewards
          </Text>
          <Text category="p2" style={{color: theme['color-basic-100']}}>
            Browse all deals type categories, have fun!
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            position: 'absolute',
            top: 30,
            right: '5%',
          }}>
          <FontAwesome name="gift" size={20} color={theme['color-basic-100']} />
          <Text
            category="p2"
            style={{
              color: theme['color-warning-500'],
              fontWeight: 'bold',
              fontSize: 18,
              marginLeft: 4,
            }}>
            {userRewards?.length || 0}
          </Text>
        </View>
      </Layout>
      <FlatList
        data={userRewards}
        numColumns={2}
        keyExtractor={item => item.id}
        extraData={selectedId}
        renderItem={_renderItem}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{
          justifyContent: 'space-between',
          paddingHorizontal: '5%',
          paddingTop: 10,
        }}
        ListFooterComponent={_renderFooter}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    width: '47%',
    borderRadius: 10,
    marginVertical: 10,
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
