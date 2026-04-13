import { StyleSheet, Platform, StatusBar } from 'react-native';

export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FAF8F3',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
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
});
