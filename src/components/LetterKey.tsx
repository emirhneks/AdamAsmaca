import { Pressable, StyleSheet, Text } from 'react-native';
import { palette, radii, typography } from '../theme';

type LetterKeyProps = {
  letter: string;
  disabled: boolean;
  isCorrect: boolean;
  onPress: () => void;
};

export function LetterKey({ letter, disabled, isCorrect, onPress }: LetterKeyProps) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.key,
        isCorrect ? styles.keyCorrect : styles.keyDefault,
        disabled ? styles.keyDisabled : null,
        pressed && !disabled ? styles.keyPressed : null,
      ]}
    >
      <Text style={[styles.label, disabled ? styles.labelDisabled : null]}>{letter}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  key: {
    width: '11%',
    minWidth: 34,
    aspectRatio: 0.9,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.sm,
    borderWidth: 1,
    marginBottom: 10,
  },
  keyDefault: {
    backgroundColor: palette.surface,
    borderColor: palette.line,
  },
  keyCorrect: {
    backgroundColor: palette.accentSoft,
    borderColor: palette.accent,
  },
  keyDisabled: {
    opacity: 0.55,
  },
  keyPressed: {
    transform: [{ scale: 0.96 }],
  },
  label: {
    fontFamily: typography.bold,
    color: palette.ink,
    fontSize: 18,
  },
  labelDisabled: {
    color: palette.inkMuted,
  },
});
