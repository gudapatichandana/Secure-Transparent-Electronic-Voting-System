import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useAccounts } from '../../context/AccountContext';

const ServiceCard = ({ emoji, title, desc, onPress, accent }) => (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
        <View style={[styles.cardIcon, { backgroundColor: accent + '20' }]}>
            <Text style={styles.cardEmoji}>{emoji}</Text>
        </View>
        <View style={styles.cardBody}>
            <Text style={styles.cardTitle}>{title}</Text>
            <Text style={styles.cardDesc}>{desc}</Text>
        </View>
        <Text style={styles.cardArrow}>→</Text>
    </TouchableOpacity>
);

const CitizenHomeScreen = ({ navigation }) => {
    const { activeAccount } = useAccounts();
    const user = activeAccount?.user;
    const displayName = user?.name || 'Citizen';

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>

            <Text style={styles.sectionLabel}>Voter Services</Text>

            <ServiceCard
                emoji="📝"
                title="New Voter Registration"
                desc="Enroll as a new voter or update your demographic details"
                accent="#2563EB"
                onPress={() => navigation.navigate('Register')}
            />
            <ServiceCard
                emoji="🔍"
                title="Track Application Status"
                desc="Check the approval status of your registration"
                accent="#16A34A"
                onPress={() => navigation.navigate('TrackStatus')}
            />

            <Text style={styles.sectionLabel}>Quick Info</Text>
            <View style={styles.infoRow}>
                <View style={[styles.infoCard, { backgroundColor: '#EFF6FF' }]}>
                    <Text style={styles.infoEmoji}>🗓️</Text>
                    <Text style={styles.infoValue}>2026</Text>
                    <Text style={styles.infoLabel}>Election Year</Text>
                </View>
                <View style={[styles.infoCard, { backgroundColor: '#F0FDF4' }]}>
                    <Text style={styles.infoEmoji}>✅</Text>
                    <Text style={styles.infoValue}>Open</Text>
                    <Text style={styles.infoLabel}>Registration</Text>
                </View>
                <View style={[styles.infoCard, { backgroundColor: '#FFF7ED' }]}>
                    <Text style={styles.infoEmoji}>🔒</Text>
                    <Text style={styles.infoValue}>Secure</Text>
                    <Text style={styles.infoLabel}>Encrypted</Text>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    content: { padding: 20, paddingBottom: 40 },
    greeting: { fontSize: 14, color: '#94A3B8', fontWeight: '600', marginTop: 8 },
    name: { fontSize: 24, fontWeight: '800', color: '#1E293B', marginBottom: 24 },
    sectionLabel: { fontSize: 12, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12, marginTop: 4 },
    card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
    cardIcon: { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
    cardEmoji: { fontSize: 24 },
    cardBody: { flex: 1 },
    cardTitle: { fontSize: 15, fontWeight: '700', color: '#1E293B', marginBottom: 2 },
    cardDesc: { fontSize: 12, color: '#64748B', lineHeight: 16 },
    cardArrow: { fontSize: 18, color: '#CBD5E1' },
    infoRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
    infoCard: { flex: 1, borderRadius: 14, padding: 14, alignItems: 'center', gap: 4 },
    infoEmoji: { fontSize: 22 },
    infoValue: { fontSize: 14, fontWeight: '800', color: '#1E293B' },
    infoLabel: { fontSize: 10, color: '#64748B', fontWeight: '600', textAlign: 'center' },
});

export default CitizenHomeScreen;
