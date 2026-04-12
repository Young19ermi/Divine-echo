import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, SafeAreaView, Platform, StatusBar, KeyboardAvoidingView } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { Audio } from 'expo-av';

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

    async function togglePlayPause() {
        if (!sound) {
            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
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
                        <Text style={styles.headerTitle}>Sacred Pause</Text>
                        <Image
                            source={{ uri: 'https://media.istockphoto.com/id/2153901491/vector/good-shepherd-the-story-of-jesus-christ-parable-of-the-lost-sheep-vector-religious.jpg?s=612x612&w=0&k=20&c=Oup0F7N87_ZR28MV4itpWg5gIN_E2QxiJSwDC65bR2c=' }}
                            style={styles.avatar}
                        />
                    </View>

                    {/* Greeting */}
                    <View style={styles.greetingContainer}>
                        <Text style={styles.greetingUser}>Good Morning, Daniel</Text>
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

                        <Text style={styles.quoteTitle}>"Be still, and know that I am God..."</Text>
                        <Text style={styles.quoteSub}>— PSALM 46:10</Text>

                        <Text style={styles.quoteBody}>
                            "Stillness is where God speaks the loudest. In the quiet of the morning, we find the strength to face the..."
                        </Text>
                        <Text style={styles.quoteAuthor}>CHARLES SPURGEON</Text>

                        <TouchableOpacity style={styles.readMoreButton} onPress={() => router.push('/user/details')}>
                            <Text style={styles.readMoreText}>Read More</Text>
                            <Feather name="arrow-right" size={16} color="#FFF" style={{ marginLeft: 8 }} />
                        </TouchableOpacity>
                    </View>

                    {/* Notes Section */}
                    <View style={styles.notesSection}>
                        <Text style={styles.notesTitle}>What is God saying to you?</Text>
                        <View style={styles.editorContainer}>
                            <View style={styles.toolbar}>
                                <TouchableOpacity style={[styles.toolbarButton, isBold && styles.toolbarButtonActive]} onPress={() => setIsBold(!isBold)}>
                                    <Feather name="bold" size={16} color={isBold ? "#C59A3F" : "#8A8A8C"} />
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.toolbarButton, isItalic && styles.toolbarButtonActive]} onPress={() => setIsItalic(!isItalic)}>
                                    <Feather name="italic" size={16} color={isItalic ? "#C59A3F" : "#8A8A8C"} />
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.toolbarButton, isUnderline && styles.toolbarButtonActive]} onPress={() => setIsUnderline(!isUnderline)}>
                                    <Feather name="underline" size={16} color={isUnderline ? "#C59A3F" : "#8A8A8C"} />
                                </TouchableOpacity>
                                <View style={styles.toolbarDivider} />
                                <TouchableOpacity style={styles.toolbarButton}>
                                    <Feather name="list" size={16} color="#8A8A8C" />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.toolbarButton}>
                                    <Feather name="align-left" size={16} color="#8A8A8C" />
                                </TouchableOpacity>
                            </View>
                            
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
                                    if(note.trim().length > 0) {
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

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F8F6F0',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 32,
    },
    headerTitle: {
        fontSize: 22,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        fontStyle: 'italic',
        fontWeight: 'bold',
        color: '#C19B36',
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#E5DCC5',
    },
    greetingContainer: {
        marginBottom: 24,
    },
    greetingUser: {
        fontSize: 30,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        fontWeight: 'bold',
        color: '#1A1A1D',
        marginBottom: 8,
    },
    greetingSub: {
        fontSize: 15,
        color: '#8A8A8C',
    },
    tabsContainer: {
        marginBottom: 32,
        maxHeight: 40,
    },
    tabsContent: {
        paddingRight: 24,
    },
    tabButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#F0EFE9',
        borderRadius: 20,
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabButtonActive: {
        backgroundColor: '#C59A3F',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#4A4A48',
    },
    tabTextActive: {
        color: '#FFFFFF',
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 24,
        marginBottom: 40,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.04,
        shadowRadius: 16,
        elevation: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 22,
    },
    cardHeaderTitle: {
        fontSize: 11,
        fontWeight: '700',
        color: '#C59A3F',
        letterSpacing: 1.5,
    },
    listenButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FDF7E7',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 16,
    },
    listenText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#C59A3F',
        marginLeft: 6,
        letterSpacing: 1,
    },
    quoteTitle: {
        fontSize: 24,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        color: '#1A1A1D',
        lineHeight: 34,
        marginBottom: 12,
    },
    quoteSub: {
        fontSize: 13,
        fontStyle: 'italic',
        color: '#8A8A8C',
        marginBottom: 24,
        letterSpacing: 0.5,
    },
    quoteBody: {
        fontSize: 15,
        fontStyle: 'italic',
        color: '#4A4A48',
        lineHeight: 24,
        marginBottom: 16,
    },
    quoteAuthor: {
        fontSize: 11,
        fontWeight: '700',
        color: '#8A8A8C',
        letterSpacing: 1,
        marginBottom: 28,
    },
    readMoreButton: {
        flexDirection: 'row',
        backgroundColor: '#C59A3F',
        borderRadius: 16,
        paddingVertical: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    readMoreText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 15,
    },
    notesSection: {
        marginBottom: 40,
    },
    notesTitle: {
        fontSize: 22,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        fontWeight: 'bold',
        color: '#1A1A1D',
        marginBottom: 12,
    },
    editorContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#EAE8E0',
        marginBottom: 28,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.04,
        shadowRadius: 16,
        elevation: 4,
    },
    toolbar: {
        flexDirection: 'row',
        padding: 12,
        backgroundColor: '#FCFBFA',
        borderBottomWidth: 1,
        borderBottomColor: '#F0EEE5',
        alignItems: 'center',
    },
    toolbarButton: {
        width: 32,
        height: 32,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 4,
    },
    toolbarButtonActive: {
        backgroundColor: '#F3EFE6',
    },
    toolbarDivider: {
        width: 1,
        height: 20,
        backgroundColor: '#E0DCD3',
        marginHorizontal: 8,
    },
    inputWrapper: {
        position: 'relative',
        padding: 10,
        height: 390,
    },
    editorTextInput: {
        flex: 1,
        fontSize: 16,
        color: '#1A1A1D',
        lineHeight: 26,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        zIndex: 2, 
    },
    watermark: {
        position: 'absolute',
        bottom: 9,
        right: 10,
        fontSize: 160,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        fontStyle: 'italic',
        fontWeight: 'bold',
        color: '#F8F6F0',
        zIndex: 1,
    },
    saveButtonBox: {
        backgroundColor: '#C59A3F',
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        paddingVertical: 18,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 13,
        letterSpacing: 1,
    },
    bottomSpace: {
        height: 120,
    },
    bottomTabBar: {
        position: 'absolute',
        bottom: 12,
        left: 20,
        right: 18,
        backgroundColor: 'rgba(255, 255, 255, 0.85)', // Semi-transparent so scrolling content behind is visible
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderRadius: 50,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.06,
        shadowRadius: 40,
        elevation: 8,
    },
    tabItem: {
        alignItems: 'center',
        paddingVertical: 12,
        flex: 1,
    },
    activeTabIndicator: {
        position: 'absolute',
        bottom: 12,
        width: 28,
        height: 4,
        backgroundColor: '#FFFFFF',
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
    },
    tabItemText: {
        fontSize: 10,
        color: '#A3A3A3',
        marginTop: 6,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    tabItemTextActive: {
        color: '#C59A3F',
    }
});