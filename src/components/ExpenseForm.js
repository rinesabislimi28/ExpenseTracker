import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Keyboard } from "react-native";
import { useExpenses } from "../context/ExpenseContext";
import { COLORS, SIZES, SHADOWS } from "../constants/theme";
import { Ionicons } from '@expo/vector-icons';

const categories = [
  { label: "Food", icon: "fast-food" },
  { label: "Transport", icon: "car" },
  { label: "Entertainment", icon: "film" },
  { label: "Shopping", icon: "cart" },
  { label: "Bills", icon: "receipt" },
  { label: "Other", icon: "cube" },
];

export default function ExpenseForm() {
  const { addExpense } = useExpenses();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");

  function handleAdd() {
    if (!title || !amount) return;
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) return;

    addExpense({
      title,
      amount: numericAmount,
      category,
      date: new Date().toISOString(),
    });

    setTitle(""); 
    setAmount(""); 
    Keyboard.dismiss();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>New Transaction</Text>
      
      <View style={styles.inputGroup}>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Title</Text>
          <TextInput 
              style={styles.input} 
              value={title} 
              onChangeText={setTitle} 
              placeholder="e.g. Starbucks" 
              placeholderTextColor={COLORS.textTertiary}
          />
        </View>

        <View style={[styles.inputWrapper, {marginTop: 15}]}>
          <Text style={styles.label}>Amount</Text>
          <View style={styles.amountContainer}>
             <Text style={styles.currencySymbol}>$</Text>
             <TextInput 
                style={[styles.input, styles.amountInput]} 
                value={amount} 
                onChangeText={setAmount} 
                placeholder="0.00" 
                keyboardType="numeric" 
                placeholderTextColor={COLORS.textTertiary}
            />
          </View>
        </View>
      </View>

      {/* Category Selector (Custom Chips) */}
      <Text style={[styles.label, {marginTop: 20, marginBottom: 10}]}>Select Category</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catScroll}>
        {categories.map((cat) => {
          const isActive = category === cat.label;
          return (
            <TouchableOpacity 
              key={cat.label} 
              onPress={() => setCategory(cat.label)}
              style={[styles.catItem, isActive && styles.catItemActive]}
            >
              <Ionicons name={cat.icon} size={16} color={isActive ? "#FFF" : COLORS.textSecondary} style={{marginRight: 6}} />
              <Text style={[styles.catText, isActive && styles.catTextActive]}>{cat.label}</Text>
            </TouchableOpacity>
          )
        })}
      </ScrollView>

      {/* Add Button */}
      <TouchableOpacity style={styles.btnAdd} onPress={handleAdd} activeOpacity={0.8}>
          <Text style={styles.btnText}>Add Expense</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 30 },
  heading: { fontSize: SIZES.h2, fontWeight: "700", color: COLORS.textPrimary, marginBottom: 15 },
  
  inputGroup: {
    backgroundColor: COLORS.card,
    padding: 20,
    borderRadius: SIZES.radius,
    ...SHADOWS.card
  },
  inputWrapper: {},
  label: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 8, fontWeight: "700", textTransform: 'uppercase' },
  input: {
      backgroundColor: COLORS.background,
      borderRadius: 12,
      paddingHorizontal: 15,
      paddingVertical: 14,
      fontSize: 16,
      color: COLORS.textPrimary,
      fontWeight: '600'
  },
  amountContainer: { position: 'relative' },
  currencySymbol: { position: 'absolute', left: 15, top: 14, zIndex: 1, fontSize: 16, color: COLORS.textSecondary, fontWeight: 'bold'},
  amountInput: { paddingLeft: 30 },

  // Categories
  catScroll: { paddingRight: 20 },
  catItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 30,
    marginRight: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  catItemActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    ...SHADOWS.soft 
  },
  catText: { fontWeight: "600", color: COLORS.textSecondary },
  catTextActive: { color: "#FFF" },

  // Button
  btnAdd: {
      backgroundColor: COLORS.primary, 
      borderRadius: SIZES.radius,
      paddingVertical: 18,
      alignItems: 'center',
      marginTop: 25,
      ...SHADOWS.soft
  },
  btnText: { color: "#FFF", fontWeight: "bold", fontSize: 16 }
});