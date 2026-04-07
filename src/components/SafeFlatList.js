import React from 'react';
import { FlatList, Text, View } from 'react-native';

export default function SafeFlatList({ data, renderItem, keyExtractor, ListEmptyComponent, ...rest }) {
  // Ensure data is always an array
  const safeData = Array.isArray(data) ? data : [];
  return (
    <FlatList
      data={safeData}
      keyExtractor={(item, index) => (item?.id ? item.id.toString() : index.toString())}
      renderItem={({ item }) => {
        if (!item) return null;
        return renderItem({ item });
      }}
      ListEmptyComponent={ListEmptyComponent || <Text>No data</Text>}
      {...rest}
    />
  );
}