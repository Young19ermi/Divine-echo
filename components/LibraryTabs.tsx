import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

interface LibraryTabsProps {
    activeTab: 'Saved Devotionals' | 'Your Notes';
}

export default function LibraryTabs({ activeTab }: LibraryTabsProps) {
    const router = useRouter();
    return (
        <View style={styles.tabsContainer}>
            <TouchableOpacity
                style={[styles.tab, activeTab === 'Saved Devotionals' && styles.activeTab]}
                onPress={() => router.push('/user/library')}
            >
                <Text style={[styles.tabText, activeTab === 'Saved Devotionals' && styles.activeTabText]}>
                    Saved Devotionals
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.tab, activeTab === 'Your Notes' && styles.activeTab]}
                onPress={() => router.push('/user/notes')}
            >
                <Text style={[styles.tabText, activeTab === 'Your Notes' && styles.activeTabText]}>
                    Your Notes
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    tabsContainer: {
        flexDirection: 'row',
        marginBottom: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#EBE9DD',
    },
    tab: {
        marginRight: 24,
        paddingBottom: 12,
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#826930',
    },
    tabText: {
        fontSize: 14,
        color: '#A3A3A3',
        fontWeight: '500',
    },
    activeTabText: {
        color: '#826930',
        fontWeight: '600',
    },
});
