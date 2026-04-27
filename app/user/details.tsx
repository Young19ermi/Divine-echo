import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, SafeAreaView, Platform, StatusBar } from 'react-native';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Audio } from 'expo-av';
import { styles } from './styles/details.styles';
import { supabase } from '@/lib/supabase';
interface description {
    id: number,
    image_url: string,
    audio_url: string,
    verse_text: string,
    quote_title: string,
    body_text: string,
    verse_reference: string;
    teaching_label: string[],
}
export default function DetailsScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [position, setPosition] = useState(0);
    const [duration, setDuration] = useState(1);
    const [count, setCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

    const [descriptiondata, setdescriptiondata] = useState<description | null>()
    const details_data = async () => {
        try {
            const { data, error } = await supabase

                .from('reflections')
                .select('*')
                .limit(1)
                .order('created_at', { ascending: false })
                .single()

            if (data) {
                setdescriptiondata(data)
            }
            if (error) {
                console.log('error while fetching the description details :', error)
            }
        }
        catch { () => { console.log(Error) } }
    }

    useEffect(() => {
        details_data()
    }, []);

    useEffect(() => {
        if (params && params.title) {
            setdescriptiondata({
                id: Number(params.id) || 1,
                audio_url: (params.audio as string) || '',
                image_url: params.image as string,
                verse_text: (params.verse as string) || 'Be Still and Know that am God.',
                quote_title: (params.title as string),
                body_text: params.description as string,
                verse_reference: params.verse_reference as string,
                teaching_label: params.labels ? JSON.parse(params.labels as string) : ['Reflection', 'Stillness'],
            });
        }
    }, [params]);

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
            const auidioUrl = descriptiondata?.audio_url
            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri: auidioUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
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

    const skipBackward10 = async () => {
        if (sound) {
            const newPosition = Math.max(0, position - 10000);
            await sound.setPositionAsync(newPosition);
        }
    };

    const skipForward10 = async () => {
        if (sound) {
            const newPosition = Math.min(duration, position + 10000);
            await sound.setPositionAsync(newPosition);
        }
    };

    const toggleMute = async () => {
        if (sound) {
            await sound.setIsMutedAsync(!isMuted);
            setIsMuted(!isMuted);
        }
    };

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
    const title = descriptiondata?.verse_text || 'STILLNESS IS WHERE GOD SPEAKS THE LOUDEST. ';
    const max_words = 27;
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
                    <Feather name="arrow-left" size={24} color="#1A1A1D" />
                </TouchableOpacity>

                <View style={styles.headerCenter}>
                    <Text style={styles.headerTitle}>DAY {new Date().getDate()} OF {new Date().toLocaleDateString(undefined, { month: 'short' }).toUpperCase()}</Text>
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
                {/* Audio Player Card */}
                <View style={styles.audioCardWrapper}>

                            <View style={styles.audiotopRow}>
                                {/* <Text style={styles.audioLabel}>
                                    {title.length > max_words ? `${title.slice(0, max_words)}...` : title}
                                </Text> */}
                                </View>
                                <View style={styles.audioCard}>
                                <TouchableOpacity onPress={skipBackward10} style={styles.skipButton}>
                                    <MaterialIcons name="replay-10" size={22} color="#1A1A1D" />
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.playButton} onPress={togglePlayPause}>
                                    <Ionicons name={isPlaying ? "pause" : "play"} size={22} color="#FFF" style={{ marginLeft: isPlaying ? 0 : 3 }} />
                                </TouchableOpacity>

                                <TouchableOpacity onPress={skipForward10} style={styles.skipButton}>
                                    <MaterialIcons name="forward-10" size={22} color="#1A1A1D" />
                                </TouchableOpacity>

                                <View style={styles.audioInfoWrapper}>
                                    <View style={styles.progressBarBg}>
                                        <View style={[styles.progressBarFill, { width: `${progressPercentage}%` }]} />
                                    </View>
                                    <Text style={styles.audioTime}>
                                        {(position > 0 || duration > 1) ? `${formatTime(position)} / ${formatTime(duration)}` : '00:00 / 00:00'}
                                    </Text>
                                </View>
                                </View>
                </View>

                {/* Image retrival */}

                {/* Main Image */}
                <Image
                    source={{ uri: descriptiondata?.image_url || 'https://i.pinimg.com/1200x/26/4f/a3/264fa358757744da91a1b9aea15e5943.jpg' }}
                    style={styles.mainImage}
                />

                {/* The Verse Section */}
                <View style={styles.verseSection}>
                    <Text style={styles.verseLabel}>THE VERSE</Text>
                    <Text style={styles.verseQuote}>{descriptiondata?.verse_text || 'Be Still and Know that am God.'} </Text>
                    <Text style={styles.verseReference}>{descriptiondata?.verse_reference || 'PSALM 46:10'} </Text>
                </View>

                <View style={styles.blockquoteContainer}>
                    <View style={styles.blockquoteLine} />
                    <Text style={styles.blockquoteText}>  {descriptiondata?.quote_title || 'Stillness is where God speaks the loudest.'}</Text>
                </View>

                <View style={styles.bodyTextContainer}>
                    <Text style={styles.bodyText}>
                        {descriptiondata?.body_text || ' In the modern rhythm of constant motion, the act of pausing is not merely a break from work; it is a profound spiritual rebellion. To be still is to consciously relinquish the illusion of control. It is in these quiet fractures of the day that we find the capacity to hear the divine whisper that is often drowned out by the roar of our anxieties.'}
                    </Text>
                    {/* <Text style={styles.bodyText}>
                        {descriptiondata?.quote_body || '  The Hebrew word for "be still" can also be translated as "sink" or "relax." Imagine sinking into the assurance of Gods sovereignty. You are not the architect of the universe; you are a guest in it. Today, find three minutes to simply exist without an agenda. Let the silence become a sanctuary.'}
                    </Text> */}
                </View>

                {/* Tags */}
                <View style={styles.tagsContainer}>
                    {descriptiondata?.teaching_label?.map((tag: string) => (
                        <View key={tag} style={styles.tagPill}>
                            <Text style={styles.tagText}>{tag || 'Joshua'}</Text>
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
                                id: descriptiondata?.id || 1,
                                date: `${new Date().toLocaleDateString(undefined, { month: 'long' })} ${new Date().getDate()}, ${new Date().getFullYear()}`,
                                title: descriptiondata?.quote_title || 'Be Still and Know that am God.',
                                description: descriptiondata?.body_text || 'In the modern rhythm of constant motion, the act of pausing is not merely a break from work; it is a profound spiritual rebellion. To be still is to consciously relinquish the illusion of control. It is in these quiet fractures of the day that we find the capacity to hear the divine whisper that is often drowned out by the roar of our anxieties.',
                                image: descriptiondata?.image_url || 'https://i.pinimg.com/736x/27/59/8b/27598bd9a423db0ec04fff577dd266bf.jpg',
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
