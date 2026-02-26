import React from 'react';
import { View, Text} from 'react-native';
import { styles } from './ScoreCard.styles';
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
  console.log('ScoreCard - score:', score, 'attemptsLeft:', attemptsLeft);
  
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

