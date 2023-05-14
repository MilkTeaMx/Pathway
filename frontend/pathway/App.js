import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import {
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";


import HomePage from "./screens/main/Home";
import TherapyResponseScreen from "./screens/main/TherapyResponse";
import TherapyFinderPage from "./screens/main/TherapyFinder";
import TherapyRecomenderPage from "./screens/main/TherapyRecomender";
import LoginScreen from "./screens/auth/LoginScreen";
import SignupScreen from "./screens/auth/SignupScreen";
import SplashScreen from "./screens/auth/SplashScreen";
import QuoteGeneratorPage from './screens/main/QuoteGenerator'



// v9 compat packages are API compatible with v8 code
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import Firebasekeys from './config'
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { theme } from "native-base";
let firebaseConfig = Firebasekeys;
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}



const inactiveColor = "#8E8E8E";
const themecolor = "#28407E";
const tabcolor = "#fff";
const Tab = createMaterialBottomTabNavigator();
const Home = createMaterialTopTabNavigator();
const Motivation = createStackNavigator();
const TherapyRecomender = createStackNavigator();
const TherapyFinder = createStackNavigator();
const Auth = createStackNavigator();

const TherapyRecomenderScreens = ({ navigation }) => {
  return (
    <TherapyRecomender.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: themecolor,
          marginTop: 20
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          color: "#fff",
        },
      }}
      initialRouteName="Therapy Recommender Screen"
    >
      <TherapyRecomender.Screen
        name="Therapy Recommender Screen"
        component={TherapyRecomenderPage}
        options={{
          headerBackTitleVisible: false,
        }}
      />
      <TherapyRecomender.Screen
        name="Therapy Response Screen"
        component={TherapyResponseScreen}
        options={{
          headerBackTitleVisible: false,
        }}
      />
    </TherapyRecomender.Navigator>
  );
};


const Homes = () => {
  return (
    <Motivation.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: themecolor,
          marginTop: 20
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          color: "#fff",
        },
      }}
      initialRouteName="Dashboard"
    >
      <Motivation.Screen
        name="Dashboard"
        component={HomeScreens}
        options={{
          headerBackTitleVisible: false,
        }}
      />
    </Motivation.Navigator>
  );
};
// function Homes() {
//   return (
//       <Motivation.Navigator initialRouteName="Dashboard">
//         <Motivation.Screen name="Dashboard" component={HomePage} 
//          screenOptions={{
//           headerShown: true,
//           headerStyle: {
//             backgroundColor: themecolor,
//             marginTop: 20
//           },
//           headerTintColor: "#fff",
//           headerTitleStyle: {
//             color: "#fff",
//           },
//         }}
//         />
//       </Motivation.Navigator>
//   );
// }

const HomeScreens = ({ navigation }) => {
  return (
    <Home.Navigator
      initialRouteName="Home Screen"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#8E8E8E',
          headerTintColor: '#fff',
        },
      }}
    >
      <Home.Screen
        name="Home Screen"
        component={HomePage}
        options={{
          headerTitle: "Home",

        }}
      />
      <Home.Screen
        name="Quote Generator"
        component={QuoteGeneratorPage}
      />
    </Home.Navigator>
  );
};

const TherapyFinderScreens = ({ navigation }) => {
  return (
    <TherapyFinder.Navigator
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: themecolor,
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          color: "#fff",
        },
      }}
      initialRouteName="Therapy Finder"
    >
      <TherapyFinder.Screen
        name="Therapy Finder Page"
        component={TherapyFinderPage}
        options={{
          headerBackTitleVisible: false,
        }}
      />
    </TherapyFinder.Navigator>
  );
};

function MainTabs() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Dashboard"
        sceneAnimationEnabled="true"
        activeColor={tabcolor}
        inactiveColor={inactiveColor}
        barStyle={{ backgroundColor: `${themecolor}`}}
        shifting={true}
      >
        <Tab.Screen
          name="Home Nav"
          component={Homes}
          options={{
            tabBarIcon: ({ focused }) => (
              <MaterialCommunityIcons
                name="view-dashboard"
                size={26}
                color={focused ? tabcolor : inactiveColor}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Therapy Finder"
          component={TherapyFinderScreens}
          options={{
            tabBarIcon: ({ focused }) => (
              <FontAwesome5
              name="search-location"
                size={24}
                color={focused ? tabcolor : inactiveColor}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Therapy Recomender"
          component={TherapyRecomenderScreens}
          options={{
            tabBarIcon: ({ focused }) => (
              <FontAwesome5
                name="hands-helping"
                size={23}
                color={focused ? tabcolor : inactiveColor}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
function AuthNavigator() {
  return (
    <NavigationContainer>
      <Auth.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Auth.Screen name="Splash" component={SplashScreen} options={{}} />
        <Auth.Screen name="Login" component={LoginScreen} options={{}} />
        <Auth.Screen name="Register" component={SignupScreen} options={{}} />
      </Auth.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(); // Handle user state changes

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  if (!user) {
    return <AuthNavigator />;
  }

  return <MainTabs />;
}
