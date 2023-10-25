import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomNavigation, BottomNavigationTab, Layout, Text, useTheme } from '@ui-kitten/components';
import { HomeScreen } from '../screens/home';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ExploreScreen } from '../screens/explore';
import { DealsScreen } from '../screens/deals';
import { ProfileScreen } from '../screens/profile';
import { AroundmeScreen } from '../screens/around';
import { createStackNavigator } from '@react-navigation/stack';
import { NotificationScreen } from '../screens/notification';
import { AllDealsScreen } from '../screens/alldeals';
import { RestaurantDetailScreen } from '../screens/restaurant_detail';
import { RewardsScreen } from '../screens/rewards';
import { VenuesScreen } from '../screens/venues';
import { YourDealsScreen } from '../screens/your_deals';
import { DealDetailScreen } from '../screens/deal_detail';
import { StambzDetailScreen } from '../screens/stambz_detail';
import { GiftDetailScreen } from '../screens/gift_detail';
import { EditProfileScreen } from '../screens/edit_profile';
import { CollectScreen } from '../screens/collect';
import { QrCodeScreen } from '../screens/qrcode';
import { CongratulationsScreen } from '../screens/congratulations';
import { NotificationDetailScreen } from '../screens/notification_detail';
import { useSelector } from 'react-redux';

const { Navigator, Screen } = createBottomTabNavigator();
const Stack = createStackNavigator();

const BottomTabBar = ({ navigation, state }) => {
    const theme = useTheme()
    return (
        <Layout style={{ paddingBottom: 20, backgroundColor: 'transaprent', position: 'absolute', bottom: 0, width: '90%', marginHorizontal: '5%', borderRadius: 8 }}>
            <BottomNavigation
                selectedIndex={state.index}
                onSelect={index => navigation.navigate(state.routeNames[index])}
                style={{ borderRadius: 8, paddingVertical: 10 }}
                appearance='noIndicator'
            >
                <BottomNavigationTab
                    icon={(e) => {
                        return <Ionicons size={24} name="home" color={state.index === 0 ? theme["color-warning-500"] : theme["color-basic-300"]} />
                    }}
                    title={(e) => {
                        return <Text {...e} style={[styles.bottomText, { color: state.index === 0 ? theme["color-warning-500"] : theme["color-basic-300"] }]}>Home</Text>
                    }} />
                <BottomNavigationTab
                    icon={(e) => {
                        return <Ionicons size={24} name="map" color={state.index === 1 ? theme["color-warning-500"] : theme["color-basic-300"]} />
                    }}
                    title={(e) => {
                        return <Text {...e} style={[styles.bottomText, { color: state.index === 1 ? theme["color-warning-500"] : theme["color-basic-300"] }]}>Explore</Text>
                    }} />
                <BottomNavigationTab
                    icon={(e) => {
                        return <Ionicons size={24} name="pricetags" color={state.index === 2 ? theme["color-warning-500"] : theme["color-basic-300"]} />
                    }}
                    title={(e) => {
                        return <Text {...e} style={[styles.bottomText, { color: state.index === 2 ? theme["color-warning-500"] : theme["color-basic-300"] }]}>Deals</Text>
                    }} />
                <BottomNavigationTab
                    icon={(e) => {
                        return <Ionicons size={24} name="person" color={state.index === 3 ? theme["color-warning-500"] : theme["color-basic-300"]} />
                    }}
                    title={(e) => {
                        return <Text {...e} style={[styles.bottomText, { color: state.index === 3 ? theme["color-warning-500"] : theme["color-basic-300"] }]}>Profile</Text>
                    }} />
            </BottomNavigation>
        </Layout>

    )
};

const HomeRootNavigator = () => (
    <Navigator screenOptions={{ headerShown: false }} tabBar={props => <BottomTabBar {...props} />}
        initialRouteName="Home"
    >
        <Screen name='Home' component={HomeScreen} listeners={({ navigation }) => ({
            tabPress: e => {
                e.preventDefault();
                navigation.navigate("Home")
            },
        })} />
        <Screen name='Explore' component={ExploreScreen} />
        <Screen name='Deals' component={DealsScreen} />
        <Screen name='Profile' component={ProfileScreen} />
    </Navigator>
);

export const HomeNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="HomeRoot">
            <Stack.Screen name='HomeRoot' component={HomeRootNavigator}  />
            <Stack.Screen name='Around' component={AroundmeScreen} />
            <Stack.Screen name='Notification' component={NotificationScreen} />
            <Stack.Screen name='AllDeals' component={AllDealsScreen} />
            <Stack.Screen name='RestaurantDetail' component={RestaurantDetailScreen} />
            <Stack.Screen name='Rewards' component={RewardsScreen} />
            <Stack.Screen name='Venues' component={VenuesScreen} />
            <Stack.Screen name='YourDeals' component={YourDealsScreen} />
            <Stack.Screen name='DealDetail' component={DealDetailScreen} />
            <Stack.Screen name='StambzDetail' component={StambzDetailScreen} />
            <Stack.Screen name='GiftDetail' component={GiftDetailScreen} />
            <Stack.Screen name='EditProfile' component={EditProfileScreen} />
            <Stack.Screen name='Collect' component={CollectScreen} />
            <Stack.Screen name='QrCodeScreen' component={QrCodeScreen} />
            <Stack.Screen name='Congratulations' component={CongratulationsScreen} />
            <Stack.Screen name='NotificationDetail' component={NotificationDetailScreen} />
        </Stack.Navigator>
    )
}


const styles = StyleSheet.create({
    bottomText: {
        fontWeight: 'bold'
    }
});