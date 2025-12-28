import React, { useMemo } from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  StatusBar, 
  SafeAreaView, 
  Platform, 
  TouchableOpacity, 
  Alert 
} from "react-native";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import SpendingChart from "../components/SpendingChart";
import SavingsForm from "../components/SavingsForm";
import { COLORS, SIZES, SHADOWS } from "../constants/theme";
import { useExpenses } from "../context/ExpenseContext";
import { Ionicons } from '@expo/vector-icons';

export default function MainScreen() {
  const { expenses, savings, resetSavings } = useExpenses();

  /**
   * 1. Calculate Real Total Spending
   * Excludes "Savings" category so the header shows actual money spent.
   */
  const grandTotalExpenses = useMemo(() => {
    return expenses
      .filter(e => e.category !== "Savings")
      .reduce((sum, expense) => sum + expense.amount, 0);
  }, [expenses]);

  /**
   * 2. Logic to Link Active Goal with Transactions
   * Combines manual contributions and transactions categorized as "Savings".
   */
  const savingsStats = useMemo(() => {
    // Find the primary goal set by the user
    const activeGoal = savings.find(s => s.type === "GOAL");

    // Get manual additions from the Savings form
    const directSavings = savings
      .filter(s => s.type === "CONTRIBUTION")
      .reduce((sum, s) => sum + s.amount, 0);

    // Get transactions marked with the "Savings" category
    const savingsFromTransactions = expenses
      .filter(e => e.category === "Savings")
      .reduce((sum, e) => sum + e.amount, 0);

    const totalSaved = directSavings + savingsFromTransactions;
    const target = activeGoal ? activeGoal.amount : 0;

    const remaining = target - totalSaved;
    const progress = target > 0 ? (totalSaved / target) * 100 : 0;

    return {
      activeGoal: activeGoal ? activeGoal.title : "No Goal Set",
      totalSaved,
      remaining: remaining > 0 ? remaining : 0,
      progress: progress > 100 ? 100 : progress,
      hasGoal: !!activeGoal
    };
  }, [savings, expenses]);

  /**
   * Triggers a confirmation alert before clearing all savings data.
   */
  const handleReset = () => {
    Alert.alert(
      "Reset Goal?", 
      "This will delete progress. Transactions with category 'Savings' will remain in history but won't count toward the next goal.", 
      [
        { text: "Cancel", style: "cancel" },
        { text: "Reset", style: "destructive", onPress: () => resetSavings() }
      ]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Header Section with Real Spending Balance */}
      <View style={styles.headerBg}>
        <SafeAreaView>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>REAL SPENDING</Text>
              <Text style={styles.totalBalanceText}>${grandTotalExpenses.toFixed(2)}</Text>
            </View>
            <View style={styles.avatar}>
              <Ionicons name="person-outline" size={16} color="#FFF" />
            </View>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Visual Analytics Chart */}
        <View style={{ marginTop: -20 }}>
          <SpendingChart />
        </View>

        {/* SAVINGS PROGRESS CARD: Displays goal title, amounts, and progress bar */}
        <View style={styles.savingsSummaryCard}>
          <View style={styles.savingsHeaderRow}>
            <View style={styles.savingsIconBox}>
              <Ionicons name="flag" size={22} color={COLORS.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.savingsLabel}>ACTIVE GOAL</Text>
              <Text style={styles.savingsGoalTitle}>{savingsStats.activeGoal}</Text>
            </View>
            {savingsStats.hasGoal && (
              <TouchableOpacity onPress={handleReset} style={styles.resetBtn}>
                <Ionicons name="trash-outline" size={20} color={COLORS.error} />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.statsRow}>
            <View>
              <Text style={styles.statLabel}>Total Saved</Text>
              <Text style={styles.statValue}>${savingsStats.totalSaved.toFixed(2)}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={[styles.statLabel, { color: COLORS.error }]}>To Reach Goal</Text>
              <Text style={[styles.statValue, { color: COLORS.error }]}>
                ${savingsStats.remaining.toFixed(2)}
              </Text>
            </View>
          </View>

          {/* Progress Bar Visualization */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBg}>
              <View style={[styles.progressFill, { width: `${savingsStats.progress}%` }]} />
            </View>
            <Text style={styles.progressPct}>{savingsStats.progress.toFixed(0)}% Complete</Text>
          </View>
        </View>

        {/* Input Forms */}
        <SavingsForm />
        <View style={{ height: 20 }} />
        <ExpenseForm />

        {/* Recent Activity List Header */}
        <View style={styles.listHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <Ionicons name="list" size={20} color={COLORS.textSecondary} />
        </View>
        <ExpenseList />
      </ScrollView>
    </View>
  );
}

// STYLES WITH VERTICAL PROPERTY FORMATTING
const styles = StyleSheet.create({
  headerBg: {
    backgroundColor: COLORS.primary,
    height: 180,
    paddingHorizontal: SIZES.padding,
    paddingTop: Platform.OS === 'android' ? 30 : 10,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  totalBalanceText: {
    color: "#FFF",
    fontSize: 30,
    fontWeight: "800",
    marginTop: 5,
  },
  greeting: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  avatar: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  scrollContent: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: 50,
  },
  savingsSummaryCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: 20,
    marginBottom: 25,
    ...SHADOWS.card,
  },
  savingsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  savingsIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: COLORS.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  savingsLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: '700',
  },
  savingsGoalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  resetBtn: {
    padding: 8,
    backgroundColor: COLORS.error + '10',
    borderRadius: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  progressContainer: {
    marginTop: 5,
  },
  progressBg: {
    height: 10,
    backgroundColor: COLORS.background,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.success,
    borderRadius: 5,
  },
  progressPct: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 6,
    textAlign: 'center',
    fontWeight: '700',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
});