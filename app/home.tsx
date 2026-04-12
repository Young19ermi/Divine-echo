import React from 'react';
import { View, Text } from 'react-native';
import { Link } from 'expo-router';

export default function home() {
    return (
        <View>
            <Text>Home</Text>
            <Link href='/user/homes'>About Page</Link>
        </View>
    )
}