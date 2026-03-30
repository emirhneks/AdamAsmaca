import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { RootStackParamList } from '../../App';
import { HangmanFigure } from '../components/HangmanFigure';
import { LetterKey } from '../components/LetterKey';
import { WordDisplay } from '../components/WordDisplay';
import { WordEntry } from '../data/words';
import { palette, radii, spacing, typography } from '../theme';
import { getGameStatus, getRevealedCharacters, normalizeLetter, pickRandomWord, TURKISH_ALPHABET } from '../utils/game';

type GameScreenProps = NativeStackScreenProps<RootStackParamList, 'Game'>;

const createRound = (previousWord?: string) => ({
  entry: pickRandomWord(previousWord),
  guessedLetters: [] as string[],
});

export function GameScreen({ navigation }: GameScreenProps) {
  const initialRound = createRound();
  const [{ entry, guessedLetters }, setRound] = useState(initialRound);
  const [resultKey, setResultKey] = useState(0);
  const resultAnim = useRef(new Animated.Value(0)).current;

  const gameStatus = useMemo(() => getGameStatus(entry.word, guessedLetters), [entry.word, guessedLetters]);
  const revealedCharacters = useMemo(() => getRevealedCharacters(entry.word, guessedLetters), [entry.word, guessedLetters]);

  useEffect(() => {
    if (!gameStatus.isFinished) {
      resultAnim.setValue(0);
      return;
    }

    Animated.spring(resultAnim, {
      toValue: 1,
      useNativeDriver: true,
      damping: 12,
      stiffness: 120,
    }).start();
  }, [gameStatus.isFinished, resultAnim, resultKey]);

  const handleGuess = (rawLetter: string) => {
    const letter = normalizeLetter(rawLetter);

    setRound((current) => {
      const currentStatus = getGameStatus(current.entry.word, current.guessedLetters);

      if (currentStatus.isFinished || current.guessedLetters.includes(letter)) {
        return current;
      }

      return {
        ...current,
        guessedLetters: [...current.guessedLetters, letter],
      };
    });
  };

  const handleNewGame = (previousEntry?: WordEntry) => {
    setRound(createRound(previousEntry?.word));
    setResultKey((value) => value + 1);
  };

  const resultTone = gameStatus.hasWon ? styles.resultSuccess : gameStatus.hasLost ? styles.resultDanger : null;
  const resultTitle = gameStatus.hasWon ? 'Harika, kelimeyi çözdün!' : 'Bu tur kaçtı.';
  const resultBody = gameStatus.hasWon
    ? 'Yeni bir kelimeyle ritmi sürdürmeye hazırsın.'
    : `Doğru cevap: ${entry.word}`;

  return (
    <LinearGradient colors={['#FFF9F1', '#FFEFE2', '#FFF7EC']} style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <Pressable style={({ pressed }) => [styles.ghostButton, pressed ? styles.ghostButtonPressed : null]} onPress={() => navigation.goBack()}>
            <Text style={styles.ghostButtonText}>Geri</Text>
          </Pressable>
          <Pressable style={({ pressed }) => [styles.ghostButton, pressed ? styles.ghostButtonPressed : null]} onPress={() => handleNewGame(entry)}>
            <Text style={styles.ghostButtonText}>Yeni Oyun</Text>
          </Pressable>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.copyBlock}>
            <Text style={styles.overline}>Adam Asmaca</Text>
            <Text style={styles.title}>İpucunu oku, harfleri dene, kelimeyi yakala.</Text>
            <Text style={styles.hintLabel}>İpucu</Text>
            <Text style={styles.hintText}>{entry.hint}</Text>
          </View>
          <View style={styles.figureCard}>
            <HangmanFigure wrongGuessCount={gameStatus.wrongGuessCount} />
            <View style={styles.progressRow}>
              <View style={styles.progressPill}>
                <Text style={styles.progressTitle}>Kalan Hak</Text>
                <Text style={styles.progressValue}>{gameStatus.remainingAttempts}</Text>
              </View>
              <View style={styles.progressPill}>
                <Text style={styles.progressTitle}>Denenen</Text>
                <Text style={styles.progressValue}>{guessedLetters.length}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.wordCard}>
          <WordDisplay characters={revealedCharacters} />
        </View>

        {gameStatus.isFinished ? (
          <Animated.View
            key={resultKey}
            style={[
              styles.resultCard,
              resultTone,
              {
                opacity: resultAnim,
                transform: [
                  {
                    scale: resultAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.92, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.resultTitle}>{resultTitle}</Text>
            <Text style={styles.resultBody}>{resultBody}</Text>
            <Pressable style={({ pressed }) => [styles.resultButton, pressed ? styles.resultButtonPressed : null]} onPress={() => handleNewGame(entry)}>
              <Text style={styles.resultButtonText}>Bir Tur Daha</Text>
            </Pressable>
          </Animated.View>
        ) : null}

        <View style={styles.keyboardCard}>
          <Text style={styles.keyboardTitle}>Harfler</Text>
          <View style={styles.keyboardGrid}>
            {TURKISH_ALPHABET.map((letter) => {
              const disabled = guessedLetters.includes(letter) || gameStatus.isFinished;
              const isCorrect = guessedLetters.includes(letter) && entry.word.includes(letter);

              return <LetterKey key={letter} letter={letter} disabled={disabled} isCorrect={isCorrect} onPress={() => handleGuess(letter)} />;
            })}
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  ghostButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: 'rgba(255, 253, 248, 0.85)',
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: palette.line,
  },
  ghostButtonPressed: {
    transform: [{ scale: 0.98 }],
  },
  ghostButtonText: {
    fontFamily: typography.bold,
    color: palette.ink,
    fontSize: 14,
  },
  heroCard: {
    backgroundColor: 'rgba(255, 253, 248, 0.96)',
    borderRadius: radii.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: palette.line,
    shadowColor: palette.shadow,
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 1,
    shadowRadius: 26,
    elevation: 8,
  },
  copyBlock: {
    marginBottom: spacing.lg,
  },
  overline: {
    fontFamily: typography.bold,
    fontSize: 13,
    color: palette.accentDeep,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: spacing.xs,
  },
  title: {
    fontFamily: typography.bold,
    fontSize: 30,
    lineHeight: 38,
    color: palette.ink,
    marginBottom: spacing.md,
  },
  hintLabel: {
    fontFamily: typography.bold,
    fontSize: 14,
    color: palette.accentDeep,
    marginBottom: 6,
  },
  hintText: {
    fontFamily: typography.regular,
    fontSize: 16,
    lineHeight: 24,
    color: palette.inkMuted,
  },
  figureCard: {
    alignItems: 'center',
    backgroundColor: palette.surfaceMuted,
    borderRadius: radii.md,
    paddingVertical: spacing.md,
  },
  progressRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
  },
  progressPill: {
    flex: 1,
    minHeight: 74,
    backgroundColor: palette.surface,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: palette.line,
  },
  progressTitle: {
    fontFamily: typography.regular,
    color: palette.inkMuted,
    fontSize: 13,
    marginBottom: 6,
  },
  progressValue: {
    fontFamily: typography.bold,
    color: palette.ink,
    fontSize: 22,
  },
  wordCard: {
    marginTop: spacing.lg,
    backgroundColor: palette.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: palette.line,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
  resultCard: {
    marginTop: spacing.lg,
    borderRadius: radii.md,
    padding: spacing.lg,
    borderWidth: 1,
  },
  resultSuccess: {
    backgroundColor: 'rgba(46, 139, 87, 0.10)',
    borderColor: 'rgba(46, 139, 87, 0.28)',
  },
  resultDanger: {
    backgroundColor: 'rgba(201, 64, 64, 0.10)',
    borderColor: 'rgba(201, 64, 64, 0.22)',
  },
  resultTitle: {
    fontFamily: typography.bold,
    fontSize: 22,
    color: palette.ink,
    marginBottom: 8,
  },
  resultBody: {
    fontFamily: typography.regular,
    fontSize: 15,
    lineHeight: 24,
    color: palette.inkMuted,
  },
  resultButton: {
    marginTop: spacing.md,
    alignSelf: 'flex-start',
    backgroundColor: palette.ink,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  resultButtonPressed: {
    transform: [{ scale: 0.98 }],
  },
  resultButtonText: {
    fontFamily: typography.bold,
    color: '#FFFDF8',
    fontSize: 15,
  },
  keyboardCard: {
    marginTop: spacing.lg,
    backgroundColor: 'rgba(255, 253, 248, 0.96)',
    borderRadius: radii.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: palette.line,
  },
  keyboardTitle: {
    fontFamily: typography.bold,
    fontSize: 18,
    color: palette.ink,
    marginBottom: spacing.md,
  },
  keyboardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
