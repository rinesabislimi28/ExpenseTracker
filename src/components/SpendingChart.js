import React, { useMemo } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { useExpenses } from "../context/ExpenseContext";
import { COLORS, SIZES, SHADOWS } from "../constants/theme";

// Get screen width for responsive chart sizing
const screenWidth = Dimensions.get("window").width;

export default function SpendingChart() {
  const { expenses } = useExpenses();

  // Map categories to their specific theme colors
  const catColorsMap = {
    Food: COLORS.catFood,
    Transport: COLORS.catTransport,
    Entertainment: COLORS.catEnt,
    Shopping: COLORS.catShop,
    Bills: COLORS.catBills,
    Other: COLORS.catOther,
  };

  /**
   * Process expense data to generate chart datasets.
   * memoized to prevent unnecessary recalculations on re-renders.
   */
  const { grandTotal, chartData, chartConfig } = useMemo(() => {
    // Aggregate amounts by category
    const totalsByCategory = expenses.reduce((acc, expense) => {
      const cat = expense.category || "Other";
      if (!acc[cat]) acc[cat] = 0;
      acc[cat] += expense.amount;
      return acc;
    }, {});

    // Calculate overall total to check if we should render the chart
    const gt = Object.values(totalsByCategory).reduce((sum, val) => sum + val, 0);
    
    // Sort and limit categories to the top 5 for better UI presentation
    const dataArray = Object.keys(totalsByCategory)
      .map(cat => ({
        category: cat,
        label: cat.substring(0, 4) + '.', // Shorten labels (e.g., Food -> Food., Trans -> Tran.)
        amount: totalsByCategory[cat],
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    // Construct data object for react-native-chart-kit
    const data = {
      labels: dataArray.map(item => item.label),
      datasets: [
        {
          data: dataArray.map(item => item.amount),
          // Assign dynamic colors per bar based on category
          colors: dataArray.map(item => (opacity = 1) => catColorsMap[item.category] || COLORS.catOther),
        },
      ],
    };
    
    // Chart visual configuration
    const config = {
      backgroundGradientFrom: COLORS.card,
      backgroundGradientTo: COLORS.card,
      decimalPlaces: 0,
      color: (opacity = 1) => COLORS.textSecondary,
      labelColor: (opacity = 1) => COLORS.textSecondary,
      style: { 
        borderRadius: 16 
      },
      barPercentage: 1.0, 
      barRadius: 0, 
      paddingLeft: '10', 
      paddingRight: 0,  
    };

    return { grandTotal: gt, chartData: data, chartConfig: config };
  }, [expenses]);

  // If no spending exists, do not render the chart component
  if (grandTotal === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Spending Distribution</Text> 
      
      {/* BarChart Component 
         Displays top 5 spending categories horizontally
      */}
      <BarChart
        data={chartData}
        width={screenWidth - SIZES.padding * 2 + 10} 
        height={220}
        chartConfig={chartConfig}
        withCustomBarColorFromData={true}
        flatColor={true}
        showValuesOnTopOfBars={true}
        fromZero={true}
        style={styles.chartStyle}
      />
    </View>
  );
}

// Stylesheet with vertical property formatting
const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: 20,
    paddingBottom: 5, 
    marginBottom: 24,
    ...SHADOWS.soft,
  },
  title: { 
    fontSize: SIZES.h2, 
    fontWeight: "700", 
    color: COLORS.textPrimary,
    marginBottom: 5,
  }, 
  chartStyle: {
    marginVertical: 8,
    borderRadius: 16,
  }
});