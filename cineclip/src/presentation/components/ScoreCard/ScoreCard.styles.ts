import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
 container: {
  flexDirection: 'row',
  backgroundColor: '#0F0F1A',
  borderRadius: 4,
  paddingVertical: 4,
  paddingHorizontal: 12,
  justifyContent: 'space-around',
  alignItems: 'center',
  width: '100%',
  borderWidth: 1,
  borderColor: '#222233',
},
  item: {
    alignItems: 'center',
  },
value: {
  color: '#FFE600',
  fontSize: 28,
  fontWeight: 'bold',
  letterSpacing: 4,
  fontFamily: 'monospace',
  // @ts-ignore
  textShadow: '0 0 8px #FFE600, 0 0 16px #FFE600, 0 0 32px #FFB800',
},
label: {
  color: '#FFE600',
  fontSize: 11,
  marginBottom: 2,
  letterSpacing: 4,
  textTransform: 'uppercase',
  fontWeight: 'bold',
},
divider: {
  width: 1,
  height: 28,
  backgroundColor: '#222233',
},
});