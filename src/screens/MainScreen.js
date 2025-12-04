import React, { useMemo } from "react";
import { View, Text, ScrollView, StyleSheet, StatusBar, SafeAreaView, Platform } from "react-native";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import SpendingChart from "../components/SpendingChart";
import { COLORS, SIZES } from "../constants/theme";
import { useExpenses } from "../context/ExpenseContext"; 
import { Ionicons } from '@expo/vector-icons'; 

export default function MainScreen() {
  const { expenses } = useExpenses();

  const grandTotal = useMemo(() => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }, [expenses]);
  
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      
      <View style={styles.headerBg}>
          <SafeAreaView>
            <View style={styles.headerContent}>
                <View>
                    <Text style={styles.greeting}>TOTAL BALANCE</Text>
                    <Text style={styles.totalBalanceText}>${grandTotal.toFixed(2)}</Text>
                </View>
                <View style={styles.avatar}>
                    <Ionicons name="person-outline" size={16} color="#FFF" />
                </View>
            </View>
          </SafeAreaView>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        <View style={{ marginTop: -10 }}> 
            <SpendingChart />
        </View>

        <View style={{ marginTop: grandTotal === 0 ? 30 : 0 }}>
            <ExpenseForm />
        </View>
        
        <View style={styles.listHeader}>
             <Text style={styles.sectionTitle}>Recent Transactions</Text>
        </View>
        <ExpenseList />
      </ScrollView>
    </View>
  );
}

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
    fontSize: 26, 
    fontWeight: "800", 
    letterSpacing: 0.5,
    marginTop: 5,
  },
  greeting: { 
    color: "rgba(255,255,255,0.7)", 
    fontSize: 14, 
    fontWeight: '600', 
    textTransform: 'uppercase' 
  },
  avatar: {
    width: 40, 
    height: 40, 
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20, 
    justifyContent: 'center', 
    alignItems: 'center',
    borderWidth: 1, 
    borderColor: 'rgba(255,255,255,0.3)'
  },
  scrollContent: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: 50,
  },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textPrimary,
  }
});