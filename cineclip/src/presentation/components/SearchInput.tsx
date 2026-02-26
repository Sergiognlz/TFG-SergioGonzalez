import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Movie } from '../../domain/entities/Movie';

/**
 * Props del componente SearchInput.
 */
interface SearchInputProps {
  /** Función llamada cada vez que el jugador escribe en el campo. */
  onSearch: (query: string) => void;
  /** Lista de películas sugeridas para el autocompletado. */
  results: Movie[];
  /** Indica si hay una búsqueda en curso. */
  searching: boolean;
  /** Función llamada cuando el jugador selecciona una película de la lista. */
  onSelect: (movie: Movie) => void;
  /** Función llamada para limpiar los resultados. */
  onClear: () => void;
}

/**
 * Componente de búsqueda con autocompletado.
 * Muestra un campo de texto y una lista desplegable con sugerencias.
 * Responsabilidad única (SOLID - S): solo se ocupa de capturar
 * la entrada del jugador y mostrar las sugerencias.
 * La lógica de búsqueda está en el hook useSearch (ViewModel).
 */
export function SearchInput({
  onSearch,
  results,
  searching,
  onSelect,
  onClear,
}: SearchInputProps) {
  const [query, setQuery] = useState('');

  /**
   * Gestiona el cambio de texto en el campo de búsqueda.
   * Actualiza el estado local y notifica al ViewModel.
   */
  const handleChange = (text: string) => {
    setQuery(text);
    onSearch(text);
  };

  /**
   * Gestiona la selección de una película de la lista.
   * Limpia el campo y notifica al ViewModel.
   */
  const handleSelect = (movie: Movie) => {
    setQuery('');
    onClear();
    onSelect(movie);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={handleChange}
          placeholder="¿Qué película es?"
          placeholderTextColor="#888"
          autoCorrect={false}
        />
        {searching && (
          <ActivityIndicator
            style={styles.spinner}
            size="small"
            color="#F9A825"
          />
        )}
      </View>

      {results.length > 0 && (
        <FlatList
          data={results}
          keyExtractor={item => item.id.toString()}
          style={styles.dropdown}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.resultItem}
              onPress={() => handleSelect(item)}
            >
              <Text style={styles.resultTitle}>{item.title}</Text>
              {item.year > 0 && (
                <Text style={styles.resultYear}>{item.year}</Text>
              )}
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E3A5C',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    height: 48,
    color: '#FFFFFF',
    fontSize: 16,
  },
  spinner: {
    marginLeft: 8,
  },
  dropdown: {
    backgroundColor: '#1E3A5C',
    borderRadius: 8,
    marginTop: 4,
    maxHeight: 240,
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#2A4A6C',
  },
  resultTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    flex: 1,
  },
  resultYear: {
    color: '#F9A825',
    fontSize: 13,
    marginLeft: 8,
  },
});