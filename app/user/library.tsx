import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, SafeAreaView, Platform, StatusBar } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

import LibraryHeader from '../../components/LibraryHeader';
import LibraryBottomNav from '../../components/LibraryBottomNav';
import LibraryTabs from '../../components/LibraryTabs';
import { styles } from './styles/library.styles';

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
            setActiveTab('Saved Devotionals');
        }
    }, [params]);

    return (
        <SafeAreaView style={styles.safeArea}>
            <LibraryHeader />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.titleSection}>
                    <Text style={styles.pageTitle}>Library</Text>
                    <Text style={styles.pageSubtitle}>Your collection of quiet moments and reflections.</Text>
                </View>

                <LibraryTabs activeTab="Saved Devotionals" />

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

            <LibraryBottomNav activeScreen="Library" />
        </SafeAreaView>
    );
}
