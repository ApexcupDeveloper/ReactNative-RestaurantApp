import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { RootNavigator } from './root_navigation';

export const AppNavigator = () => (
    <NavigationContainer>
        <RootNavigator />
    </NavigationContainer>
);