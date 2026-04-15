import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, SafeAreaView, Platform, StatusBar } from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

import LibraryHeader from '../../components/LibraryHeader';
import LibraryBottomNav from '../../components/LibraryBottomNav';
import LibraryTabs from '../../components/LibraryTabs';
import { styles } from './styles/notes.styles';

// // Dummy Datas
// const INITIAL_NOTES = [
//     {
//         id: 'n1',
//         date: 'OCTOBER 23, 2023',
//         prompt: 'What is God saying to you?',
//         text: 'A profound sense of peace today. Remembering that I do not need to control every outcome. Surrendering is the path to true freedom.'
//     }
// ];

// Interface
interface data {
    id: string;
    date: string;
    prompt: string;
    text: string;
}
export default function NotesScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [activeTab, setActiveTab] = useState('Your Notes');
    const [notes, setNotes] = useState<data[]>([]);

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
            <LibraryHeader />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.titleSection}>
                    <Text style={styles.pageTitle}>Library</Text>
                    <Text style={styles.pageSubtitle}>Your collection of quiet moments and reflections.</Text>
                </View>

                <LibraryTabs activeTab="Your Notes" />

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

            <LibraryBottomNav activeScreen="Library" />
        </SafeAreaView>
    );
}
