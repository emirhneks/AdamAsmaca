import { StyleSheet, View } from 'react-native';
import { MAX_WRONG_GUESSES } from '../utils/game';
import { palette } from '../theme';

type HangmanFigureProps = {
  wrongGuessCount: number;
};

export function HangmanFigure({ wrongGuessCount }: HangmanFigureProps) {
  const progress = Math.min(wrongGuessCount, MAX_WRONG_GUESSES);

  return (
    <View style={styles.wrapper}>
      <View style={styles.frame}>
        <View style={styles.topBeam} />
        <View style={styles.pole} />
        <View style={styles.rope} />
        {progress >= 1 ? <View style={styles.head} /> : null}
        {progress >= 2 ? <View style={styles.body} /> : null}
        {progress >= 3 ? <View style={[styles.arm, styles.leftArm]} /> : null}
        {progress >= 4 ? <View style={[styles.arm, styles.rightArm]} /> : null}
        {progress >= 5 ? <View style={[styles.leg, styles.leftLeg]} /> : null}
        {progress >= 6 ? <View style={[styles.leg, styles.rightLeg]} /> : null}
        <View style={styles.base} />
      </View>
    </View>
  );
}

const stroke = {
  backgroundColor: palette.ink,
  position: 'absolute' as const,
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  frame: {
    width: 170,
    height: 220,
    position: 'relative',
  },
  topBeam: {
    ...stroke,
    left: 32,
    top: 6,
    width: 82,
    height: 10,
    borderRadius: 999,
  },
  pole: {
    ...stroke,
    left: 36,
    top: 6,
    width: 10,
    height: 185,
    borderRadius: 999,
  },
  rope: {
    ...stroke,
    left: 108,
    top: 16,
    width: 6,
    height: 28,
    borderRadius: 999,
  },
  head: {
    position: 'absolute',
    left: 88,
    top: 38,
    width: 44,
    height: 44,
    borderWidth: 7,
    borderColor: palette.accent,
    borderRadius: 22,
    backgroundColor: 'transparent',
  },
  body: {
    ...stroke,
    left: 106,
    top: 82,
    width: 8,
    height: 54,
    borderRadius: 999,
  },
  arm: {
    ...stroke,
    top: 94,
    width: 8,
    height: 40,
    borderRadius: 999,
  },
  leftArm: {
    left: 92,
    transform: [{ rotate: '36deg' }],
  },
  rightArm: {
    left: 120,
    transform: [{ rotate: '-36deg' }],
  },
  leg: {
    ...stroke,
    top: 130,
    width: 8,
    height: 42,
    borderRadius: 999,
  },
  leftLeg: {
    left: 95,
    transform: [{ rotate: '28deg' }],
  },
  rightLeg: {
    left: 117,
    transform: [{ rotate: '-28deg' }],
  },
  base: {
    ...stroke,
    left: 12,
    bottom: 12,
    width: 120,
    height: 10,
    borderRadius: 999,
  },
});
