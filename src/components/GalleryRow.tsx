import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import PhotoCard from './PhotoCard';

const { width } = Dimensions.get('window');
export const ROW_ITEM_SIZE = width / 3;

interface GalleryRowProps {
  items: any[];
  onItemPress: (item: any) => void;
}

const GalleryRow = React.memo(({ items, onItemPress }: GalleryRowProps) => {
  return (
    <View style={styles.row}>
      {items.map((item) => (
        <PhotoCard
          key={item.id}
          imageUri={item.uri}
          isVideo={item.mediaType === 'video'}
          duration={item.duration}
          onPress={() => onItemPress(item)}
        />
      ))}
      {/* Structural padding ensures incomplete date items layout evenly */}
      {items.length < 3 && 
        Array.from({ length: 3 - items.length }).map((_, index) => (
          <View key={`pad-${index}`} style={styles.emptyCard} />
        ))
      }
    </View>
  );
});

export default GalleryRow;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '100%',
  },
  emptyCard: {
    flex: 1,
    aspectRatio: 1,
    margin: 1.5,
  }
});