import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@voting_accounts';
const AccountContext = createContext(null);

export const useAccounts = () => {
    const ctx = useContext(AccountContext);
    if (!ctx) throw new Error('useAccounts must be inside AccountProvider');
    return ctx;
};

export const AccountProvider = ({ children }) => {
    // accounts: [{ user: {...}, appRole: 'citizen'|'observer' }, ...]
    const [accounts, setAccounts] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isReady, setIsReady] = useState(false); // true once AsyncStorage is read

    // Load saved sessions on mount
    useEffect(() => {
        const load = async () => {
            try {
                const stored = await AsyncStorage.getItem(STORAGE_KEY);
                if (stored) {
                    const parsed = JSON.parse(stored);
                    setAccounts(parsed.accounts || []);
                    setActiveIndex(parsed.activeIndex || 0);
                }
            } catch (e) {
                console.warn('AccountContext load error', e);
            } finally {
                setIsReady(true);
            }
        };
        load();
    }, []);

    // Persist whenever accounts or activeIndex change
    const persist = useCallback(async (accs, idx) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ accounts: accs, activeIndex: idx }));
        } catch (e) {
            console.warn('AccountContext persist error', e);
        }
    }, []);

    /**
     * Called after a successful login/register.
     * Adds the account if not present, or updates if same appRole already exists.
     * Activates it immediately.
     */
    const addOrUpdateAccount = useCallback(async (user, appRole) => {
        setAccounts(prev => {
            const existing = prev.findIndex(a => a.appRole === appRole);
            let next;
            if (existing !== -1) {
                next = prev.map((a, i) => i === existing ? { user, appRole } : a);
            } else {
                next = [...prev, { user, appRole }].slice(-2); // max 2
            }
            const newIdx = next.findIndex(a => a.appRole === appRole);
            setActiveIndex(newIdx);
            persist(next, newIdx);
            return next;
        });
    }, [persist]);

    /** Switch to the other account */
    const switchAccount = useCallback(async (idx) => {
        setActiveIndex(idx);
        setAccounts(prev => {
            persist(prev, idx);
            return prev;
        });
    }, [persist]);

    /** Remove one account. Returns remaining count. */
    const removeAccount = useCallback(async (idx) => {
        setAccounts(prev => {
            const next = prev.filter((_, i) => i !== idx);
            const newIdx = next.length > 0 ? 0 : 0;
            setActiveIndex(newIdx);
            persist(next, newIdx);
            return next;
        });
        return accounts.length - 1;
    }, [accounts.length, persist]);

    /** Clear ALL sessions */
    const clearAll = useCallback(async () => {
        setAccounts([]);
        setActiveIndex(0);
        await AsyncStorage.removeItem(STORAGE_KEY);
    }, []);

    const activeAccount = accounts[activeIndex] || null;

    return (
        <AccountContext.Provider value={{
            accounts,
            activeIndex,
            activeAccount,
            isReady,
            addOrUpdateAccount,
            switchAccount,
            removeAccount,
            clearAll,
        }}>
            {children}
        </AccountContext.Provider>
    );
};
