// Bottom tab navigator - 5 main tabs
// Wraps the Home, Venues, Log, Summary, and setting stacks

import React from "react";
import { Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Colors, Typography } from "../constants";
import { TabParamList } from "../types";

// Screens
import { HomeScreen } from '../screens/HomeScreen';
import { VenueListScreen } from '../screens/VenueListScreen';
import { LogDrinkScreen } from '../screens/LogDrinkScreen';
import { DailySummaryScreen } from '../screens/DailySummaryScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator<TabParamList>();

// Simple emoji-based tab icons - can be swapped for an icon library later
const getTabIcon = (routeName: keyof TabParamList, focused: boolean) => {
    const icons: Record<keyof TabParamList, string> = {
        Home: '🏠',
        Venues: '📍',
        Log: '➕',
        Summary: '📊',
        Settings: '⚙️',
    };
    return icons[routeName];
};

export const TabNavigator: React.FC = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: Colors.blue,
                tabBarInactiveTintColor: Colors.border,
                tabBarStyle: {
                    backgroundColor: Colors.white,
                    borderTopWidth: 0.5,
                    borderTopColor: Colors.border,
                    height: 56,
                },
                tabBarLabelStyle: {
                    fontFamily: Typography.fontFamily,
                    fontSize: Typography.fontSize.micro,
                },
                tabBarIcon: ({ focused }) => (
                    <Text style={{ fontSize: 20 }}>
                        {getTabIcon(route.name, focused)}
                    </Text>
                ),
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Venues" component={VenueListScreen}/>
            <Tab.Screen name="Log" component={LogDrinkScreen}/>
            <Tab.Screen name="Summary" component={DailySummaryScreen}/>
            <Tab.Screen name="Settings" component={SettingsScreen}/>
        </Tab.Navigator>
    );
};