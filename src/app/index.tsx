// src/app/index.tsx
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Dimensions, Platform } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { PermissionsAndroid } from 'react-native';
import { syncLocalCameraRollWithDB } from '../pipelines/cameraRollPipe';
import { fetchAllPhotosChronological } from '../queries/photoQueries';
import { PhotoRecord } from '../db/schema';

const { width } = Dimensions.get('window');
const COLUMNS = 3;
const ITEM_SIZE = width / COLUMNS;

export default function GalleryScreen() {
  const [photos, setPhotos] = useState<PhotoRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Request media management permission framework safely across OS variations
  const requestGalleryPermissions = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      const version = parseInt(Platform.Version.toString(), 10);
      if (version >= 33) {
        const granted = await PermissionsAndroid.request(
          'android.permission.READ_MEDIA_IMAGES' as any
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    }
    // iOS permission criteria handles itself elegantly inside native module lifecycle on invocation
    return true;
  };

  const initializeGalleryData = async () => {
    try {
      const hasPermission = await requestGalleryPermissions();
      if (!hasPermission) {
        console.warn('⚠️ Media access access permissions denied.');
        setLoading(false);
        return;
      }

      // 1. Instantly read any structural historical cache directly for immediate screen visual state populating
      const cachedData = await fetchAllPhotosChronological();
      if (cachedData.length > 0) {
        setPhotos(cachedData);
        setLoading(false);
      }

      // 2. Perform delta differential sync smoothly with media storage metadata system in background
      await syncLocalCameraRollWithDB();

      // 3. Re-query the updated localized index engine
      const freshData = await fetchAllPhotosChronological();
      setPhotos(freshData);
    } catch (err) {
      console.error('❌ Initialization routine sequence failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initializeGalleryData();
  }, []);

  const renderPhotoItem = ({ item }: { item: PhotoRecord }) => {
    return (
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.uri }}
          style={styles.image}
          contentFit="cover"
          transition={200} // Fast memory fading transition logic optimizing screen refresh visual cycles
          cachePolicy="disk" // Keep persistent render pipeline assets fast and offline-accessible
        />
      </View>
    );
  };

  if (loading && photos.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Building your offline photo stream...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pixora</Text>
        <Text style={styles.headerSubtitle}>{photos.length} items cataloged offline</Text>
      </View>

      <FlashList
        data={photos}
        renderItem={renderPhotoItem}
        numColumns={COLUMNS}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
    color: '#000',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 2,
  },
  listContainer: {
    padding: 1,
  },
  imageContainer: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    padding: 1,
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F2F2F7', // Prevent flash of raw white layout blocks while assets pull from memory layers
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#8E8E93',
  },
});