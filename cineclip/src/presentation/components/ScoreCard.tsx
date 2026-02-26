import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * Props del componente ScoreCard.
 */
interface ScoreCardProps {
  /** Puntuación obtenida en la partida. */
  score: number;
  /** Intentos restantes en la partida activa. */
  attemptsLeft: number;
}

/**
 * Componente que muestra la puntuación y los intentos restantes.
 * Responsabilidad única (SOLID - S): solo se ocupa de renderizar
 * la información de estado de la partida.
 */
export function ScoreCard({ score, attemptsLeft }: ScoreCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <Text style={styles.label}>Intentos</Text>
        <Text style={styles.value}>{attemptsLeft}</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.item}>
        <Text style={styles.label}>Puntuación</Text>
        <Text style={styles.value}>{score}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#1E3A5C',
    borderRadius: 8,
    padding: 12,
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
  },
  item: {
    alignItems: 'center',
  },
  label: {
    color: '#AAAAAA',
    fontSize: 12,
    marginBottom: 4,
  },
  value: {
    color: '#F9A825',
    fontSize: 24,
    fontWeight: 'bold',
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: '#2A4A6C',
  },
});