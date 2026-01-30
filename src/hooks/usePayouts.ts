import { useState, useCallback } from 'react';
import {
    getBalanceAndSettings,
    getPayouts,
    requestPayout as requestPayoutService,
    updatePayoutSettings as updateSettingsService
} from '../services/payoutService';
import type {
    Balance,
    PayoutSettings,
    Payout,
    RequestPayoutForm,
    UpdateSettingsForm
} from '../types/Payout';
import toast from 'react-hot-toast';

export const usePayouts = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [balance, setBalance] = useState<Balance | null>(null);
    const [settings, setSettings] = useState<PayoutSettings | null>(null);
    const [payouts, setPayouts] = useState<Payout[]>([]);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 20,
        has_more: false,
        total_returned: 0
    });

    const fetchBalanceAndSettings = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getBalanceAndSettings();
            setBalance(data.balance);
            setSettings(data.settings);
        } catch (err: any) {
            const msg = err.error || err.message || 'Failed to fetch balance';
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchPayoutHistory = useCallback(async (params?: { page?: number; limit?: number; status?: string }) => {
        try {
            setLoading(true);
            setError(null);
            const data = await getPayouts(params);
            setPayouts(data.payouts);
            setPagination(data.pagination);
        } catch (err: any) {
            const msg = err.error || err.message || 'Failed to fetch payout history';
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    }, []);

    const requestPayout = useCallback(async (data: RequestPayoutForm) => {
        try {
            setLoading(true);
            setError(null);
            const result = await requestPayoutService(data);
            toast.success('Payout requested successfully');
            // Refresh balance after request
            await fetchBalanceAndSettings();
            return result;
        } catch (err: any) {
            const msg = err.error || err.message || 'Failed to request payout';
            setError(msg);
            toast.error(msg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [fetchBalanceAndSettings]);

    const updateSettings = useCallback(async (data: UpdateSettingsForm) => {
        try {
            setLoading(true);
            setError(null);
            const result = await updateSettingsService(data);
            setSettings(result);
            toast.success('Settings updated successfully');
            return result;
        } catch (err: any) {
            const msg = err.error || err.message || 'Failed to update settings';
            setError(msg);
            toast.error(msg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        error,
        balance,
        settings,
        payouts,
        pagination,
        fetchBalanceAndSettings,
        fetchPayoutHistory,
        requestPayout,
        updateSettings
    };
};
