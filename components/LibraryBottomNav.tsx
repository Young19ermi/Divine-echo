import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
// import { styles } from './styles/homes.styles';
import { House, User } from 'lucide-react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from '@/app/user/styles/homes.styles';
interface LibraryBottomNavProps {
    activeScreen: 'Home' | 'Library' | 'LISTEN';
}

export default function LibraryBottomNav({ activeScreen }: LibraryBottomNavProps) {
    const router = useRouter();
    return (
        <View style={styles.bottomTabBar}>
            <TouchableOpacity style={styles.tabItem} onPress={() => (router.push('/user/homes'))}>
                <View style={styles.activeTabIndicator} />
                <House size={20} color='#C19B36' />
                <Text style={[styles.tabItemText, styles.tabItemTextActive]}>HOME</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tabItem} onPress={() => (router.push('/user/library'))}>
                <MaterialCommunityIcons name="library-outline" size={20} color="#C59A3F" />
                <Text style={[styles.tabItemText, styles.tabItemTextActive]}>LIBRARY</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tabItem}>
                <MaterialCommunityIcons name="headphones" size={20} color="#C59A3F" />
                <Text style={[styles.tabItemText, styles.tabItemTextActive]}>LISTEN</Text>
            </TouchableOpacity>
        </View>
    );
}
