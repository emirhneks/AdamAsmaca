import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { RootStackParamList } from '../../App';
import { palette, radii, spacing, typography } from '../theme';

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ navigation }: HomeScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(28)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 650,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 650,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  return (
    <LinearGradient colors={['#FFF7EC', '#FFE6D4', '#FFFDF7']} style={styles.screen}>
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />
      <Animated.View
        style={[
          styles.card,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={styles.title}>Adam{'\n'}Asmaca</Text>
        <Text style={styles.subtitle}>Kelimeyi tahmin et, yanlış seçimlerden kaçın ve oyunu kazanmaya çalış.</Text>
        <View style={styles.identityCard}>
          <Text style={styles.identityLabel}>Hazırlayan</Text>
          <Text style={styles.identityValue}>Emre Keleş</Text>
          <Text style={styles.identityMeta}>AMP 12/A</Text>
          <Text style={styles.identityMeta}>1269</Text>
        </View>
        <Pressable style={({ pressed }) => [styles.button, pressed ? styles.buttonPressed : null]} onPress={() => navigation.navigate('Game')}>
          <Text style={styles.buttonText}>Oyunu Başlat</Text>
        </Pressable>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    justifyContent: 'center',
  },
  glowTop: {
    position: 'absolute',
    top: -20,
    right: -10,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(242, 107, 58, 0.16)',
  },
  glowBottom: {
    position: 'absolute',
    bottom: 70,
    left: -30,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(245, 192, 108, 0.18)',
  },
  card: {
    backgroundColor: 'rgba(255, 253, 248, 0.92)',
    borderRadius: radii.lg,
    padding: spacing.xl,
    shadowColor: palette.shadow,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 1,
    shadowRadius: 28,
    elevation: 10,
  },
  title: {
    fontFamily: typography.bold,
    fontSize: 46,
    lineHeight: 48,
    color: palette.ink,
  },
  subtitle: {
    fontFamily: typography.regular,
    fontSize: 17,
    lineHeight: 27,
    color: palette.inkMuted,
    marginTop: spacing.md,
  },
  identityCard: {
    marginTop: spacing.xl,
    backgroundColor: palette.surface,
    borderRadius: radii.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: palette.line,
  },
  identityLabel: {
    fontFamily: typography.bold,
    fontSize: 13,
    color: palette.accentDeep,
    letterSpacing: 0.4,
    marginBottom: spacing.xs,
  },
  identityValue: {
    fontFamily: typography.bold,
    fontSize: 26,
    color: palette.ink,
    marginBottom: spacing.sm,
  },
  identityMeta: {
    fontFamily: typography.regular,
    fontSize: 16,
    color: palette.inkMuted,
    marginTop: 2,
  },
  button: {
    marginTop: spacing.xl,
    backgroundColor: palette.accent,
    borderRadius: radii.pill,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(242, 107, 58, 0.35)',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 18,
    elevation: 8,
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
    backgroundColor: palette.accentDeep,
  },
  buttonText: {
    fontFamily: typography.bold,
    fontSize: 18,
    color: '#FFFDF8',
  },
});
