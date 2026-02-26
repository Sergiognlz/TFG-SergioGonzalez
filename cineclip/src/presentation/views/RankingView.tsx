import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRanking } from '../hooks/useRanking';
import { Score } from '../../domain/entities/Score';

/**
 * Props de RankingView.
 */
interface RankingViewProps {
  /** Función llamada para volver al juego. */
  onBack: () => void;
}

/**
 * Vista del ranking global.
 * Muestra la lista de jugadores ordenada por puntuación descendente.
 * Responsabilidad única (SOLID - S): solo se ocupa de renderizar
 * el ranking que le proporciona el hook useRanking (ViewModel).
 */
export function RankingView({ onBack }: RankingViewProps) {
  const { ranking, loading, error, loadRanking } = useRanking();

  /** Cargar el ranking al montar la vista. */
  useEffect(() => {
    loadRanking();
  }, []);

  /**
   * Renderiza una fila del ranking.
   * Muestra el puesto, el alias y la puntuación máxima.
   */
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
    <View style={styles.container}>
      {/* Cabecera */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backButton}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Ranking global</Text>
        <TouchableOpacity onPress={() => loadRanking()}>
          <Text style={styles.refreshButton}>↻</Text>
        </TouchableOpacity>
      </View>

      {/* Cabecera de la tabla */}
      <View style={styles.tableHeader}>
        <Text style={styles.tableHeaderText}>#</Text>
        <Text style={[styles.tableHeaderText, styles.flex]}>Jugador</Text>
        <Text style={styles.tableHeaderText}>Puntos</Text>
      </View>

      {/* Contenido */}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A3A5C',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 48,
  },
  backButton: {
    color: '#F9A825',
    fontSize: 16,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  refreshButton: {
    color: '#F9A825',
    fontSize: 22,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#1E3A5C',
    marginHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  tableHeaderText: {
    color: '#F9A825',
    fontWeight: 'bold',
    fontSize: 14,
    width: 40,
    textAlign: 'center',
  },
  flex: {
    flex: 1,
    textAlign: 'left',
  },
  list: {
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1E3A5C',
  },
  topRow: {
    backgroundColor: '#1E3A5C',
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 4,
  },
  position: {
    width: 40,
    textAlign: 'center',
    color: '#AAAAAA',
    fontSize: 16,
  },
  alias: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
  },
  score: {
    width: 60,
    textAlign: 'right',
    color: '#F9A825',
    fontWeight: 'bold',
    fontSize: 16,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#F9A825',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  retryText: {
    color: '#1A3A5C',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyText: {
    color: '#AAAAAA',
    fontSize: 16,
    textAlign: 'center',
  },
});