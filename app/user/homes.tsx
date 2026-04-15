import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, SafeAreaView, Platform, StatusBar, KeyboardAvoidingView } from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { Audio } from 'expo-av';
import EditorToolbar from '../../components/EditorToolbar';
import { styles } from './styles/homes.styles';
interface ReflectionData {
    audio_url: string;
    quote_title: string;
    quote_sub: string;
    quote_body: string;
    quote_author: string;
}

export default function HomeScreen() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('For You');
    const tabs = ['For You', 'Gratitude', 'Peace', 'Wisdom'];

    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const [note, setNote] = useState('');
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);

    const [reflection, setReflection] = useState<ReflectionData | null>(null);

    useEffect(() => {
        const fetchReflection = async () => {
            try {
                // Adjust this URL to your actual FastAPI backend endpoint
                // Note: For Android emulator, use 'http://10.0.2.2:8000' instead of 'http://127.0.0.1:8000'
                const response = await fetch('http://127.0.0.1:8000/api/today-reflection');
                if (response.ok) {
                    const data = await response.json();
                    setReflection(data);
                }
            } catch (error) {
                console.error("Error fetching reflection data:", error);
            }
        };

        fetchReflection();
    }, []);

    async function togglePlayPause() {
        if (!sound) {
            const audioUri = reflection?.audio_url || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri: audioUri },
                { shouldPlay: true }
            );
            setSound(newSound);
            setIsPlaying(true);

            newSound.setOnPlaybackStatusUpdate((status: any) => {
                if (status.isLoaded) {
                    setIsPlaying(status.isPlaying);
                }
            });
        } else {
            if (isPlaying) {
                await sound.pauseAsync();
            } else {
                await sound.playAsync();
            }
        }
    }

    useEffect(() => {
        return sound
            ? () => {
                sound.unloadAsync();
            }
            : undefined;
    }, [sound]);

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity>
                            <Feather name="menu" size={24} color="#C19B36" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Divine Echo</Text>
                        <Image
                            source={{ uri: 'https://media.istockphoto.com/id/2153901491/vector/good-shepherd-the-story-of-jesus-christ-parable-of-the-lost-sheep-vector-religious.jpg?s=612x612&w=0&k=20&c=Oup0F7N87_ZR28MV4itpWg5gIN_E2QxiJSwDC65bR2c=' }}
                            style={styles.avatar}
                        />
                    </View>

                    {/* Greeting */}
                    <View style={styles.greetingContainer}>
                        <Text style={styles.greetingUser}>Good Morning, Jeremey </Text>
                        <Text style={styles.greetingSub}>Let's spend a moment with God</Text>
                    </View>

                    {/* Tabs */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsContainer} contentContainerStyle={styles.tabsContent}>
                        {tabs.map((tab) => (
                            <TouchableOpacity
                                key={tab}
                                style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]}
                                onPress={() => setActiveTab(tab)}
                            >
                                <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* Reflection Card */}
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardHeaderTitle}>TODAY'S REFLECTION</Text>
                            <TouchableOpacity style={styles.listenButton} onPress={togglePlayPause}>
                                <Ionicons name={isPlaying ? "pause" : "play"} size={12} color="#C19B36" />
                                <Text style={styles.listenText}>{isPlaying ? "PAUSE" : "LISTEN"}</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.quoteTitle}>{reflection?.quote_title || '"Be still, and know that I am God..."'}</Text>
                        <Text style={styles.quoteSub}>{reflection?.quote_sub || '— PSALM 46:10'}</Text>

                        <Text style={styles.quoteBody}>
                            {reflection?.quote_body || '"Stillness is where God speaks the loudest. In the quiet of the morning, we find the strength to face the..."'}
                        </Text>
                        <Text style={styles.quoteAuthor}>{reflection?.quote_author || 'CHARLES SPURGEON'}</Text>

                        <TouchableOpacity style={styles.readMoreButton} onPress={() => router.push('/user/details')}>
                            <Text style={styles.readMoreText}>Read More</Text>
                            <Feather name="arrow-right" size={16} color="#FFF" style={{ marginLeft: 8 }} />
                        </TouchableOpacity>
                    </View>

                    {/* Notes Section */}
                    <View style={styles.notesSection}>
                        <Text style={styles.notesTitle}>What is God saying to you?</Text>
                        <View style={styles.editorContainer}>
                            <EditorToolbar
                                isBold={isBold}
                                isItalic={isItalic}
                                isUnderline={isUnderline}
                                setIsBold={setIsBold}
                                setIsItalic={setIsItalic}
                                setIsUnderline={setIsUnderline}
                                baseColor="#C59A3F"
                                activeColor="#A3A3A3"
                            />

                            <View style={styles.inputWrapper}>
                                <Text style={styles.watermark}>p.</Text>

                                <TextInput
                                    style={[
                                        styles.editorTextInput,
                                        isBold && { fontWeight: 'bold' },
                                        isItalic && { fontStyle: 'italic' },
                                        isUnderline && { textDecorationLine: 'underline' }
                                    ]}
                                    placeholder="Begin typing your heart's echo..."
                                    placeholderTextColor="#C2C2C2"
                                    multiline
                                    textAlignVertical="top"
                                    value={note}
                                    onChangeText={setNote}
                                />
                            </View>

                            <TouchableOpacity
                                style={styles.saveButtonBox}
                                onPress={() => {
                                    if (note.trim().length > 0) {
                                        router.push({
                                            pathname: '/user/notes',
                                            params: {
                                                noteText: note,
                                                noteDate: 'TODAY\'S REFLECTION',
                                                notePrompt: 'What is God saying to you?'
                                            }
                                        });
                                        setNote('');
                                    }
                                }}
                            >
                                <MaterialCommunityIcons name="book-open-page-variant" size={18} color="#FFF" style={{ marginRight: 8 }} />
                                <Text style={styles.saveButtonText}>Save Reflection</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.bottomSpace} />
                </ScrollView>

                {/* Floating Bottom Tab Bar Mock */}
                <View style={styles.bottomTabBar}>
                    <TouchableOpacity style={styles.tabItem}>
                        <View style={styles.activeTabIndicator} />
                        <Ionicons name="home" size={18} color="#C19B36" />
                        <Text style={[styles.tabItemText, styles.tabItemTextActive]}>HOME</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.tabItem} onPress={() => (router.push('/user/library'))}>
                        <Ionicons name="book" size={18} color="#A3A3A3" />
                        <Text style={styles.tabItemText}>LIBRARY</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.tabItem}>
                        <Ionicons name="person" size={18} color="#A3A3A3" />
                        <Text style={styles.tabItemText}>PROFILE</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}