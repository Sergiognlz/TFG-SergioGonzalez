import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * Props del componente HintList.
 */
interface HintListProps {
  /** Array de pistas ya desveladas en la partida activa. */
  hints: string[];
}

/**
 * Componente que muestra las pistas de metadatos desveladas tras cada fallo.
 * Responsabilidad única (SOLID - S): solo se ocupa de renderizar
 * la lista de pistas acumuladas.
 */
export function HintList({ hints }: HintListProps) {
  if (hints.length === 0) return null;

  return (
    <View style={styles.container}>
      {hints.map((hint, index) => (
        <View key={index} style={styles.hintRow}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.hintText}>{hint}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#1E3A5C',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  bullet: {
    color: '#F9A825',
    fontSize: 16,
    marginRight: 8,
  },
  hintText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
});