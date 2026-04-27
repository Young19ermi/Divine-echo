import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, SafeAreaView, Platform, StatusBar, KeyboardAvoidingView, Animated, RefreshControl } from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { Audio } from 'expo-av';
import EditorToolbar from '../../components/EditorToolbar';
import { styles } from './styles/homes.styles';
import { House, User } from 'lucide-react-native';
import { supabase } from '../../lib/supabase';
import { LinearGradient } from "expo-linear-gradient";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
interface ReflectionData {
    audio_url: string;
    quote_title: string;
    quote_sub: string;
    quote_body: string;
    quote_author: string;
}
const ShimmerBlock = ({
    width,
    height,
    style,
}: {
    width: number | string;
    height: number;
    style?: any;
}) => {
    const translateX = useRef(new Animated.Value(-1)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(translateX, {
                toValue: 1,
                duration: 1400,
                useNativeDriver: true,
            })
        ).start();
    }, []);

    const shimmerTranslate = translateX.interpolate({
        inputRange: [-1, 1],
        outputRange: [-200, 200], // controls sweep distance
    });

    return (
        <View
            style={[
                {
                    width,
                    height,
                    backgroundColor: "#EAEAEA",
                    borderRadius: 12, // smoother corners
                    overflow: "hidden",
                },
                style,
            ]}
        >
            <Animated.View
                style={[
                    StyleSheet.absoluteFill,
                    { transform: [{ translateX: shimmerTranslate }] },
                ]}
            >
                <LinearGradient
                    colors={["#EAEAEA", "#F5F5F5", "#EAEAEA"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ flex: 1 }}
                />
            </Animated.View>
        </View>
    );
};

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
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const fetchReflectionData = async () => {
        setIsLoading(true);
        try {
            const startTime = Date.now();
            // Fetch the latest or today's reflection from Supabase
            const { data, error } = await supabase
                .from('reflections')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (data) {
                setReflection(data as ReflectionData);
            }

            // Ensure a minimum delay to show the shimmer effect
            const elapsedTime = Date.now() - startTime;
            const minimumDelay = 2000;
            if (elapsedTime < minimumDelay) {
                await new Promise(resolve => setTimeout(resolve, minimumDelay - elapsedTime));
            }
        } catch (error) {
            console.error("Error fetching reflection data from Supabase:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        await fetchReflectionData();
        setRefreshing(false);
        showUpdateNotification();
    }, []);

    const showUpdateNotification = () => {
        Animated.sequence([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.delay(1000), // 1 second notification as requested
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            })
        ]).start();
    };

    useEffect(() => {
        fetchReflectionData();
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
                {/* 1 Second Notification Popup */}
                <Animated.View style={{
                    position: 'absolute',
                    top: Platform.OS === 'ios' ? 50 : 20,
                    alignSelf: 'center',
                    backgroundColor: '#22C55E',
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    borderRadius: 20,
                    opacity: fadeAnim,
                    transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }],
                    zIndex: 1000,
                    elevation: 5,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 4,
                }} pointerEvents="none">
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        {/* <Feather name="check" size={24}  color="#C19B36" /> */}
                       <MaterialCommunityIcons name="check-circle" size={28} color="#F8FAFC" />
                        <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 }}>Content Updated</Text>
                        
                    </View>
                </Animated.View>

                <ScrollView 
                    contentContainerStyle={styles.scrollContent} 
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#C19B36" colors={["#C19B36"]} />
                    }
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity>
                            <Feather name="menu" size={24} color="#C19B36" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Divine Echo</Text>
                        <TouchableOpacity onPress={() => router.push('/user/admin')}>
                            <Image
                                source={{ uri: 'https://media.istockphoto.com/id/2153901491/vector/good-shepherd-the-story-of-jesus-christ-parable-of-the-lost-sheep-vector-religious.jpg?s=612x612&w=0&k=20&c=Oup0F7N87_ZR28MV4itpWg5gIN_E2QxiJSwDC65bR2c=' }}
                                style={styles.avatar}
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Greeting */}
                    <View style={styles.greetingContainer}>
                        <Text style={styles.greetingUser}>Good Morning, Jeremey </Text>
                        <Text style={styles.greetingSub}>Let's spend a moment with God</Text>
                    </View>

                    {/* Tabs */}
                    {isLoading ? (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsContainer} contentContainerStyle={styles.tabsContent}>
                            <ShimmerBlock width={80} height={36} style={{ borderRadius: 18, marginRight: 10 }} />
                            <ShimmerBlock width={100} height={36} style={{ borderRadius: 18, marginRight: 10 }} />
                            <ShimmerBlock width={80} height={36} style={{ borderRadius: 18, marginRight: 10 }} />
                            <ShimmerBlock width={90} height={36} style={{ borderRadius: 18 }} />
                        </ScrollView>
                    ) : (
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
                    )}

                    {/* Reflection Card */}
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardHeaderTitle}>TODAY'S REFLECTION</Text>
                            <TouchableOpacity style={styles.listenButton} onPress={togglePlayPause}>
                                <Ionicons name={isPlaying ? "pause" : "play"} size={12} color="#C19B36" />
                                <Text style={styles.listenText}>{isPlaying ? "PAUSE" : "LISTEN"}</Text>
                            </TouchableOpacity>
                        </View>

                        {isLoading ? (
                            <View style={{ marginVertical: 10 }}>
                                {/* Title Skeleton (2 lines) */}
                                <ShimmerBlock width="85%" height={32} style={{ marginBottom: 10 }} />
                                <ShimmerBlock width="60%" height={32} style={{ marginBottom: 20 }} />

                                {/* Subtitle Skeleton */}
                                <ShimmerBlock width="35%" height={14} style={{ marginBottom: 24 }} />

                                {/* Body Skeleton (3 lines) */}
                                <ShimmerBlock width="100%" height={16} style={{ marginBottom: 8 }} />
                                <ShimmerBlock width="95%" height={16} style={{ marginBottom: 8 }} />
                                <ShimmerBlock width="80%" height={16} style={{ marginBottom: 24 }} />

                                {/* Author Skeleton */}
                                <ShimmerBlock width="40%" height={12} style={{ marginBottom: 8 }} />
                            </View>
                        ) : (
                            <>
                                <Text style={styles.quoteTitle}>{reflection?.quote_title || 'Be still, and know that I am God...'}</Text>
                                <Text style={styles.quoteSub}>{`— `}{reflection?.quote_sub || 'PSALM 46:10'}</Text>

                                <Text style={styles.quoteBody}>
                                    {reflection?.quote_body || '"Stillness is where God speaks the loudest. In the quiet of the morning, we find the strength to face the..."'}
                                </Text>
                                <Text style={styles.quoteAuthor}>{reflection?.quote_author || 'CHARLES SPURGEON'}</Text>
                            </>
                        )}

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
                        {/* <MaterialCommunityIcons name="library" size={24} color="black" /> */}

                        {/* <Ionicons name="home" size={20} color="#C19B36" /> */}
                        <House size={20} color='#C19B36' />
                        <Text style={[styles.tabItemText, styles.tabItemTextActive]}>HOME</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.tabItem} onPress={() => (router.push('/user/library'))}>
                        <MaterialCommunityIcons name="library-outline" size={20} color="#C59A3F" />
                        <Text style={[styles.tabItemText, styles.tabItemTextActive]}>LIBRARY</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.tabItem}>
                        {/* <Ionicons name="person" size={20} color="#A3A3A3" /> */}
                        <MaterialCommunityIcons name='headphones' size={20} color="#C59A3F" />
                        <Text style={[styles.tabItemText, styles.tabItemTextActive]}>LISTEN</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}