import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, SafeAreaView, Platform, StatusBar, KeyboardAvoidingView } from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

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
                        <View style={styles.toolbar}>
                            <TouchableOpacity style={[styles.toolbarButton, isBold && styles.toolbarButtonActive]} onPress={() => setIsBold(!isBold)}>
                                <Feather name="bold" size={16} color={isBold ? "#826930" : "#8A8A8C"} />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.toolbarButton, isItalic && styles.toolbarButtonActive]} onPress={() => setIsItalic(!isItalic)}>
                                <Feather name="italic" size={16} color={isItalic ? "#826930" : "#8A8A8C"} />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.toolbarButton, isUnderline && styles.toolbarButtonActive]} onPress={() => setIsUnderline(!isUnderline)}>
                                <Feather name="underline" size={16} color={isUnderline ? "#826930" : "#8A8A8C"} />
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

                        <TouchableOpacity style={styles.saveButton}>
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
                    </View>
                    <Text style={styles.footerTextRight}>SACRED PAUSE EDITORIAL SERIES</Text>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F7F5EE',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 24,
    },
    dismissButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 4,
    },
    dismissText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#8A8A8C',
        letterSpacing: 1.5,
        marginLeft: 6,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    journalText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#A8A8A8',
        letterSpacing: 2,
        marginRight: 8,
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#4A4A48',
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 34,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        fontWeight: 'bold',
        color: '#1A1A1D',
        marginBottom: 8,
    },
    titleUnderline: {
        width: 40,
        height: 2,
        backgroundColor: '#B5965A',
        marginBottom: 32,
    },
    editorContainer: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#EAE8E0',
        marginBottom: 32,
        overflow: 'hidden',
    },
    toolbar: {
        flexDirection: 'row',
        padding: 8,
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
        flex: 1,
        position: 'relative',
        padding: 20,
    },
    textInput: {
        flex: 1,
        fontSize: 18,
        color: '#4A4A48',
        lineHeight: 28,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        zIndex: 2, 
    },
    watermark: {
        position: 'absolute',
        bottom: -20,
        right: 10,
        fontSize: 240,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        fontStyle: 'italic',
        fontWeight: 'bold',
        color: '#EFECE1',
        zIndex: 1,
        lineHeight: 240,
    },
    bottomSection: {
        marginBottom: 32,
    },
    divider: {
        width: '100%',
        height: 1,
        backgroundColor: '#EAE6DA',
        marginBottom: 24,
    },
    guidedPrompt: {
        flexDirection: 'row',
        marginBottom: 32,
    },
    promptLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: '#A3A3A3',
        letterSpacing: 1.5,
        marginBottom: 6,
    },
    promptText: {
        fontSize: 18,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        fontStyle: 'italic',
        color: '#826930',
        lineHeight: 24,
    },
    saveButton: {
        backgroundColor: '#A0834B',
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        shadowColor: '#A0834B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    saveButtonText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '700',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingBottom: 24,
        alignItems: 'center',
    },
    footerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    footerText: {
        fontSize: 8,
        fontWeight: '700',
        color: '#A3A3A3',
        letterSpacing: 1.5,
        marginLeft: 6,
    },
    footerTextRight: {
        fontSize: 8,
        fontWeight: '700',
        color: '#A3A3A3',
        letterSpacing: 1.5,
    }
});
