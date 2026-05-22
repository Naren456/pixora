import { useState, useCallback } from 'react';
import { requestMediaPermissions } from '@/services/permissions';
import { syncLocalMediaDatabase, SyncProgress } from '@/services/photoIndexDb';
import { fetchTimelineAggregated, TimelineGroup } from '@/database/queries';

export function usePixoraEngine() {
  const [syncState, setSyncState] = useState<SyncProgress>({ scannedCount: 0, isSyncing: false });
  const [timeline, setTimeline] = useState<TimelineGroup[]>([]);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);

  const startMediaSync = useCallback(async () => {
    const hasPermission = await requestMediaPermissions();
    setPermissionGranted(hasPermission);

    if (!hasPermission) {
      setSyncState((prev) => ({ ...prev, error: 'Media permission denied' }));
      return;
    }

    // Trigger asynchronous multi-pass database sync streams
    await syncLocalMediaDatabase(async (progress) => {
      setSyncState(progress);
      
      // Every time a batch completes, update the state mapping directly from the DB layout
      if (!progress.isSyncing || progress.scannedCount % 300 === 0) {
        const structuralTimeline = await fetchTimelineAggregated();
        setTimeline(structuralTimeline);
      }
    });
  }, []);

  return {
    syncState,
    timeline,
    permissionGranted,
    startMediaSync,
  };
}