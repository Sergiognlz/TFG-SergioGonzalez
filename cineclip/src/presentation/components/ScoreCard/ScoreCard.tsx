import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './ScoreCard.styles';

/**
 * Props del componente ScoreCard.
 */
interface ScoreCardProps {
  /** Puntuación acumulada de la sesión. */
  score: number;
  /** Intentos restantes en la partida activa. */
  attemptsLeft: number;
  /** Modo compacto para pantallas pequeñas o landscape. Reduce fuentes y padding. */
  compact?: boolean;
}

/**
 * Componente que muestra la puntuación y los intentos restantes.
 * Soporta modo compacto para adaptarse a pantallas en horizontal.
 * Responsabilidad única (SOLID - S): solo se ocupa de renderizar
 * la información de estado de la partida.
 */
export function ScoreCard({ score, attemptsLeft, compact = false }: ScoreCardProps) {
  return (
    /** En modo compacto reduce el padding vertical para ocupar menos altura. */
    <View style={[styles.container, compact && { paddingVertical: 2 }]}>

      {/** Bloque de intentos restantes. */}
      <View style={styles.item}>
        {/** En modo compacto reduce el tamaño de la etiqueta. */}
        <Text style={[styles.label, compact && { fontSize: 8 }]}>Intentos</Text>
        {/** En modo compacto reduce el tamaño del número. */}
        <Text style={[styles.value, compact && { fontSize: 16 }]}>{attemptsLeft}</Text>
      </View>

      {/** Separador vertical. En modo compacto reduce su altura. */}
      <View style={[styles.divider, compact && { height: 20 }]} />

      {/** Bloque de puntuación acumulada. */}
      <View style={styles.item}>
        {/** En modo compacto reduce el tamaño de la etiqueta. */}
        <Text style={[styles.label, compact && { fontSize: 8 }]}>Puntuación</Text>
        {/** En modo compacto reduce el tamaño del número. */}
        <Text style={[styles.value, compact && { fontSize: 16 }]}>{score}</Text>
      </View>

    </View>
  );
}