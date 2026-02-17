import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { STAGES } from './src/game/constants';
import { createInitialBoard, moveAndResolve } from './src/game/logic';
import { Block, Position } from './src/game/types';

const bgByType = (cell: Block): string => {
  if (cell.type === 'egg') {
    return {
      red: '#f94144',
      blue: '#277da1',
      green: '#43aa8b',
      yellow: '#f9c74f',
      purple: '#9d4edd',
    }[cell.color];
  }
  if (cell.type === 'chick') return '#ffd166';
  if (cell.type === 'rooster') return '#ef476f';
  if (cell.type === 'hen') return '#f78c6b';
  return '#0f172a';
};

const labelByType = (cell: Block): string => {
  if (cell.type === 'egg') return '🥚';
  if (cell.type === 'chick') return '🐥';
  if (cell.type === 'rooster') return '🐓';
  if (cell.type === 'hen') return '🐔';
  return '';
};

export default function App() {
  const [board, setBoard] = useState<Block[][]>(() => createInitialBoard());
  const [selected, setSelected] = useState<Position | null>(null);
  const [score, setScore] = useState(0);
  const [comboText, setComboText] = useState('');
  const [stageIndex, setStageIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(STAGES[0].timeLimitSec);

  const stage = useMemo(() => STAGES[Math.min(stageIndex, STAGES.length - 1)], [stageIndex]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (score >= stage.targetScore) {
      setStageIndex((prev) => prev + 1);
      const nextStage = STAGES[Math.min(stageIndex + 1, STAGES.length - 1)];
      setSecondsLeft(nextStage.timeLimitSec);
      setComboText(`Stage ${Math.min(stageIndex + 2, STAGES.length)} 시작!`);
    }
  }, [score, stage.targetScore, stageIndex]);

  const onPressCell = (row: number, col: number) => {
    const pos = { row, col };
    if (!selected) {
      setSelected(pos);
      return;
    }

    const result = moveAndResolve(board, selected, pos);
    setBoard(result.board);
    setScore((prev) => prev + result.gainedScore);
    setComboText(result.combo > 1 ? `${result.combo} Combo!` : result.combo === 1 ? 'Match!' : 'No Match');
    setSelected(null);
  };

  const resetGame = () => {
    setBoard(createInitialBoard());
    setSelected(null);
    setScore(0);
    setStageIndex(0);
    setSecondsLeft(STAGES[0].timeLimitSec);
    setComboText('');
  };

  const gameOver = secondsLeft <= 0;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <Text style={styles.title}>Egg Evolution Match</Text>
      <View style={styles.hudRow}>
        <Text style={styles.hud}>Stage {stage.level}</Text>
        <Text style={styles.hud}>Score {score}</Text>
        <Text style={styles.hud}>Goal {stage.targetScore}</Text>
        <Text style={styles.hud}>⏱ {secondsLeft}s</Text>
      </View>
      <Text style={styles.combo}>{gameOver ? 'Time Over' : comboText}</Text>

      <View style={styles.board}>
        {board.map((row, r) => (
          <View key={`r-${r}`} style={styles.row}>
            {row.map((cell, c) => {
              const isSelected = selected?.row === r && selected?.col === c;
              return (
                <Pressable
                  key={`c-${r}-${c}`}
                  onPress={() => !gameOver && onPressCell(r, c)}
                  style={[styles.cell, { backgroundColor: bgByType(cell) }, isSelected && styles.selected]}
                >
                  <Text style={styles.cellText}>{labelByType(cell)}</Text>
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>

      <Pressable style={styles.resetBtn} onPress={resetGame}>
        <Text style={styles.resetText}>Restart</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c3443',
    alignItems: 'center',
    paddingVertical: 8,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  hudRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 6,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  hud: {
    color: '#fff',
    fontSize: 13,
    backgroundColor: '#133c55',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  combo: {
    color: '#ffd166',
    height: 22,
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  board: {
    borderWidth: 2,
    borderColor: '#fff',
    padding: 2,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: 20,
    height: 20,
    margin: 1,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: {
    borderWidth: 2,
    borderColor: '#fff',
  },
  cellText: {
    fontSize: 10,
  },
  resetBtn: {
    marginTop: 10,
    backgroundColor: '#f9c74f',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  resetText: {
    fontWeight: '700',
    color: '#2c2c2c',
  },
});
