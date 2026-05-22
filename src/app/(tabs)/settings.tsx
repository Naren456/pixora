import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getDbConnection } from '@/database/sqlite';

export default function SettingsScreen() {
  const [stats, setStats] = useState({ photos: 0, vectors: 0 });
  const [isWiping, setIsWiping] = useState(false);

  const loadDatabaseStats = async () => {
    try {
      const db = await getDbConnection();
      const photoRow = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM photos;');
      const vectorRow = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM photos WHERE embedding IS NOT NULL;');
      setStats({
        photos: photoRow?.count || 0,
        vectors: vectorRow?.count || 0,
      });
    } catch (err) {
      console.error('Failed reading cache metrics:', err);
    }
  };

  useEffect(() => {
    loadDatabaseStats();
  }, []);

  const handleClearDatabaseCache = () => {
    Alert.alert(
      'Purge Local Cache?',
      'This will erase all processed vector indexes and stories from local application space. Your device gallery photos will remain untouched.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Wipe Clean',
          style: 'destructive',
          onPress: async () => {
            setIsWiping(true);
            try {
              const db = await getDbConnection();
              await db.execAsync(`
                DELETE FROM story_photos;
                DELETE FROM stories;
                DELETE FROM collection_photos;
                DELETE FROM collections;
                DELETE FROM photos;
              `);
              await loadDatabaseStats();
              Alert.alert('Success', 'Local application index flushed completely.');
            } catch (err) {
              console.error('Wipe query transaction failed:', err);
            } finally {
              setIsWiping(false);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>System Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollCanvas}>
        <Text style={styles.sectionLabel}>Local Index Metrics</Text>
        <View style={styles.cardGroup}>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Cataloged Media Files</Text>
            <Text style={styles.metaVal}>{stats.photos} items</Text>
          </View>
          <View style={[styles.metaRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.metaLabel}>Computed Feature Embeddings</Text>
            <Text style={styles.metaVal}>{stats.vectors} vectors</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>Active AI Model Configuration</Text>
        <View style={styles.cardGroup}>
          <Pressable style={styles.interactiveRow} onPress={() => Alert.alert('Open-Source Registry', 'Model switching abstraction is managed in Phase 5: Dynamic Registries.')}>
            <View>
              <Text style={styles.metaLabel}>Embedding Matrix Model</Text>
              <Text style={styles.subMetaLabel}>CLIP-ViT-B32 (512 dimensions)</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#444" />
          </Pressable>
          <Pressable style={[styles.interactiveRow, { borderBottomWidth: 0 }]} onPress={() => Alert.alert('Open-Source Registry', 'Story LLM switching strategy is managed in Phase 7: Narrative Providers.')}>
            <View>
              <Text style={styles.metaLabel}>Story Synthesis Engine</Text>
              <Text style={styles.subMetaLabel}>Phi-3-Mini (4-bit local quantized)</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#444" />
          </Pressable>
        </View>

        <Text style={styles.sectionLabel}>Database Maintenance</Text>
        <Pressable 
          style={[styles.dangerCard, isWiping && { opacity: 0.5 }]} 
          onPress={handleClearDatabaseCache}
          disabled={isWiping}
        >
          {isWiping ? (
            <ActivityIndicator size="small" color="#ff453a" />
          ) : (
            <>
              <Ionicons name="trash-bin-outline" size={18} color="#ff453a" style={{ marginRight: 8 }} />
              <Text style={styles.dangerText}>Flushed Cached Database Index</Text>
            </>
          )}
        </Pressable>

        <Text style={styles.footerNote}>Pixora Open-Source • Build v1.0.0 • Privacy Guaranteed Offline</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: '#1c1c1e',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#fff',
  },
  scrollCanvas: {
    padding: 16,
  },
  sectionLabel: {
    color: '#666',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 16,
    paddingLeft: 4,
  },
  cardGroup: {
    backgroundColor: '#1c1c1e',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: '#2c2c2e',
  },
  interactiveRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#2c2c2e',
  },
  metaLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  subMetaLabel: {
    color: '#666',
    fontSize: 12,
    marginTop: 2,
    fontWeight: '500',
  },
  metaVal: {
    color: '#aeaeac',
    fontSize: 14,
    fontWeight: '500',
  },
  dangerCard: {
    backgroundColor: '#1c1c1e',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 69, 58, 0.2)',
  },
  dangerText: {
    color: '#ff453a',
    fontSize: 14,
    fontWeight: '700',
  },
  footerNote: {
    textAlign: 'center',
    color: '#3a3a3c',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 32,
  },
});