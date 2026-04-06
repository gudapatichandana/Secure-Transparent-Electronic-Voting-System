import React, { useState } from 'react';
import {
    View, Text, TouchableOpacity, ScrollView, Modal,
    SafeAreaView, StyleSheet, Alert, Platform
} from 'react-native';
import { useAccounts } from '../context/AccountContext';
import { LinearGradient } from 'expo-linear-gradient';

const ROLE_CONFIG = {
    citizen: { label: 'Citizen', emoji: '🗳️', color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' },
    observer: { label: 'Observer', emoji: '👁️', color: '#EA580C', bg: '#FFF7ED', border: '#FED7AA' },
};

const getInitials = (name = '') =>
    name.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase() || '').join('');

const ProfileScreen = ({ navigation }) => {
    const { accounts, activeIndex, activeAccount, switchAccount, removeAccount, clearAll } = useAccounts();
    const [switcherVisible, setSwitcherVisible] = useState(false);
    const [logoutModal, setLogoutModal] = useState({ visible: false });

    if (!activeAccount) {
        navigation.replace('Landing');
        return null;
    }

    const { user, appRole } = activeAccount;
    const config = ROLE_CONFIG[appRole] || ROLE_CONFIG.citizen;
    const initials = getInitials(user?.name || user?.full_name || user?.username || '?');
    const displayName = user?.name || user?.full_name || user?.username || 'Unknown';
    const displayEmail = user?.email || user?.mobile || '—';

    const performLogout = async () => {
        const remaining = await removeAccount(activeIndex);
        if (remaining === 0) {
            navigation.reset({ index: 0, routes: [{ name: 'Landing' }] });
        } else {
            navigation.navigate('Dashboard');
        }
    };

    const handleLogout = () => {
        setLogoutModal({
            visible: true,
            title: 'Logout Account',
            message: `Are you sure you want to log out of ${displayName} (${config.label})?`,
            onConfirm: performLogout
        });
    };

    const handleLogoutAll = () => {
        const performLogoutAll = async () => {
            await clearAll();
            navigation.reset({ index: 0, routes: [{ name: 'Landing' }] });
        };
        setLogoutModal({
            visible: true,
            title: 'Logout All Accounts',
            message: 'Are you sure you want to log out of all linked accounts?',
            onConfirm: performLogoutAll
        });
    };

    const handleSwitchAccount = async (idx) => {
        setSwitcherVisible(false);
        await switchAccount(idx);
        navigation.goBack(); // Return to dashboard which will re-read activeAccount
    };

    const otherAccounts = accounts.filter((_, i) => i !== activeIndex);

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Text style={styles.backArrow}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Profile</Text>
                <View style={{ width: 70 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Avatar & Name Hero */}
                <LinearGradient
                    colors={[config.color, config.color + 'CC']}
                    style={styles.heroGradient}
                >
                    <View style={styles.avatarCircle}>
                        <Text style={styles.avatarText}>{initials}</Text>
                    </View>
                    <Text style={styles.heroName}>{displayName}</Text>
                    <View style={[styles.roleBadge, { backgroundColor: 'rgba(255,255,255,0.25)' }]}>
                        <Text style={styles.roleBadgeText}>{config.emoji} {config.label}</Text>
                    </View>
                </LinearGradient>

                {/* Info Card */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Account Details</Text>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Name</Text>
                        <Text style={styles.infoValue}>{displayName}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>{appRole === 'citizen' ? 'Mobile' : 'Email'}</Text>
                        <Text style={styles.infoValue}>{displayEmail}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Role</Text>
                        <Text style={[styles.infoValue, { color: config.color, fontWeight: '700' }]}>
                            {config.label}
                        </Text>
                    </View>
                    {appRole === 'observer' && user?.role && (
                        <>
                            <View style={styles.divider} />
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Observer Type</Text>
                                <Text style={[styles.infoValue, { textTransform: 'capitalize' }]}>{user.role}</Text>
                            </View>
                        </>
                    )}
                </View>

                {/* Accounts Card */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Linked Accounts</Text>

                    {accounts.map((acc, idx) => {
                        const cfg = ROLE_CONFIG[acc.appRole] || ROLE_CONFIG.citizen;
                        const nm = acc.user?.name || acc.user?.full_name || acc.user?.username || '?';
                        const isActive = idx === activeIndex;
                        return (
                            <TouchableOpacity
                                key={idx}
                                onPress={() => handleSwitchAccount(idx)}
                                style={[styles.accountRow, isActive && { backgroundColor: cfg.bg, borderColor: cfg.border, borderWidth: 1 }]}
                                disabled={isActive}
                            >
                                <View style={[styles.miniAvatar, { backgroundColor: cfg.color }]}>
                                    <Text style={styles.miniAvatarText}>{getInitials(nm)}</Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.accountRowName}>{nm}</Text>
                                    <Text style={[styles.accountRowRole, { color: cfg.color }]}>{cfg.label}</Text>
                                </View>
                                {isActive
                                    ? <Text style={[styles.activeTag, { color: cfg.color }]}>✓ Active</Text>
                                    : <Text style={styles.switchTag}>Switch →</Text>
                                }
                            </TouchableOpacity>
                        );
                    })}

                    {accounts.length < 2 && (
                        <TouchableOpacity
                            style={styles.addAccountBtn}
                            onPress={() => {
                                navigation.navigate('Login', { addingAccount: true });
                            }}
                        >
                            <Text style={styles.addAccountText}>+ Add {appRole === 'citizen' ? 'Observer' : 'Citizen'} Account</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Logout */}
                <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                    <Text style={styles.logoutText}>🚪  Logout This Account</Text>
                </TouchableOpacity>

                {accounts.length > 1 && (
                    <TouchableOpacity style={[styles.logoutBtn, { marginTop: 12 }]} onPress={handleLogoutAll}>
                        <Text style={styles.logoutText}>🚪  Logout All Accounts</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>

            {/* Custom Logout Modal */}
            <Modal
                visible={logoutModal.visible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setLogoutModal({ visible: false })}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalIconContainer}>
                            <Text style={styles.modalIcon}>🚪</Text>
                        </View>
                        <Text style={styles.modalTitle}>{logoutModal.title}</Text>
                        <Text style={styles.modalMessage}>{logoutModal.message}</Text>

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={[styles.modalBtn, styles.modalBtnCancel]}
                                onPress={() => setLogoutModal({ visible: false })}
                            >
                                <Text style={styles.modalBtnCancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalBtn, styles.modalBtnConfirm]}
                                onPress={() => {
                                    setLogoutModal({ visible: false });
                                    if (logoutModal.onConfirm) logoutModal.onConfirm();
                                }}
                            >
                                <Text style={styles.modalBtnConfirmText}>Sign Out</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E2E8F0', backgroundColor: '#fff' },
    backBtn: { width: 70 },
    backArrow: { color: '#2563EB', fontWeight: '600', fontSize: 15 },
    headerTitle: { flex: 1, textAlign: 'center', fontSize: 17, fontWeight: '700', color: '#1E293B' },
    scrollContent: { paddingBottom: 40 },
    heroGradient: { paddingTop: 32, paddingBottom: 28, alignItems: 'center', gap: 8 },
    avatarCircle: { width: 88, height: 88, borderRadius: 44, backgroundColor: 'rgba(255,255,255,0.35)', alignItems: 'center', justifyContent: 'center', marginBottom: 8, borderWidth: 3, borderColor: 'rgba(255,255,255,0.6)' },
    avatarText: { fontSize: 32, fontWeight: '800', color: '#fff' },
    heroName: { fontSize: 22, fontWeight: '800', color: '#fff' },
    roleBadge: { paddingHorizontal: 14, paddingVertical: 4, borderRadius: 20, marginTop: 4 },
    roleBadgeText: { color: '#fff', fontWeight: '700', fontSize: 13 },
    card: { marginHorizontal: 16, backgroundColor: '#fff', borderRadius: 16, padding: 16, marginTop: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
    cardTitle: { fontSize: 13, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
    infoLabel: { color: '#64748B', fontSize: 14, fontWeight: '500' },
    infoValue: { color: '#1E293B', fontSize: 14, fontWeight: '600', maxWidth: '60%', textAlign: 'right' },
    divider: { height: 1, backgroundColor: '#F1F5F9' },
    accountRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, paddingHorizontal: 8, borderRadius: 12, marginVertical: 4 },
    miniAvatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
    miniAvatarText: { color: '#fff', fontWeight: '700', fontSize: 14 },
    accountRowName: { fontSize: 14, fontWeight: '600', color: '#1E293B' },
    accountRowRole: { fontSize: 12, fontWeight: '500' },
    activeTag: { fontSize: 12, fontWeight: '700' },
    switchTag: { fontSize: 12, fontWeight: '600', color: '#64748B' },
    addAccountBtn: { marginTop: 8, padding: 12, borderRadius: 10, borderWidth: 1.5, borderColor: '#CBD5E1', borderStyle: 'dashed', alignItems: 'center' },
    addAccountText: { color: '#2563EB', fontWeight: '600', fontSize: 14 },
    logoutBtn: { marginHorizontal: 16, marginTop: 24, backgroundColor: '#FEF2F2', borderRadius: 14, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#FECACA' },
    logoutText: { color: '#DC2626', fontWeight: '700', fontSize: 15 },

    // Modal Styles
    modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.65)', justifyContent: 'center', alignItems: 'center', padding: 20 },
    modalContent: { width: '100%', maxWidth: 340, backgroundColor: '#fff', borderRadius: 24, padding: 24, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 20, elevation: 10 },
    modalIconContainer: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#FEF2F2', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
    modalIcon: { fontSize: 32 },
    modalTitle: { fontSize: 20, fontWeight: '800', color: '#1E293B', marginBottom: 8, textAlign: 'center' },
    modalMessage: { fontSize: 15, color: '#64748B', textAlign: 'center', marginBottom: 24, lineHeight: 22 },
    modalActions: { flexDirection: 'row', gap: 12, width: '100%' },
    modalBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    modalBtnCancel: { backgroundColor: '#F1F5F9' },
    modalBtnCancelText: { color: '#475569', fontWeight: '700', fontSize: 15 },
    modalBtnConfirm: { backgroundColor: '#EF4444' },
    modalBtnConfirmText: { color: '#fff', fontWeight: '700', fontSize: 15 }
});

export default ProfileScreen;
