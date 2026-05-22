import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import { getDbConnection } from '@/database/sqlite';

interface CollectionItem {
  id: string;
  name: string;
  createdAt: number;
  photoCount: number;
}

export default function CollectionsScreen() {
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadCollectionsData = async () => {
    setIsLoading(true);
    try {
      const db = await getDbConnection();
      // Database-First Aggregation: Let SQLite compute album capacities natively
      const query = `
        SELECT c.id, c.name, c.createdAt, COUNT(sp.photoId) as photoCount
        FROM collections c
        LEFT JOIN story_photos sp ON c.id = sp.storyId
        GROUP BY c.id
        ORDER BY c.createdAt DESC;
      `;
      const result = await db.getAllAsync<CollectionItem>(query);
      setCollections(result);
    } catch (err) {
      console.error('Failed reading albums database snapshot:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCollectionsData();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Collections</Text>
        <Pressable style={styles.createBtn} onPress={() => console.log('Create new album entry')}>
          <Ionicons name="add" size={20} color="#000" />
        </Pressable>
      </View>

      {isLoading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      ) : collections.length === 0 ? (
        <View style={styles.centerBox}>
          <Ionicons name="folder-open-outline" size={48} color="#444" />
          <Text style={styles.emptyText}>No custom albums found.</Text>
          <Text style={styles.subEmptyText}>Create folders or compile your generated story recaps here.</Text>
        </View>
      ) : (
        <FlashList<CollectionItem>
          data={collections}
          keyExtractor={(item) => item.id}
          numColumns={2}
          estimatedItemSize={120}
          contentContainerStyle={{ padding: 12 }}
          renderItem={({ item }) => (
            <Pressable style={styles.albumCard} onPress={() => console.log('Open folder item:', item.id)}>
              <View style={styles.folderArtIconBox}>
                <Ionicons name="images" size={32} color="#8e8e93" />
              </View>
              <Text style={styles.albumName} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.albumCount}>{item.photoCount} items</Text>
            </Pressable>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  createBtn: {
    backgroundColor: '#fff',
    padding: 6,
    borderRadius: 50,
  },
  centerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    marginTop: 12,
  },
  subEmptyText: {
    color: '#444',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  albumCard: {
    flex: 1,
    backgroundColor: '#1c1c1e',
    margin: 6,
    borderRadius: 12,
    padding: 12,
  },
  folderArtIconBox: {
    width: '100%',
    aspectRatio: 1.3,
    backgroundColor: '#2c2c2e',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  albumName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  albumCount: {
    color: '#666',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
});