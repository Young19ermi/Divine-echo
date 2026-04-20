import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, SafeAreaView, Platform, StatusBar } from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

import LibraryHeader from '../../components/LibraryHeader';
import LibraryBottomNav from '../../components/LibraryBottomNav';
import LibraryTabs from '../../components/LibraryTabs';
import { styles } from './styles/notes.styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import home from '../home';

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
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const load_notes = async () => {
            try {
                const saved_notes = await AsyncStorage.getItem('saved_notes') //
                if (saved_notes) {
                    setNotes(JSON.parse(saved_notes))
                }
            } catch (error) {
                console.log('Erro while fetching the Local Storage Data')
            } finally {
                setLoaded(true)
            }
        }; load_notes()
    }, [])
    useEffect(() => {
        if (!loaded) return; // Wait for initial load to prevent overwriting storage

        if (params?.noteText) {
            const newNoteItem = {
                id: (params.id as string) || Math.random().toString(),
                date: (params.noteDate as string) || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase(),
                prompt: (params.notePrompt as string) || 'Reflection',
                text: params.noteText as string,
            };
            setNotes((prev) => {
                let updated_data;
                const existingIndex = prev.findIndex(item => item.id === newNoteItem.id);
                if (existingIndex >= 0) {
                    updated_data = [...prev];
                    updated_data[existingIndex] = newNoteItem;
                } else if (prev.find(item => item.text === newNoteItem.text)) {
                    return prev;
                } else {
                    updated_data = [newNoteItem, ...prev];
                }

                AsyncStorage.setItem('saved_notes', JSON.stringify(updated_data))
                    .catch(err => { console.log("error while fetching the data: ", err) })

                return updated_data
            });
            router.setParams({ noteText: "", id: "", noteDate: "", notePrompt: "" });
        }
    }, [params, loaded]);

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
                        <TouchableOpacity 
                            key={note.id} 
                            style={styles.noteCard}
                            onPress={() => {
                                router.push({
                                    pathname: '/user/notet',
                                    params: {
                                        id: note.id,
                                        noteText: note.text,
                                        noteDate: note.date,
                                        notePrompt: note.prompt
                                    }
                                });
                            }}
                        >
                            <View style={styles.noteHeader}>
                                <Text style={styles.noteDate}>{note.date}</Text>
                                <TouchableOpacity>
                                    <MaterialCommunityIcons 
                                        name="delete" 
                                        size={20} 
                                        color="#ce1515ff" 
                                        onPress={async () => { 
                                            const filteredNotes = notes.filter(n => n.id !== note.id);
                                            setNotes(filteredNotes);
                                            await AsyncStorage.setItem('saved_notes', JSON.stringify(filteredNotes));
                                        }} 
                                    />
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.notePrompt}>{note.prompt}</Text>
                            <Text style={styles.noteText}>{note.text}</Text>
                        </TouchableOpacity>
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
