import React, { useMemo } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { useExpenses } from "../context/ExpenseContext";
import { COLORS, SIZES, SHADOWS } from "../constants/theme";

const screenWidth = Dimensions.get("window").width;

export default function SpendingChart() {
  const { expenses } = useExpenses();

  const catColorsMap = {
    Food: COLORS.catFood,
    Transport: COLORS.catTransport,
    Entertainment: COLORS.catEnt,
    Shopping: COLORS.catShop,
    Bills: COLORS.catBills,
    Other: COLORS.catOther,
  };

  const { grandTotal, chartData, chartConfig } = useMemo(() => {
    const t = expenses.reduce((acc, expense) => {
      const cat = expense.category || "Other";
      if (!acc[cat]) acc[cat] = 0;
      acc[cat] += expense.amount;
      return acc;
    }, {});

    const gt = Object.values(t).reduce((sum, val) => sum + val, 0);
    
    
    const dataArray = Object.keys(t)
      .map(cat => ({
        category: cat,
        label: cat.substring(0, 4) + '.', 
        amount: t[cat],
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    const data = {
      labels: dataArray.map(item => item.label),
      datasets: [
        {
          data: dataArray.map(item => item.amount),
          colors: dataArray.map(item => (opacity = 1) => catColorsMap[item.category] || COLORS.catOther),
        },
      ],
    };
    
    const config = {
      backgroundGradientFrom: COLORS.card,
      backgroundGradientTo: COLORS.card,
      decimalPlaces: 0,
      color: (opacity = 1) => COLORS.textSecondary,
      labelColor: (opacity = 1) => COLORS.textSecondary,
      style: { borderRadius: 16 },
      barPercentage: 1.0, 
      barRadius: 0, 
      paddingLeft: '10', 
      paddingRight: 0,  
    };

    return { grandTotal: gt, chartData: data, chartConfig: config };
  }, [expenses]);

  if (grandTotal === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Spending Distribution</Text> 
      
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