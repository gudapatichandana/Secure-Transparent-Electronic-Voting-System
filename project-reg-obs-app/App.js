import * as React from 'react';
import './src/styles';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AccountProvider } from './src/context/AccountContext';
import RootNavigator from './src/screens/RootNavigator';

function App() {
  return (
    <SafeAreaProvider>
      <AccountProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </AccountProvider>
    </SafeAreaProvider>
  );
}

export default App;
