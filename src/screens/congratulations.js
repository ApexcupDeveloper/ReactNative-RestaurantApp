import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { TouchableOpacity, View } from 'react-native';
import { Text, Layout, useTheme } from '@ui-kitten/components';

export const CongratulationsScreen = ({ navigation, route }) => {
  const theme = useTheme();

  const { type, action, quantity, full } = route.params;

  const getDescription = () => {
    if (type === 'stamp') {
      return 'Stamps'
    } else if (type === 'deal') {
      return 'Deals'
    } else if (type === 'reward') {
      return 'Rewards'
    } else {
      return 'Gift Cards'
    }
  }

  const getAction = () => {
    if (action === 'collect') {
      return 'collected'
    } else if (action === 'purchase') {
      return 'purchased'
    } else if (action === 'redeem') {
      return 'redeemed'
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme["color-primary-500"] }}>
      <Layout style={{ flexDirection: 'row', height: 120, paddingTop: 50, paddingHorizontal: '5%', justifyContent: 'center' }}>
        <Text category="h4" style={{ color: theme["color-warning-500"] }}>Congratulations</Text>
      </Layout>
      <View style={{ paddingHorizontal: '5%', justifyContent: 'center', alignItems: 'center' }}>
        {full && type === 'stamp' && action === 'collect' ? (
          <Text style={{ fontSize: 18, textAlign: 'center' }}>You now have a free reward by collecting {quantity} stamps (available in your profile)!</Text>
        ) : (
          <Text style={{ fontSize: 18, textAlign: 'center' }}>You have {getAction()} {quantity} {getDescription()}!</Text>
        )}
         {full && type === 'stamp' && action === 'collect' && (
             <FontAwesome name='gift' size={90} color={theme["color-danger-500"]} style={{ marginTop: 40 }} />
         )}
      </View>
      <TouchableOpacity style={{ backgroundColor: theme["color-danger-500"], height: 46, display: 'flex', alignItems: 'center', justifyContent: 'center', marginHorizontal: '5%', borderRadius: 23, position: 'absolute', bottom: 60, width: '90%' }}
        onPress={() => {
          navigation.navigate("Home")
        }}
      >
        <Text style={{ fontWeight: 'bold' }}>Close</Text>
      </TouchableOpacity>
    </View>
  );
};