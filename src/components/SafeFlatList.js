import React from 'react';
import { FlatList, Text } from 'react-native';

export default function SafeFlatList({ data, renderItem, keyExtractor, ListEmptyComponent, ...rest }) {
  const safeData = Array.isArray(data) ? data : [];
  return (
    <FlatList
      data={safeData}
      keyExtractor={(item, index) => (item?.id ? String(item.id) : String(index))}
      renderItem={({ item }) => {
        if (!item) return null;
        return renderItem({ item });
      }}
      ListEmptyComponent={ListEmptyComponent || <Text>No data</Text>}
      {...rest}
    />
  );
}