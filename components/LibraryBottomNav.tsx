import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface LibraryBottomNavProps {
    activeScreen: 'Home' | 'Library' | 'Profile';
}

export default function LibraryBottomNav({ activeScreen }: LibraryBottomNavProps) {
    const router = useRouter();
    return (
        <View style={styles.bottomNav}>
            <TouchableOpacity style={styles.navItem} onPress={() => router.push('/user/homes')}>
                <Ionicons name="home" size={24} color={activeScreen === 'Home' ? "#826930" : "#8A8A8C"} />
                <Text style={[styles.navText, activeScreen === 'Home' && styles.activeNavText]}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navItem} onPress={() => router.push('/user/library')}>
                <Ionicons name="book" size={24} color={activeScreen === 'Library' ? "#826930" : "#8A8A8C"} />
                <Text style={[styles.navText, activeScreen === 'Library' && styles.activeNavText]}>Library</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navItem} onPress={() => { }}>
                <Ionicons name="person" size={24} color={activeScreen === 'Profile' ? "#826930" : "#8A8A8C"} />
                <Text style={[styles.navText, activeScreen === 'Profile' && styles.activeNavText]}>Profile</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    bottomNav: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        backgroundColor: '#FAF8F3',
        paddingVertical: 12,
        paddingBottom: Platform.OS === 'ios' ? 30 : 12,
        justifyContent: 'space-around',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#EBE9DD',
    },
    navItem: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    navText: {
        fontSize: 10,
        marginTop: 4,
        color: '#8A8A8C',
        fontWeight: '500',
    },
    activeNavText: {
        color: '#826930',
        fontWeight: '600',
    },
});
