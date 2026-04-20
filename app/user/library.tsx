import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, SafeAreaView, Platform, StatusBar } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LibraryHeader from '../../components/LibraryHeader';
import LibraryBottomNav from '../../components/LibraryBottomNav';
import LibraryTabs from '../../components/LibraryTabs';
import { styles } from './styles/library.styles';

interface param {
    id: string;
    date: string;
    title: string;
    description: string;
    image: string;
}
export default function LibraryScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [activeTab, setActiveTab] = useState('Saved Devotionals');
    const [devotionals, setDevotionals] = useState<param[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const loadDevotionals = async () => {
            try {
                const storedDevotionals = await AsyncStorage.getItem('saved_devotionals');
                if (storedDevotionals) {
                    setDevotionals(JSON.parse(storedDevotionals));
                }
            } catch (error) {
                console.error('Failed to load devotionals from AsyncStorage:', error);
            } finally {
                setIsLoaded(true);
            }
        };
        loadDevotionals();
    }, []);

    useEffect(() => {
        if (!isLoaded) return; // Wait for initial load to prevent overwriting storage

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
                const updatedData = [newItem, ...prev];
                AsyncStorage.setItem('saved_devotionals', JSON.stringify(updatedData)).catch(err =>
                    console.error('Failed to save to AsyncStorage:', err)
                );
                return updatedData;
            });
            setActiveTab('Saved Devotionals');

            // Clear params so it doesn't repeatedly process on focus changes
            router.setParams({ image: "", title: "", description: "" });
        }
    }, [params, isLoaded]); // Re-run when isLoaded becomes true

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
                        <TouchableOpacity 
                            key={item.id} 
                            style={styles.card}
                            onPress={() => {
                                router.push({
                                    pathname: '/user/details',
                                    params: {
                                        id: item.id,
                                        title: item.title,
                                        description: item.description,
                                        image: item.image,
                                        date: item.date
                                    }
                                });
                            }}
                        >
                            <Image source={{ uri: item.image }} style={styles.cardImage} />

                            <View style={styles.cardContent}>
                                <Text style={styles.cardDate}>{item.date}</Text>
                                <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
                                <Text style={styles.cardDescription} numberOfLines={2}>{item.description}</Text>
                            </View>

                            <TouchableOpacity style={styles.bookmarkIcon}>
                                <Ionicons name="bookmark" size={16} color="#826930" />
                            </TouchableOpacity>
                        </TouchableOpacity>
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
