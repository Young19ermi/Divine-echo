import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, SafeAreaView, Platform, StatusBar } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Audio } from 'expo-av';

export default function DetailsScreen() {
    const router = useRouter();
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [position, setPosition] = useState(0);
    const [duration, setDuration] = useState(1);

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
                    setPosition(status.positionMillis);
                    setDuration(status.durationMillis || 1);
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

    const formatTime = (millis: number) => {
        const totalSeconds = Math.floor(millis / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const progressPercentage = duration > 0 ? (position / duration) * 100 : 0;

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
                    <Feather name="arrow-left" size={24} color="#1A1A1D" />
                </TouchableOpacity>

                <View style={styles.headerCenter}>
                    <Text style={styles.headerTitle}>DAY 12 OF 30</Text>
                    <View style={styles.headerProgress} />
                </View>

                <View style={styles.headerRight}>
                    <TouchableOpacity style={styles.iconButton}>
                        <Feather name="more-vertical" size={24} color="#1A1A1D" />
                    </TouchableOpacity>
                    <View style={styles.profileCircle} />
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Audio Player Card */}
                <View style={styles.audioCard}>
                    <TouchableOpacity style={styles.playButton} onPress={togglePlayPause}>
                        <Ionicons name={isPlaying ? "pause" : "play"} size={20} color="#FFF" style={{ marginLeft: isPlaying ? 0 : 2 }} />
                    </TouchableOpacity>
                    <View style={styles.audioInfo}>
                        <View style={styles.audioTopRow}>
                            <Text style={styles.audioLabel}>NARRATED AUDIO</Text>
                            <Text style={styles.audioTime}>{(position > 0 || duration > 1) ? `${formatTime(position)} / ${formatTime(duration)}` : '00:00 / 00:00'}</Text>
                        </View>
                        <View style={styles.progressBarBg}>
                            <View style={[styles.progressBarFill, { width: `${progressPercentage}%` }]} />
                            <View style={[styles.progressBarDot, { left: `${progressPercentage}%` }]} />
                        </View>
                    </View>
                </View>

                {/* Main Image */}
                <Image
                    source={{ uri: 'https://i.pinimg.com/736x/fc/35/01/fc350123f69b59e3c684f9ce18ec9424.jpg' }}
                    style={styles.mainImage}
                />

                {/* The Verse Section */}
                <View style={styles.verseSection}>
                    <Text style={styles.verseLabel}>THE VERSE</Text>
                    <Text style={styles.verseQuote}>"Be still, and know that I am God."</Text>
                    <Text style={styles.verseReference}>PSALM 46:10</Text>
                </View>

                <View style={styles.blockquoteContainer}>
                    <View style={styles.blockquoteLine} />
                    <Text style={styles.blockquoteText}>"Stillness is where God speaks the loudest."</Text>
                </View>

                <View style={styles.bodyTextContainer}>
                    <Text style={styles.bodyText}>
                        In the modern rhythm of constant motion, the act of pausing is not merely a break from work; it is a profound spiritual rebellion. To be still is to consciously relinquish the illusion of control. It is in these quiet fractures of the day that we find the capacity to hear the divine whisper that is often drowned out by the roar of our anxieties.
                    </Text>
                    <Text style={styles.bodyText}>
                        The Hebrew word for "be still" can also be translated as "sink" or "relax." Imagine sinking into the assurance of God's sovereignty. You are not the architect of the universe; you are a guest in it. Today, find three minutes to simply exist without an agenda. Let the silence become a sanctuary.
                    </Text>
                </View>

                {/* Tags */}
                <View style={styles.tagsContainer}>
                    {['PEACE', 'MEDITATION', 'PSALMS'].map(tag => (
                        <View key={tag} style={styles.tagPill}>
                            <Text style={styles.tagText}>{tag}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.bottomSpace} />
            </ScrollView>

            {/* Floating Action Bar */}
            <View style={styles.floatingActionBar}>
                <View style={styles.actionLeft}>
                    <TouchableOpacity style={styles.actionButton}>
                        <Ionicons name="heart" size={22} color="#4A4A48" />
                        <Text style={styles.actionText}>2,400</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.actionDivider} />

                <View style={styles.actionRight}>
                    <TouchableOpacity style={styles.actionIconOnly}>
                        <Ionicons name="bookmark" size={22} color="#4A4A48" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.reflectButton} onPress={() => router.push('/user/notet')}>
                        <Feather name="edit-2" size={14} color="#FFF" />
                        <Text style={styles.reflectButtonText}>Reflect</Text>
                    </TouchableOpacity>
                </View>
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
    headerCenter: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 10,
        fontWeight: '700',
        color: '#8A8A8C',
        letterSpacing: 2,
        marginBottom: 6,
    },
    headerProgress: {
        width: 32,
        height: 2,
        backgroundColor: '#826930',
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#1A1A1D',
        marginLeft: 12,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 16,
    },
    audioCard: {
        backgroundColor: '#F4ECE1',
        borderRadius: 20,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    playButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#826930',
        justifyContent: 'center',
        alignItems: 'center',
    },
    audioInfo: {
        flex: 1,
        marginLeft: 16,
    },
    audioTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    audioLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: '#826930',
        letterSpacing: 1.5,
    },
    audioTime: {
        fontSize: 10,
        color: '#8A8A8C',
    },
    progressBarBg: {
        height: 3,
        backgroundColor: '#DFD8CC',
        borderRadius: 1.5,
        position: 'relative',
        justifyContent: 'center',
    },
    progressBarFill: {
        height: 3,
        backgroundColor: '#826930',
        borderRadius: 1.5,
        width: '35%',
    },
    progressBarDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#826930',
        position: 'absolute',
        left: '35%',
        marginLeft: -4,
    },
    mainImage: {
        width: '100%',
        height: 180,
        borderRadius: 24,
        marginBottom: 44,
    },
    verseSection: {
        alignItems: 'center',
        marginBottom: 44,
    },
    verseLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: '#A3A3A3',
        letterSpacing: 3,
        marginBottom: 24,
    },
    verseQuote: {
        fontSize: 30,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        fontStyle: 'italic',
        color: '#1A1A1D',
        textAlign: 'center',
        lineHeight: 44,
        marginBottom: 20,
        paddingHorizontal: 16,
    },
    verseReference: {
        fontSize: 10,
        fontWeight: '700',
        color: '#A3A3A3',
        letterSpacing: 2,
    },
    blockquoteContainer: {
        flexDirection: 'row',
        marginBottom: 40,
        paddingLeft: 4,
    },
    blockquoteLine: {
        width: 2,
        backgroundColor: '#D1CDBF',
        marginRight: 20,
    },
    blockquoteText: {
        flex: 1,
        fontSize: 18,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        fontStyle: 'italic',
        color: '#4A4A48',
        lineHeight: 28,
    },
    bodyTextContainer: {
        marginBottom: 32,
    },
    bodyText: {
        fontSize: 15,
        color: '#4A4A48',
        lineHeight: 28,
        marginBottom: 24,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 20,
    },
    tagPill: {
        backgroundColor: '#EBE9DD',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        marginRight: 10,
        marginBottom: 10,
    },
    tagText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#4A4A48',
        letterSpacing: 1,
    },
    bottomSpace: {
        height: 120,
    },
    floatingActionBar: {
        position: 'absolute',
        bottom: 30,
        left: 20,
        right: 20,
        backgroundColor: '#FFFFFF',
        borderRadius: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.08,
        shadowRadius: 24,
        elevation: 8,
    },
    actionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#1A1A1D',
        marginLeft: 10,
    },
    actionDivider: {
        width: 1,
        height: 24,
        backgroundColor: '#F0F0F0',
        marginHorizontal: 16,
    },
    actionRight: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        justifyContent: 'flex-end',
    },
    actionIconOnly: {
        marginRight: 20,
    },
    reflectButton: {
        backgroundColor: '#826930',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderRadius: 24,
    },
    reflectButtonText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 13,
        marginLeft: 8,
    },
});
