import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, SafeAreaView, Platform, StatusBar } from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

const INITIAL_NOTES = [
    {
        id: 'n1',
        date: 'OCTOBER 23, 2023',
        prompt: 'What is God saying to you?',
        text: 'A profound sense of peace today. Remembering that I do not need to control every outcome. Surrendering is the path to true freedom.'
    }
];

export default function NotesScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [activeTab, setActiveTab] = useState('Your Notes');
    const [notes, setNotes] = useState(INITIAL_NOTES);

    useEffect(() => {
        if (params?.noteText) {
            const newNoteItem = {
                id: Math.random().toString(),
                date: (params.noteDate as string) || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase(),
                prompt: (params.notePrompt as string) || 'Reflection',
                text: params.noteText as string,
            };

            setNotes((prev) => {
                if(prev.find(item => item.text === newNoteItem.text)) return prev;
                return [newNoteItem, ...prev];
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
                        onPress={() => router.push('/user/library')}
                    >
                        <Text style={[styles.tabText, activeTab === 'Saved Devotionals' && styles.activeTabText]}>
                            Saved Devotionals
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'Your Notes' && styles.activeTab]}
                    >
                        <Text style={[styles.tabText, activeTab === 'Your Notes' && styles.activeTabText]}>
                            Your Notes
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.listContainer}>
                    {notes.map((note) => (
                        <View key={note.id} style={styles.noteCard}>
                            <View style={styles.noteHeader}>
                                <Text style={styles.noteDate}>{note.date}</Text>
                                <TouchableOpacity>
                                    <Feather name="more-horizontal" size={16} color="#A3A3A3" />
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.notePrompt}>{note.prompt}</Text>
                            <Text style={styles.noteText}>{note.text}</Text>
                        </View>
                    ))}
                </View>

                {notes.length === 0 && (
                    <View style={styles.emptyStateBox}>
                        <MaterialCommunityIcons name="star-four-points" size={28} color="#D1CDBF" style={styles.emptyIcon} />
                        <MaterialCommunityIcons name="star-four-points" size={14} color="#D1CDBF" style={styles.emptyIconSmall} />
                        <Text style={styles.emptyStateText}>
                            You haven't written any notes yet. Take a moment to reflect on your journey.
                        </Text>
                    </View>
                )}

                <View style={styles.bottomSpace} />
            </ScrollView>

            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem} onPress={() => router.push('/user/homes')}>
                    <Ionicons name="home" size={24} color="#8A8A8C" />
                    <Text style={styles.navText}>Home</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem} onPress={() => router.push('/user/library')}>
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
    noteCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 24,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
        elevation: 2,
        borderLeftWidth: 4,
        borderLeftColor: '#826930',
    },
    noteHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    noteDate: {
        fontSize: 10,
        fontWeight: '700',
        color: '#A3A3A3',
        letterSpacing: 1.5,
    },
    notePrompt: {
        fontSize: 11,
        color: '#826930',
        fontWeight: '700',
        marginBottom: 10,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    noteText: {
        fontSize: 16,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        color: '#4A4A48',
        lineHeight: 26,
        fontStyle: 'italic',
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
