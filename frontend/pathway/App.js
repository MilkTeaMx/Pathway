import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import {
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import HomePage from "./screens/main/Home";
import TherapyFinderPage from "./screens/main/TherapyFinder";
import TherapyRecomenderPage from "./screens/main/TherapyRecomender";
import LoginScreen from "./screens/auth/LoginScreen";
import SignupScreen from "./screens/auth/SignupScreen";
import SplashScreen from "./screens/auth/SplashScreen";

import * as firebase from "firebase";

import "firebase/firestore";

import Firebasekeys from './config'
let firebaseConfig = Firebasekeys;
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const inactiveColor = "#8E8E8E";
const themecolor = "#2B2D2F";
const tabcolor = "#FF5349";
const Tab = createMaterialBottomTabNavigator();
const Home = createStackNavigator();
const TherapyRecomender = createStackNavigator();
const TherapyFinder = createStackNavigator();

const TherapyRecomenderScreens = ({ navigation }) => {
  return (
    <TherapyRecomender.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: themecolor,
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
    </TherapyRecomender.Navigator>
  );
};

const HomeScreens = ({ navigation }) => {
  return (
    <Home.Navigator
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
      initialRouteName="Home Page"
    >
      <Home.Screen
        name="Home Page"
        component={HomePage}
        options={{
          headerBackTitleVisible: false,
        }}
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
        barStyle={{ backgroundColor: `${themecolor}`, height: HP(8.89) }}
        shifting={true}
      >
        <Tab.Screen
          name="Home Nav"
          component={HomeScreens}
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
          name="Therapy Finder Nav"
          component={TherapyFinderScreens}
          options={{
            tabBarIcon: ({ focused }) => (
              <MaterialCommunityIcons
                name="fire"
                size={24}
                color={focused ? tabcolor : inactiveColor}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Therapy Recomender Nav"
          component={TherapyRecomenderScreens}
          options={{
            tabBarIcon: ({ focused }) => (
              <FontAwesome5
                name="newspaper"
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
