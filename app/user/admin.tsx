import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, SafeAreaView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../lib/supabase';
import { styles } from './styles/admin.styles';

export default function AdminScreen() {
    const router = useRouter();

    // UI States
    const [activeTab, setActiveTab] = useState('EDITOR'); // 'METRICS', 'EDITOR', 'DRAFTS', 'SETTINGS'
    const [isPublishing, setIsPublishing] = useState(false);
    const [drafts, setDrafts] = useState<any[]>([]);

    // Form States
    const [heroImageUri, setHeroImageUri] = useState<string | null>(null);
    const [audioUri, setAudioUri] = useState<string | null>(null);
    const [verseRef, setVerseRef] = useState('');
    const [verseText, setVerseText] = useState('');
    const [author, setAuthor] = useState('');
    const [quote, setQuote] = useState('');
    const [reflectionBody, setReflectionBody] = useState('');
    const [teachingLabel, setTeachingLabel] = useState<string[]>([]);

    const TEACHING_LABELS = [
        { value: 'devotion', label: 'Devotion' },
        { value: 'prayer', label: 'Prayer'},
        { value: 'teaching', label: 'Teaching' },
        { value: 'seasonal', label: 'Seasonal' },
        { value: 'testimony', label: 'Testimony' }
    ];

    const toggleTeachingLabel = (value: string) => {
        if (teachingLabel.includes(value)) {
            setTeachingLabel(teachingLabel.filter(l => l !== value));
        } else {
            if (teachingLabel.length < 2) {
                setTeachingLabel([...teachingLabel, value]);
            } else {
                Alert.alert("Limit Reached", "You can select up to 2 teaching labels.");
            }
        }
    };

    useEffect(() => {
        loadDrafts();
    }, []);

    const loadDrafts = async () => {
        try {
            const stored = await AsyncStorage.getItem('admin_drafts');
            if (stored) setDrafts(JSON.parse(stored));
        } catch (e) {
            console.error(e);
        }
    };

    const saveAsDraft = async () => {
        if (!verseRef && !reflectionBody && !author && !heroImageUri) {
            Alert.alert("Notice", "Nothing to save as a draft yet.");
            return;
        }

        const newDraft = {
            id: Date.now().toString(),
            date: new Date().toLocaleDateString(),
            heroImageUri,
            audioUri,
            verseRef,
            verseText,
            author,
            quote,
            reflectionBody,
            teachingLabel
        };

        try {
            const updated = [newDraft, ...drafts];
            await AsyncStorage.setItem('admin_drafts', JSON.stringify(updated));
            setDrafts(updated);
            Alert.alert("Success", "Saved to Drafts safely.");
        } catch (e) {
            Alert.alert("Error", "Could not save draft");
        }
    };

    const loadDraft = (draft: any) => {
        setHeroImageUri(draft.heroImageUri);
        setAudioUri(draft.audioUri);
        setVerseRef(draft.verseRef);
        setVerseText(draft.verseText);
        setAuthor(draft.author);
        setQuote(draft.quote);
        setReflectionBody(draft.reflectionBody);
        setTeachingLabel(draft.teachingLabel || []);
        setActiveTab('EDITOR');
    };

    const deleteDraft = async (id: string) => {
        const updated = drafts.filter(d => d.id !== id);
        await AsyncStorage.setItem('admin_drafts', JSON.stringify(updated));
        setDrafts(updated);
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'images',
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.8,
        });

        if (!result.canceled) {
            setHeroImageUri(result.assets[0].uri);
        }
    };

    const pickAudio = async () => {
        let result = await DocumentPicker.getDocumentAsync({
            type: ['audio/mpeg', 'audio/wav', 'audio/mp3'],
            copyToCacheDirectory: true,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            setAudioUri(result.assets[0].uri);
        }
    };

    const uploadFileToSupabase = async (uri: string, bucket: string, path: string) => {
        try {
            const response = await fetch(uri);
            const blob = await response.blob();

            const { data, error } = await supabase.storage.from(bucket).upload(path, blob, {
                contentType: blob.type || 'application/octet-stream',
                upsert: true,
            });

            if (error) {
                console.warn(error);

            };

            const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(path);
            return publicUrlData.publicUrl;
        } catch (error) {
            console.warn("Storage upload failed:", error);
            return uri; // Return local uri as fallback if bucket not created
        }
    };

    const handlePublish = async () => {
        if (!verseRef || !reflectionBody) {
            Alert.alert("Validation Error", "Please provide at least a Verse Reference and Reflection Body.");
            return;
        }

        setIsPublishing(true);
        try {
            let finalImageUrl = 'https://images.unsplash.com/photo-1542281286-9e0a16bb7366';
            let finalAudioUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

            const timestamp = Date.now();

            if (heroImageUri && !heroImageUri.startsWith('http')) {
                const ext = heroImageUri.split('.').pop() || 'jpg';
                const path = `heroes/${timestamp}.${ext}`;
                finalImageUrl = await uploadFileToSupabase(heroImageUri, 'assets', path);
            } else if (heroImageUri) {
                finalImageUrl = heroImageUri;
            }

            if (audioUri && !audioUri.startsWith('http')) {
                const ext = audioUri.split('.').pop() || 'mp3';
                const path = `audio/${timestamp}.${ext}`;
                finalAudioUrl = await uploadFileToSupabase(audioUri, 'assets', path);
            } else if (audioUri) {
                finalAudioUrl = audioUri;
            }

            // Insert into Supabase table "reflections"
            const { error } = await supabase.from('reflections').insert({
                image_url: finalImageUrl,
                audio_url: finalAudioUrl,
                verse_reference: verseRef,
                verse_text: verseText,
                quote_author: author,
                quote_body: quote,
                quote_title: quote.substring(0, 50),
                quote_sub: verseRef,
                body_text: reflectionBody,
                teaching_label: teachingLabel,
                created_at: new Date().toISOString()
            });

            if (error) {
                console.warn(error);
                throw new Error("Error", error);
            }

            Alert.alert("Success", "Reflection published successfully!");

            // Clear fields 
            setHeroImageUri(null);
            setAudioUri(null);
            setVerseRef('');
            setVerseText('');
            setAuthor('');
            setQuote('');
            setReflectionBody('');
            setTeachingLabel([]);

        } catch (error: any) {
            Alert.alert("Publish Failed", error || "Ensure your Supabase table and Storage buckets are correctly configured.");
        } finally {
            setIsPublishing(false);
        }
    };

    const chartData = [
        { label: 'MON', height: 40, active: false },
        { label: 'TUE', height: 60, active: false },
        { label: 'WED', height: 50, active: false },
        { label: 'THU', height: 80, active: false },
        { label: 'FRI', height: 55, active: false },
        { label: 'SAT', height: 90, active: false },
        { label: 'TODAY', height: 75, active: true },
    ];

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.headerLeft}>
                            <TouchableOpacity onPress={() => router.back()}>
                                <MaterialCommunityIcons name="shield-check" size={24} color="#8A713F" />
                            </TouchableOpacity>
                            <Text style={styles.headerTitle}>Admin Sanctuary</Text>
                        </View>
                        <TouchableOpacity>
                            <Ionicons name="notifications" size={20} color="#8A713F" />
                        </TouchableOpacity>
                    </View>

                    {activeTab === 'EDITOR' && (
                        <>
                            {/* Chart Section */}
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Reflection Engagement</Text>
                                <Text style={styles.sectionSubtitle}>LAST 7 DAYS</Text>
                            </View>

                            <View style={styles.chartContainer}>
                                {chartData.map((item, index) => (
                                    <View key={index} style={styles.barCol}>
                                        <View style={[styles.barBg, { height: item.height, backgroundColor: item.active ? '#B5965A' : '#F2EFE6' }]} />
                                        <Text style={[styles.barLabel, { color: item.active ? '#6B582E' : '#B0AA9F' }]}>{item.label}</Text>
                                    </View>
                                ))}
                            </View>

                            {/* Hero Image Section */}
                            <Text style={[styles.sectionTitle, { marginBottom: 15 }]}>Hero Image</Text>
                            <View style={styles.heroImageContainer}>
                                <Image
                                    source={{ uri: heroImageUri || 'https://images.unsplash.com/photo-1542281286-9e0a16bb7366' }}
                                    style={styles.heroImage}
                                />
                                <View style={styles.heroImageOverlay} />
                                <TouchableOpacity style={styles.changeHeroBtn} onPress={pickImage}>
                                    <MaterialCommunityIcons name="image-outline" size={16} color="#6B582E" />
                                    <Text style={styles.changeHeroBtnText}>{heroImageUri ? 'Hero Image Selected' : 'Change Hero Image'}</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Devotional Audio Section */}
                            <Text style={[styles.sectionTitle, { marginBottom: 15 }]}>Devotional Audio</Text>
                            <TouchableOpacity style={styles.audioContainer} onPress={pickAudio}>
                                <View style={styles.audioIconCircle}>
                                    <MaterialCommunityIcons name={audioUri ? "music-box-outline" : "cloud-upload"} size={24} color={audioUri ? "#B5965A" : "#8A713F"} />
                                </View>
                                <Text style={styles.audioTitle}>{audioUri ? 'Audio Ready to Subbmit' : 'Upload Devotional Audio (MP3/WAV)'}</Text>
                                <Text style={styles.audioSub}>MAX FILE SIZE: 50MB</Text>
                            </TouchableOpacity>

                            {/* Scripture Verse Divider */}
                            <View style={styles.dividerContainer}>
                                <View style={styles.dividerLine} />
                                <Text style={styles.dividerText}>Scripture Verse</Text>
                                <View style={styles.dividerLine} />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>VERSE REFERENCE</Text>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="e.g. Psalm 23:1-3"
                                    placeholderTextColor="#C2C2C2"
                                    value={verseRef}
                                    onChangeText={setVerseRef}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>SCRIPTURE TEXT</Text>
                                <TextInput
                                    style={styles.textArea}
                                    placeholder="The Lord is my shepherd; I shall not want..."
                                    placeholderTextColor="#C2C2C2"
                                    multiline
                                    value={verseText}
                                    onChangeText={setVerseText}
                                />
                            </View>

                            {/* Key Wisdom Divider */}
                            <View style={styles.dividerContainer}>
                                <View style={styles.dividerLine} />
                                <Text style={styles.dividerText}>Key Wisdom</Text>
                                <View style={styles.dividerLine} />
                            </View>

                            <View style={styles.keyWisdomContainer}>
                                <View style={styles.keyWisdomInputGroup}>
                                    <Text style={styles.inputLabel}>AUTHOR / PREACHER</Text>
                                    <TextInput
                                        style={styles.keyWisdomInput}
                                        placeholder="Charles Spurgeon"
                                        placeholderTextColor="#C2C2C2"
                                        value={author}
                                        onChangeText={setAuthor}
                                    />
                                </View>
                                <View style={styles.keyWisdomInputGroup}>
                                    <Text style={styles.inputLabel}>KEY QUOTE</Text>
                                    <TextInput
                                        style={styles.keyWisdomTextArea}
                                        placeholder="Faith goes up the stairs that love has built..."
                                        placeholderTextColor="#C2C2C2"
                                        multiline
                                        value={quote}
                                        onChangeText={setQuote}
                                    />
                                </View>
                            </View>
                            {/* Teaching Label using Chips */}
                            <View style={styles.inputGroup}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                    <Text style={styles.inputLabel}>TEACHING LABEL (Select up to 2)</Text>
                                    <Text style={{ fontSize: 12, color: '#A8A39B' }}>{teachingLabel.length}/2</Text>
                                </View>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                                    {TEACHING_LABELS.map(option => {
                                        const isSelected = teachingLabel.includes(option.value);
                                        return (
                                            <TouchableOpacity
                                                key={option.value}
                                                onPress={() => toggleTeachingLabel(option.value)}
                                                style={{
                                                    paddingVertical: 8,
                                                    paddingHorizontal: 16,
                                                    borderRadius: 20,
                                                    borderWidth: 1,
                                                    borderColor: isSelected ? '#B5965A' : '#E0DCD3',
                                                    backgroundColor: isSelected ? '#F2EFE6' : '#FFF',
                                                }}
                                            >
                                                <Text style={{
                                                    fontSize: 14,
                                                    color: isSelected ? '#6B582E' : '#8A857D',
                                                    fontWeight: isSelected ? '600' : '400'
                                                }}>
                                                    {option.label}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            </View>
                            {/* Reflection Body */}
                            <View style={styles.editorHeader}>
                                <Text style={[styles.sectionTitle, { marginBottom: 0 }]}>Reflection Body</Text>
                                <View style={styles.editorToolbar}>
                                    <TouchableOpacity><Text style={{ fontWeight: 'bold', color: '#4A4A48' }}>B</Text></TouchableOpacity>
                                    <TouchableOpacity><Text style={{ fontStyle: 'italic', fontWeight: 'bold', color: '#4A4A48' }}>I</Text></TouchableOpacity>
                                    <TouchableOpacity><MaterialCommunityIcons name="format-quote-close" size={18} color="#4A4A48" /></TouchableOpacity>
                                </View>
                            </View>

                            <TextInput
                                style={styles.bodyTextArea}
                                placeholder="Pour out the morning's inspiration here..."
                                placeholderTextColor="#C2C2C2"
                                multiline
                                value={reflectionBody}
                                onChangeText={setReflectionBody}
                            />

                            <TouchableOpacity
                                style={[styles.publishBtn, isPublishing && { opacity: 0.7 }]}
                                onPress={handlePublish}
                                disabled={isPublishing}
                            >
                                {isPublishing ? (
                                    <ActivityIndicator color="#FFF" />
                                ) : (
                                    <MaterialCommunityIcons name="creation" size={20} color="#FFF" />
                                )}
                                <Text style={styles.publishBtnText}>{isPublishing ? 'Publishing...' : 'Publish Now'}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.draftBtn} onPress={saveAsDraft}>
                                <Text style={styles.draftBtnText}>Save as Draft</Text>
                            </TouchableOpacity>
                        </>
                    )}

                    {activeTab === 'DRAFTS' && (
                        <View style={styles.draftsContainer}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Saved Drafts</Text>
                            </View>

                            {drafts.length === 0 ? (
                                <Text style={styles.draftEmptyText}>No drafts saved yet. Tap "Save as Draft" while editing to store your work here!</Text>
                            ) : (
                                drafts.map((draft) => (
                                    <TouchableOpacity
                                        key={draft.id}
                                        style={styles.draftItem}
                                        onPress={() => loadDraft(draft)}
                                    >
                                        <View style={styles.draftItemLeft}>
                                            <Text style={styles.draftDate}>{draft.date}</Text>
                                            <Text style={styles.draftTitle} numberOfLines={1}>{draft.verseRef || 'Untitled Draft'}</Text>
                                            <Text style={styles.draftSub} numberOfLines={1}>{draft.reflectionBody || 'No content yet...'}</Text>
                                        </View>
                                        <TouchableOpacity style={styles.draftDeleteBtn} onPress={() => deleteDraft(draft.id)}>
                                            <Feather name="trash-2" size={16} color="#A8A39B" />
                                        </TouchableOpacity>
                                    </TouchableOpacity>
                                ))
                            )}
                        </View>
                    )}

                    {/* Empty Space for Bottom Nav */}
                    <View style={{ height: 60 }} />

                </ScrollView>

                {/* Bottom Navigation */}
                <View style={styles.bottomNav}>
                    <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('METRICS')}>
                        <Feather name="bar-chart-2" size={18} color={activeTab === 'METRICS' ? "#6B582E" : "#A8A39B"} style={styles.navIcon} />
                        <Text style={[styles.navText, activeTab === 'METRICS' && styles.navTextActive]}>METRICS</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('EDITOR')}>
                        <Feather name="edit-3" size={18} color={activeTab === 'EDITOR' ? "#6B582E" : "#A8A39B"} style={styles.navIcon} />
                        <Text style={[styles.navText, activeTab === 'EDITOR' && styles.navTextActive]}>EDITOR</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('DRAFTS')}>
                        <MaterialCommunityIcons name="content-save-edit-outline" size={18} color={activeTab === 'DRAFTS' ? "#6B582E" : "#A8A39B"} style={styles.navIcon} />
                        <Text style={[styles.navText, activeTab === 'DRAFTS' && styles.navTextActive]}>DRAFTS</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('SETTINGS')}>
                        <Feather name="settings" size={18} color={activeTab === 'SETTINGS' ? "#6B582E" : "#A8A39B"} style={styles.navIcon} />
                        <Text style={[styles.navText, activeTab === 'SETTINGS' && styles.navTextActive]}>SETTINGS</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
