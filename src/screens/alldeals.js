import React from 'react';
import {TouchableOpacity, View, ScrollView, Platform} from 'react-native';
import {Text, Layout, useTheme} from '@ui-kitten/components';
import {DealCard} from '../components/dealCard';
import {useSelector} from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {NoData} from '../components/noData';

export const AllDealsScreen = ({navigation}) => {
  const theme = useTheme();
  const deals = useSelector(state => state.data.deals);

  const goBack = () => {
    navigation.goBack();
  };

  const goDealDetail = deal => {
    navigation.navigate('DealDetail', {deal});
  };

  const goVendor = vendor => {
    // navigation.navigate("RestaurantDetail", { vendor })
  };

  return (
    <View style={{flex: 1}}>
      <Layout
        style={{
          backgroundColor: theme['color-basic-300'],
          paddingHorizontal: '5%',
          flexDirection: 'row',
          height: Platform.OS === 'ios' ? 100 : 60,
          paddingTop: Platform.OS === 'ios' ? 50 : 20,
        }}>
        <TouchableOpacity
          style={{height: 40, width: 40, marginTop: 3}}
          onPress={goBack}>
          {
            <AntDesign
              name="arrowleft"
              size={26}
              color={theme['color-basic-1000']}
            />
          }
        </TouchableOpacity>
        <View>
          <Text category="h4" style={{color: theme['color-basic-1000']}}>
            All Deals
          </Text>
          <Text category="p2" status="primary">
            Browse all deals type categories, have fun!
          </Text>
        </View>
      </Layout>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          flex: 1,
          backgroundColor: theme['color-basic-300'],
          paddingHorizontal: '5%',
          marginTop: 30,
        }}>
        {deals && deals.length > 0 ? (
          deals.map((deal, index) => {
            return (
              <DealCard
                {...deal}
                key={index}
                onPress={() => goDealDetail(deal)}
                onPressVendor={() => goVendor(deal.vendor)}
              />
            );
          })
        ) : (
          <NoData />
        )}
        <View style={{height: 100}} />
      </ScrollView>
    </View>
  );
};
