import React, { useEffect, useState, useMemo } from 'react';
import { StyleSheet, Text, View, Pressable, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { fetchPhotoDetailById, PhotoDetailRecord } from '@/database/queries';

export default function PhotoDetailDetailCanvas() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [photo, setPhoto] = useState<PhotoDetailRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAssetData() {
     if (!id || typeof id !== 'string') {
      console.warn('Invalid or missing photo asset ID parameter parsed from route:', id);
      setIsLoading(false);
      return;
    }
      setIsLoading(true);
      try {
        const record = await fetchPhotoDetailById(id);
        setPhoto(record);
      } catch (err) {
        console.error('Failed reading target canvas record:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadAssetData();
  }, [id]);

  // Thread Isolation: Formulating timestamp text out of render frames loop blocks
  const formattedDateString = useMemo(() => {
    if (!photo?.creationTime) return '';
    try {
      return new Date(photo.creationTime).toLocaleString();
    } catch {
      return '';
    }
  }, [photo?.creationTime]);

  // Decode vector indicators if indexed
  const dynamicConcepts = useMemo(() => {
    if (!photo?.embedding) return [];
    // If you cache strings or filename tokens, look up descriptors
    return [photo.filename.split('.')[0] || 'photo'];
  }, [photo?.embedding, photo?.filename]);

  if (isLoading) {
    return (
      <View style={styles.loadingBackgroundCanvas}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (!photo) {
    return (
      <View style={styles.loadingBackgroundCanvas}>
        <Text style={{ color: '#fff' }}>Asset not found or database record has been purged.</Text>
        <Pressable style={styles.backButtonLayout} onPress={() => router.back()}>
          <Text style={{ color: '#007aff', marginTop: 12 }}>Return to Gallery</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.canvasWrapper} edges={['top', 'bottom']}>
      {/* Top Floating Control Row Layout */}
      <View style={styles.actionHeaderRow}>
        <Pressable style={styles.circleIconBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </Pressable>
        <Text style={styles.fileTitleLabel} numberOfLines={1}>{photo.filename}</Text>
        <Pressable style={styles.circleIconBtn} onPress={() => console.log('Toggle collection sheet options')}>
          <Ionicons name="folder-open-outline" size={20} color="#fff" />
        </Pressable>
      </View>

      {/* Main Presenation Canvas Viewport */}
      <View style={styles.viewportBodyContainer}>
        <Image
          source={{ uri: photo.uri }}
          style={styles.mainCoreFocusImage}
          contentFit="contain"
          transition={100} // Pure native transition handling hardware acceleration parameters
          recyclingKey={photo.uri}
        />
      </View>

      {/* Bottom Floating Metadata Metadata Panel Sheet */}
      <View style={styles.metadataMetadataSheet}>
        <View style={styles.panelSectionItemRow}>
          <Ionicons name="time-outline" size={16} color="#666" style={{ marginRight: 8 }} />
          <Text style={styles.metaLabelStringText}>{formattedDateString}</Text>
        </View>

        <View style={styles.panelSectionItemRow}>
          <Ionicons name="options-outline" size={16} color="#666" style={{ marginRight: 8 }} />
          <Text style={styles.metaLabelStringText}>
            {photo.width} × {photo.height} • {photo.mediaType.toUpperCase()}
          </Text>
        </View>

        {dynamicConcepts.length > 0 && (
          <View style={styles.tagConceptsRowFlow}>
            {dynamicConcepts.map((tag, idx) => (
              <View key={`${tag}-${idx}`} style={styles.keywordTagBadge}>
                <Ionicons name="pricetag-outline" size={10} color="#aaa" style={{ marginRight: 4 }} />
                <Text style={styles.keywordTagLabelText}>{tag}</Text>
              </View>
            ))}
            <View style={[styles.keywordTagBadge, { backgroundColor: photo.embedding ? '#153216' : '#2c2c2e' }]}>
              <Text style={[styles.keywordTagLabelText, { color: photo.embedding ? '#30d158' : '#8e8e93' }]}>
                {photo.embedding ? 'INDEXED SEMANTIC' : 'UNINDEXED'}
              </Text>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingBackgroundCanvas: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  canvasWrapper: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'space-between',
  },
  actionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    zIndex: 10,
  },
  circleIconBtn: {
    backgroundColor: '#1c1c1e',
    padding: 8,
    borderRadius: 50,
  },
  fileTitleLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    paddingHorizontal: 12,
  },
  viewportBodyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    marginVertical: 8,
  },
  mainCoreFocusImage: {
    width: '100%',
    height: '100%',
  },
  metadataMetadataSheet: {
    backgroundColor: '#1c1c1e',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 14,
    padding: 14,
  },
  panelSectionItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metaLabelStringText: {
    color: '#aeaeac',
    fontSize: 13,
    fontWeight: '500',
  },
  tagConceptsRowFlow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
    borderTopWidth: 0.5,
    borderTopColor: '#2c2c2e',
    paddingTop: 10,
  },
  keywordTagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2c2c2e',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 6,
    marginBottom: 4,
  },
  keywordTagLabelText: {
    color: '#aaa',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  backButtonLayout: {
    padding: 10,
  },
});