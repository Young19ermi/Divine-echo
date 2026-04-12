import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, SafeAreaView, Platform, StatusBar } from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

// Dummy data from mockups
const INITIAL_DATA = [
    {
        id: '1',
        date: 'OCTOBER 24, 2023',
        title: 'Finding Stillness in the Storm',
        description: '"Be still, and know that I am..." A meditation on Psalm 46:10...',
        image: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    },
    {
        id: '2',
        date: 'OCTOBER 21, 2023',
        title: 'The Breath of Creation',
        description: 'How every morning is a renewal of grace. Exploring...',
        image: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    },
    {
        id: '3',
        date: 'OCTOBER 18, 2023',
        title: 'Tiny Mercies',
        description: 'Gratitude for the small things that sustain us through diffic...',
        image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    },
    {
        id: '4',
        date: 'OCTOBER 15, 2023',
        title: 'Wisdom in the Waiting',
        description: 'Refining our patience when answers seem far away. A...',
        image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    }
];

export default function LibraryScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [activeTab, setActiveTab] = useState('Saved Devotionals');
    const [devotionals, setDevotionals] = useState(INITIAL_DATA);

    useEffect(() => {
        if (params?.image && params?.title && params?.description) {
            const newItem = {
                id: Math.random().toString(),
                date: (params.date as string) || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase(),
                title: params.title as string,
                description: params.description as string,
                image: params.image as string,
            };

            setDevotionals((prev) => {
                if (prev.find(item => item.title === newItem.title)) {
                    return prev;
                }
                return [newItem, ...prev];
            });
        }
    }, [params]);

    return (
        <SafeAreaView style={styles.safeArea}>
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

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.titleSection}>
                    <Text style={styles.pageTitle}>Library</Text>
                    <Text style={styles.pageSubtitle}>Your collection of quiet moments and reflections.</Text>
                </View>

                <View style={styles.tabsContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'Saved Devotionals' && styles.activeTab]}
                        onPress={() => setActiveTab('Saved Devotionals')}
                    >
                        <Text style={[styles.tabText, activeTab === 'Saved Devotionals' && styles.activeTabText]}>
                            Saved Devotionals
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'Your Notes' && styles.activeTab]}
                        onPress={() => setActiveTab('Your Notes')}
                    >
                        <Text style={[styles.tabText, activeTab === 'Your Notes' && styles.activeTabText]}>
                            Your Notes
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.listContainer}>
                    {devotionals.map((item) => (
                        <View key={item.id} style={styles.card}>
                            <Image source={{ uri: item.image }} style={styles.cardImage} />

                            <View style={styles.cardContent}>
                                <Text style={styles.cardDate}>{item.date}</Text>
                                <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
                                <Text style={styles.cardDescription} numberOfLines={2}>{item.description}</Text>
                            </View>

                            <TouchableOpacity style={styles.bookmarkIcon}>
                                <Ionicons name="bookmark" size={16} color="#826930" />
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>

                <View style={styles.emptyStateBox}>
                    <MaterialCommunityIcons name="star-four-points" size={28} color="#D1CDBF" style={styles.emptyIcon} />
                    <MaterialCommunityIcons name="star-four-points" size={14} color="#D1CDBF" style={styles.emptyIconSmall} />
                    <Text style={styles.emptyStateText}>
                        Tap the heart or bookmark icon on any devotional to save it here for reflection.
                    </Text>
                </View>

                <View style={styles.bottomSpace} />
            </ScrollView>

            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem} onPress={() => router.push('/user/homes')}>
                    <Ionicons name="home" size={24} color="#8A8A8C" />
                    <Text style={styles.navText}>Home</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem}>
                    <Ionicons name="book" size={24} color="#826930" />
                    <Text style={[styles.navText, styles.activeNavText]}>Library</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem} onPress={() => { }}>
                    <Ionicons name="person" size={24} color="#8A8A8C" />
                    <Text style={styles.navText}>Profile</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FAF8F3',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
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
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 16,
    },
    titleSection: {
        marginBottom: 30,
    },
    pageTitle: {
        fontSize: 36,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        fontWeight: 'bold',
        color: '#1A1A1D',
        marginBottom: 8,
    },
    pageSubtitle: {
        fontSize: 15,
        fontStyle: 'italic',
        color: '#8A8A8C',
        lineHeight: 22,
    },
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
    listContainer: {
        marginBottom: 20,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 12,
        marginBottom: 16,
        alignItems: 'center',
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
        elevation: 2,
    },
    cardImage: {
        width: 80,
        height: 80,
        borderRadius: 16,
        marginRight: 16,
    },
    cardContent: {
        flex: 1,
        paddingRight: 20,
    },
    cardDate: {
        fontSize: 10,
        fontWeight: '700',
        color: '#A3A3A3',
        letterSpacing: 1.5,
        marginBottom: 6,
    },
    cardTitle: {
        fontSize: 16,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        fontWeight: 'bold',
        color: '#1A1A1D',
        marginBottom: 4,
        lineHeight: 22,
    },
    cardDescription: {
        fontSize: 12,
        color: '#8A8A8C',
        fontStyle: 'italic',
        lineHeight: 18,
    },
    bookmarkIcon: {
        position: 'absolute',
        top: 16,
        right: 16,
    },
    emptyStateBox: {
        borderWidth: 1,
        borderColor: '#EBE9DD',
        borderStyle: 'dashed',
        borderRadius: 20,
        padding: 30,
        alignItems: 'center',
        marginTop: 10,
    },
    emptyIcon: {
        marginBottom: -10,
        marginLeft: -10,
    },
    emptyIconSmall: {
        marginBottom: 16,
        marginLeft: 20,
    },
    emptyStateText: {
        fontSize: 13,
        color: '#A3A3A3',
        textAlign: 'center',
        lineHeight: 20,
        paddingHorizontal: 10,
    },
    bottomSpace: {
        height: 100,
    },
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
