import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, SafeAreaView, Platform, StatusBar, KeyboardAvoidingView } from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import EditorToolbar from '../../components/EditorToolbar';
import { styles } from './styles/notet.styles';

export default function NotetScreen() {
    const router = useRouter();
    const [note, setNote] = useState('');
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.dismissButton}>
                        <Feather name="x" size={16} color="#8A8A8C" />
                        <Text style={styles.dismissText}>DISMISS</Text>
                    </TouchableOpacity>
                    <View style={styles.headerRight}>
                        <Text style={styles.journalText}>JOURNAL ENTRY</Text>
                        <View style={styles.dot} />
                    </View>
                </View>

                <View style={styles.content}>
                    <Text style={styles.title}>Your Reflection</Text>
                    <View style={styles.titleUnderline} />

                    {/* Toolbar Box */}
                    <View style={styles.editorContainer}>
                        <EditorToolbar
                            isBold={isBold}
                            isItalic={isItalic}
                            isUnderline={isUnderline}
                            setIsBold={setIsBold}
                            setIsItalic={setIsItalic}
                            setIsUnderline={setIsUnderline}
                            baseColor="#826930"
                            activeColor="#8A8A8C"
                        />

                        <View style={styles.inputWrapper}>
                            {/* Giant 'p.' Watermark */}
                            <Text style={styles.watermark}>p.</Text>

                            <TextInput
                                style={[
                                    styles.textInput,
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
                    </View>

                    <View style={styles.bottomSection}>
                        <View style={styles.divider} />
                        <View style={styles.guidedPrompt}>
                            <Ionicons name="sparkles" size={16} color="#B5965A" style={{ marginRight: 12, marginTop: 2 }} />
                            <View style={{ flex: 1 }}>
                                <Text style={styles.promptLabel}>GUIDED PROMPT</Text>
                                <Text style={styles.promptText}>What is God saying to you today?</Text>
                            </View>
                        </View>

                        <TouchableOpacity style={styles.saveButton}
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

                {/* Footer */}
                <View style={styles.footer}>
                    <View style={styles.footerLeft}>
                        <Feather name="shield" size={10} color="#A3A3A3" />
                        <Text style={styles.footerText}>PRIVATE SANCTUARY</Text>
                    </View>()
                    <Text style={styles.footerTextRight}>SACRED PAUSE EDITORIAL SERIES</Text>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
