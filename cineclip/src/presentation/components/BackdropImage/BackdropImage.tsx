import React from 'react';
import { Image,View, ActivityIndicator } from 'react-native';
import { styles } from './BackdropImage.styles';
/**
 * Props del componente BackdropImage.
 */
interface BackdropImageProps {
  /** URL completa del backdrop a mostrar. */
  url: string;
}

/**
 * Componente que muestra el backdrop de la película activa.
 * Muestra un indicador de carga mientras la imagen se descarga
 * y un placeholder si la URL no es válida.
 * Responsabilidad única (SOLID - S): solo se ocupa de renderizar
 * la imagen del backdrop.
 */
export function BackdropImage({ url }: BackdropImageProps) {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  return (
    <View style={styles.container}>
      {loading && (
        <ActivityIndicator
          style={styles.loader}
          size="large"
          color="#F9A825"
        />
      )}
      {error ? (
        <View style={styles.placeholder} />
      ) : (
      <Image
  source={{ uri: url }}
  style={styles.image}
  resizeMode="cover"
  onLoad={() => setLoading(false)}
  onError={() => {
    setLoading(false);
    setError(true);
  }}
/>
      )}
    </View>
  );
}

