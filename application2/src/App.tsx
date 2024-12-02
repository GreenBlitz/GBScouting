import React from "react";
import "./App.css";

import { NavigationContainer, NavigationProp, NavigationState, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Button } from "react-native";

import ScouterTab from "./scouter/ScoutingTab";
import MatchList from "./scouter/MatchList";
import ScanningTab from "./scouter/scanner/ScanningTab";
import GeneralTab from "./strategy/GeneralTab";
import TeamTab from "./strategy/TeamTab";

const Stack = createStackNavigator();

function getHiddenImage(path: string) {
  return (
    <div
      style={{
        backgroundImage: 'url("' + path + '")',
        width: 0,
        height: 0,
      }}
    >
    </div>
  );
}

export function renderScouterNavBar(navigation: (Omit<NavigationProp<ReactNavigation.RootParamList>, "getState"> & { getState(): NavigationState | undefined; }) | undefined) {
  return (
      <nav className="nav-bar">
        {getHiddenImage("./src/assets/Crescendo Map.png")}
        {getHiddenImage("./src/assets/Blue Auto Map.png")}
        {getHiddenImage("./src/assets/Red Auto Map.png")}
        <ul>
          <li>
            <Button title="Match List" onPress={() => navigation.navigate("/")} />
          </li>
          <li>
            <Link to="/ScouterTab">Scout Game</Link>
          </li>
          <li>
            <Link to="/ScannerTab">Scan Match</Link>
          </li>
        </ul>
      </nav>
  );
}

export function renderStrategyNavBar() {
  return (
    <nav className="nav-bar">
      <ul>
        <li>
          <Link to="/TeamTab">Team Data</Link>
        </li>
        <li>
          <Link to="/GeneralTab">General</Link>
        </li>
      </ul>
    </nav>
  );
}

const App: React.FC = () => {
  
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="/ScannerTab" component={ScanningTab} />
        <Stack.Screen name="/" component={MatchList} />
        <Stack.Screen name="/ScouterTab" component={ScouterTab} />
        <Stack.Screen name="/TeamTab" component={TeamTab} />
        <Stack.Screen name="/GeneralTab" component={GeneralTab} />
      </Stack.Navigator>
    </NavigationContainer>
  ); 
};

export default App;
