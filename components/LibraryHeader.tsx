import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function LibraryHeader() {
    const router = useRouter();
    return (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
                <Feather name="menu" size={24} color="#826930" />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Sacred Pause</Text>

            <TouchableOpacity style={styles.iconButton}>
                <Image
                    source={{ uri: 'https://i.pravatar.cc/100' }}
                    style={styles.profilePic}
                />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    iconButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        fontStyle: 'italic',
        fontWeight: 'bold',
        color: '#826930',
        letterSpacing: 0.5,
    },
    profilePic: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#1A1A1D',
    },
});
