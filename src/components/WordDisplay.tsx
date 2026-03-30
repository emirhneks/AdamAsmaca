import { StyleSheet, Text, View } from 'react-native';
import { palette, radii, typography } from '../theme';

type WordDisplayProps = {
  characters: string[];
};

export function WordDisplay({ characters }: WordDisplayProps) {
  return (
    <View style={styles.container}>
      {characters.map((character, index) => {
        if (character === ' ') {
          return <View key={`space-${index}`} style={styles.space} />;
        }

        return (
          <View key={`${character}-${index}`} style={styles.cell}>
            <Text style={styles.character}>{character || ' '}</Text>
            <View style={styles.underline} />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    columnGap: 8,
    rowGap: 14,
  },
  space: {
    width: 18,
  },
  cell: {
    minWidth: 28,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  character: {
    minHeight: 30,
    fontSize: 24,
    color: palette.ink,
    fontFamily: typography.bold,
    textTransform: 'uppercase',
    paddingHorizontal: 2,
  },
  underline: {
    marginTop: 6,
    width: '100%',
    height: 4,
    borderRadius: radii.pill,
    backgroundColor: palette.accent,
  },
});
