import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface EditorToolbarProps {
    isBold: boolean;
    isItalic: boolean;
    isUnderline: boolean;
    setIsBold: (val: boolean) => void;
    setIsItalic: (val: boolean) => void;
    setIsUnderline: (val: boolean) => void;
    baseColor?: string;
    activeColor?: string;
}

export default function EditorToolbar({
    isBold, isItalic, isUnderline,
    setIsBold, setIsItalic, setIsUnderline,
    baseColor = "#C59A3F", activeColor = "#8A8A8C" 
}: EditorToolbarProps) {
    return (
        <View style={styles.toolbar}>
            <TouchableOpacity style={[styles.toolbarButton, isBold && styles.toolbarButtonActive]} onPress={() => setIsBold(!isBold)}>
                <Feather name="bold" size={16} color={isBold ? baseColor : activeColor} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.toolbarButton, isItalic && styles.toolbarButtonActive]} onPress={() => setIsItalic(!isItalic)}>
                <Feather name="italic" size={16} color={isItalic ? baseColor : activeColor} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.toolbarButton, isUnderline && styles.toolbarButtonActive]} onPress={() => setIsUnderline(!isUnderline)}>
                <Feather name="underline" size={16} color={isUnderline ? baseColor : activeColor} />
            </TouchableOpacity>
            <View style={styles.toolbarDivider} />
            <TouchableOpacity style={styles.toolbarButton}>
                <Feather name="list" size={16} color={activeColor} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.toolbarButton}>
                <Feather name="align-left" size={16} color={activeColor} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
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
});
