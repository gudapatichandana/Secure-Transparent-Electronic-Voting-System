import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const LandingScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            {/* Background Blobs - Tricolor Theme (using opacity, no blur) */}
            <View style={[styles.blob, { backgroundColor: '#FB923C', top: -80, left: -80 }]} />
            <View style={[styles.blob, { backgroundColor: '#4ADE80', top: -60, right: -60 }]} />
            <View style={[styles.blob, { backgroundColor: '#60A5FA', bottom: -80, left: 20 }]} />

            <View style={styles.content}>
                {/* Logo/Header Area */}
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        <Text style={styles.logoEmoji}>🗳️</Text>
                    </View>

                    <Text style={styles.title}>Vote</Text>
                    <Text style={styles.titleAccent}>Securely.</Text>

                    <Text style={styles.subtitle}>
                        Experience the future of democracy. Register, verify, and cast your vote with state-of-the-art encryption.
                    </Text>
                </View>

                {/* Feature Cards */}
                <View style={styles.cardsRow}>
                    <View style={styles.card}>
                        <Text style={styles.cardIcon}>🔒</Text>
                        <Text style={styles.cardLabel}>Secure</Text>
                    </View>
                    <View style={styles.card}>
                        <Text style={styles.cardIcon}>⚡</Text>
                        <Text style={styles.cardLabel}>Fast</Text>
                    </View>
                </View>

                {/* Action Button */}
                <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.buttonWrapper}>
                    <LinearGradient
                        colors={['#2563EB', '#4F46E5']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>Login / Register</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>

            {/* Footer */}
            <Text style={styles.footer}>© 2026 Election Commission of India</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', position: 'relative' },
    blob: { position: 'absolute', width: 300, height: 300, borderRadius: 150, opacity: 0.2 },
    content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, zIndex: 10 },
    header: { alignItems: 'center', marginBottom: 40 },
    logoContainer: { width: 80, height: 80, backgroundColor: '#E5E7EB', borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
    logoEmoji: { fontSize: 32 },
    title: { fontSize: 48, fontWeight: '800', color: '#1E293B', textAlign: 'center', marginBottom: 4 },
    titleAccent: { fontSize: 48, fontWeight: '800', color: '#4F46E5', textAlign: 'center', marginBottom: 24 },
    subtitle: { fontSize: 16, color: '#475569', textAlign: 'center', fontWeight: '300', lineHeight: 24 },
    cardsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 16, marginBottom: 40, width: '100%' },
    card: { width: '47%', backgroundColor: '#fff', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#F1F5F9', alignItems: 'center', elevation: 2 },
    cardIcon: { fontSize: 24, marginBottom: 8 },
    cardLabel: { color: '#1E293B', fontWeight: '700', textAlign: 'center' },
    buttonWrapper: { width: '100%' },
    button: { padding: 16, borderRadius: 50, alignItems: 'center', elevation: 4 },
    buttonText: { color: '#fff', fontWeight: '700', fontSize: 18 },
    footer: { position: 'absolute', bottom: 24, alignSelf: 'center', color: '#94A3B8', fontSize: 12 },
});

export default LandingScreen;
