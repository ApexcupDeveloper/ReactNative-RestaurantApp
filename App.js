import React, {useEffect} from 'react';
import * as eva from '@eva-design/eva';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import {default as theme} from './theme.json';
import {default as mapping} from './mapping.json';
import {AppNavigator} from './src/navigations/navigation';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import SplashScreen from 'react-native-splash-screen';
import {store, persistor} from './src/redux/store';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import Toast from 'react-native-toast-message';

export default () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <IconRegistry icons={EvaIconsPack} />
          <ApplicationProvider
            {...eva}
            theme={{...eva.dark, ...theme}}
            customMapping={mapping}>
            <AppNavigator />
          </ApplicationProvider>
        </PersistGate>
      </Provider>
      <Toast position="top" autoHide visibilityTime={2000} topOffset={50} />
    </>
  );
};
