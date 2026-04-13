import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, SafeAreaView, Platform, StatusBar } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Audio } from 'expo-av';
import { styles } from './styles/details.styles';

export default function DetailsScreen() {
    const router = useRouter();
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [position, setPosition] = useState(0);
    const [duration, setDuration] = useState(1);
    const [count, setCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);

    const toggleLike = () => {
        if (isLiked) {
            setCount(prev => prev - 1);
            setIsLiked(false);
        } else {
            setCount(prev => prev + 1);
            setIsLiked(true);
        }
    };

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
                    <TouchableOpacity style={styles.actionButton} onPress={toggleLike}>
                        <Ionicons name={isLiked ? "heart" : "heart-outline"} size={22} color={isLiked ? "#c7210bff" : "#4A4A48"} />
                        <Text style={[styles.actionText, isLiked && { color: "#c7210bff" }]}>
                            {count.toLocaleString()}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.actionDivider} />

                <View style={styles.actionRight}>
                    <TouchableOpacity style={styles.actionIconOnly} onPress={() => {
                        router.push({
                            pathname: '/user/library',
                            params: {
                                image: 'https://i.pinimg.com/736x/fc/35/01/fc350123f69b59e3c684f9ce18ec9424.jpg',
                                title: 'PSALM 46:10',
                                description: '"Be still, and know that I am God." In the modern rhythm of constant motion...',
                                date: 'OCTOBER 24, 2023'
                            }
                        });
                    }}>
                        <Ionicons name={isLiked ? "bookmark" : "bookmark-outline"} size={22} color={isLiked ? "#4A4A48" : "#826930"} />
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
