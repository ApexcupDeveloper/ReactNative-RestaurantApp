/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
// const PUSH_ENDPOINT = backend_url + "/token/" + Platform.OS;

const RemotePushController = props => {
  useEffect(() => {
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: async function (token) {
        const fcmToken = await messaging().getToken();
        await AsyncStorage.setItem('deviceType', token.os);
        await AsyncStorage.setItem('deviceToken', fcmToken);
      },

      // (required) Called when a remote or local notification is opened or received
      onNotification: async function (notification) {
        if (notification.foreground) {
          PushNotification.localNotification({
            title: notification.title,
            message: notification.message
          });
        }
        
        props.navigation.navigate('Notification');
        // process the notification here
        notification.finish(PushNotificationIOS.FetchResult.NoData);

      
      },

      onAction: function (notification) {
        console.log('ACTION:', notification.action);
        console.log('NOTIFICATION:', notification);

        // process the action
      },
      onRegistrationError: function (err) {
        console.error(err.message, err);
      },
      //IOS only
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      // Android only: GCM or FCM Sender ID
      senderID: '476078263302',
      popInitialNotification: true,
      requestPermissions: true,
    });
  }, []);

  return null;
};

export default RemotePushController;
