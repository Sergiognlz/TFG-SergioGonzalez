import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { useRanking } from '../../viewModels/useRanking';
import { Score } from '../../../domain/entities/Score';
import { styles } from './RankingView.styles';

interface RankingViewProps {
  alias: string;
  onBack: () => void;
  onLogout: () => void;
}

/**
 * Vista del ranking global.
 * Muestra la lista de jugadores ordenada por puntuación descendente.
 * Responsabilidad única (SOLID - S): solo renderiza el ranking
 * que le proporciona el ViewModel useRanking.
 */
export function RankingView({ alias, onBack, onLogout }: RankingViewProps) {
  const { ranking, loading, error, loadRanking } = useRanking();
  const { width } = useWindowDimensions();

  useEffect(() => {
    loadRanking();
  }, []);

  /**
   * Ancho máximo del contenedor en web según tamaño de pantalla.
   * Móvil web (<600px): 480px. Tablet/escritorio: 900px.
   */
  const containerMaxWidth = Platform.OS === 'web'
    ? (width < 600 ? 480 : 900)
    : undefined;

  const renderItem = ({ item, index }: { item: Score; index: number }) => {
    const isTop3 = index < 3;
    const medals = ['🥇', '🥈', '🥉'];
    return (
      <View style={[styles.row, isTop3 && styles.topRow]}>
        <Text style={styles.position}>
          {isTop3 ? medals[index] : `${index + 1}`}
        </Text>
        <Text style={styles.alias}>{item.alias}</Text>
        <Text style={styles.score}>{item.maxScore}</Text>
      </View>
    );
  };

  return (
    <View style={[
      styles.container,
      Platform.OS === 'web' && {
        maxWidth: containerMaxWidth,
        alignSelf: 'center',
        width: '100%',
      },
    ]}>
      {/* Cabecera con usuario y botón de salir */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backButton}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Ranking global</Text>
        <View style={styles.headerRight}>
          <Text style={styles.aliasText}>👤 {alias}</Text>
          <TouchableOpacity onPress={onLogout}>
            <Text style={styles.logoutLink}>Salir</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => loadRanking()}>
            <Text style={styles.refreshButton}>↻</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Cabecera de la tabla */}
      <View style={styles.tableHeader}>
        <Text style={styles.tableHeaderText}>#</Text>
        <Text style={[styles.tableHeaderText, styles.flex]}>Jugador</Text>
        <Text style={styles.tableHeaderText}>Puntos</Text>
      </View>

      {loading && (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#F9A825" />
        </View>
      )}
      {error && (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => loadRanking()}>
            <Text style={styles.retryText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      )}
      {!loading && !error && ranking.length === 0 && (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>
            Aún no hay puntuaciones. ¡Sé el primero!
          </Text>
        </View>
      )}
      {!loading && !error && ranking.length > 0 && (
        <FlatList
          data={ranking}
          keyExtractor={item => item.alias}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}