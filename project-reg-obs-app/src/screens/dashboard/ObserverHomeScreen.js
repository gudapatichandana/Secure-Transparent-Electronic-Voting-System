import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useAccounts } from '../../context/AccountContext';

const ActionCard = ({ emoji, title, desc, accent, onPress }) => (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
        <View style={[styles.cardIcon, { backgroundColor: accent + '22' }]}>
            <Text style={styles.cardEmoji}>{emoji}</Text>
        </View>
        <View style={styles.cardBody}>
            <Text style={styles.cardTitle}>{title}</Text>
            <Text style={styles.cardDesc}>{desc}</Text>
        </View>
        <Text style={styles.cardArrow}>→</Text>
    </TouchableOpacity>
);

const ObserverHomeScreen = ({ navigation }) => {
    const { activeAccount } = useAccounts();
    const user = activeAccount?.user;
    const role = user?.role || 'general';
    const displayName = user?.name || user?.full_name || user?.username || 'Observer';

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.roleBadge}>
                <Text style={styles.roleText}>{role.charAt(0).toUpperCase() + role.slice(1)} Observer</Text>
            </View>

            <Text style={styles.sectionLabel}>Quick Actions</Text>

            <ActionCard
                emoji="📊"
                title="View Election Results"
                desc="Access live tallied results and cryptographic proof"
                accent="#7C3AED"
                onPress={() => navigation.navigate('Reports')}
            />
            <ActionCard
                emoji="🔍"
                title="Vote Verification"
                desc="Verify cast vote origin using cryptographic HashID"
                accent="#10B981"
                onPress={() => navigation.navigate('Ledger')}
            />
            <ActionCard
                emoji="📝"
                title="Incident Logs"
                desc="Access detailed statutory reports and incident logs"
                accent="#EA580C"
                onPress={() => navigation.navigate('Analytics')} // Reusing Analytics for general logs if needed, or keeping it
            />

            <Text style={styles.sectionLabel}>System Status</Text>
            <View style={styles.statusRow}>
                <View style={[styles.statusCard, { backgroundColor: '#F0FDF4' }]}>
                    <View style={styles.statusDot} />
                    <Text style={styles.statusValue}>Online</Text>
                    <Text style={styles.statusLabel}>System</Text>
                </View>
                <View style={[styles.statusCard, { backgroundColor: '#EFF6FF' }]}>
                    <Text style={styles.statusEmoji}>📡</Text>
                    <Text style={styles.statusValue}>Active</Text>
                    <Text style={styles.statusLabel}>Feed</Text>
                </View>
                <View style={[styles.statusCard, { backgroundColor: '#FFF7ED' }]}>
                    <Text style={styles.statusEmoji}>🔒</Text>
                    <Text style={styles.statusValue}>Secure</Text>
                    <Text style={styles.statusLabel}>Channel</Text>
                </View>
            </View>

            <TouchableOpacity
                style={styles.emergencyBtn}
                onPress={() => alert('Emergency Protocol Initiated — Contact ERO Immediately.')}
            >
                <Text style={styles.emergencyText}>🚨  Emergency Protocol</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    content: { padding: 20, paddingBottom: 40 },
    greeting: { fontSize: 14, color: '#94A3B8', fontWeight: '600', marginTop: 8 },
    name: { fontSize: 24, fontWeight: '800', color: '#1E293B', marginBottom: 8 },
    roleBadge: { alignSelf: 'flex-start', backgroundColor: '#FFF7ED', borderWidth: 1, borderColor: '#FED7AA', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, marginBottom: 20 },
    roleText: { color: '#EA580C', fontSize: 12, fontWeight: '700' },
    sectionLabel: { fontSize: 12, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12, marginTop: 4 },
    card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
    cardIcon: { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
    cardEmoji: { fontSize: 24 },
    cardBody: { flex: 1 },
    cardTitle: { fontSize: 15, fontWeight: '700', color: '#1E293B', marginBottom: 2 },
    cardDesc: { fontSize: 12, color: '#64748B', lineHeight: 16 },
    cardArrow: { fontSize: 18, color: '#CBD5E1' },
    statusRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
    statusCard: { flex: 1, borderRadius: 14, padding: 14, alignItems: 'center', gap: 4 },
    statusDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#16A34A' },
    statusEmoji: { fontSize: 18 },
    statusValue: { fontSize: 13, fontWeight: '800', color: '#1E293B' },
    statusLabel: { fontSize: 10, color: '#64748B', fontWeight: '600' },
    emergencyBtn: { backgroundColor: '#FEF2F2', borderRadius: 14, padding: 16, alignItems: 'center', borderWidth: 1.5, borderColor: '#FECACA' },
    emergencyText: { color: '#DC2626', fontWeight: '700', fontSize: 15 },
});

export default ObserverHomeScreen;
