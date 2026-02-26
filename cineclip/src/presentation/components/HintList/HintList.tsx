import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './HintList.styles';
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

