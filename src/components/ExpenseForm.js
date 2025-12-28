import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useExpenses } from "../context/ExpenseContext";
import { COLORS, SIZES, SHADOWS } from "../constants/theme";

// Available transaction categories
const CATEGORIES = ["Food", "Transport", "Shopping", "Bills", "Entertainment", "Savings", "Other"];

export default function ExpenseForm() {
  // Access the addExpense function from the context
  const { addExpense } = useExpenses();
  
  // Local state for form inputs
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");

  // Handle the form submission
  const handleSubmit = () => {
    // Basic validation to ensure fields are not empty
    if (!title || !amount) return;

    // Send data to Firebase via Context
    addExpense({
      title,
      amount: parseFloat(amount),
      category,
      date: new Date().toISOString(),
    });

    // Reset inputs after successful submission
    setTitle("");
    setAmount("");
  };

  return (
    <View style={styles.container}>
      {/* Transaction Title Input */}
      <TextInput 
        style={styles.input} 
        placeholder="Title" 
        value={title} 
        onChangeText={setTitle} 
      />

      {/* Transaction Amount Input */}
      <TextInput 
        style={styles.input} 
        placeholder="Amount" 
        value={amount} 
        keyboardType="numeric" 
        onChangeText={setAmount} 
      />
      
      {/* Category Selection List */}
      <View style={styles.catContainer}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity 
            key={cat} 
            style={[
                styles.catButton, 
                category === cat && styles.activeCat // Apply active style if selected
            ]} 
            onPress={() => setCategory(cat)}
          >
            <Text style={{ color: category === cat ? "#FFF" : COLORS.textPrimary }}>
                {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
        <Text style={styles.submitText}>Add Transaction</Text>
      </TouchableOpacity>
    </View>
  );
}

// Stylesheet with vertical property formatting
const styles = StyleSheet.create({
  container: { 
    backgroundColor: COLORS.card, 
    padding: 20, 
    borderRadius: SIZES.radius, 
    marginBottom: 20,
    ...SHADOWS.card 
  },
  input: { 
    backgroundColor: COLORS.background, 
    padding: 12, 
    borderRadius: 10, 
    marginBottom: 10,
    color: COLORS.textPrimary
  },
  catContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 5, 
    marginBottom: 15 
  },
  catButton: { 
    padding: 8, 
    backgroundColor: COLORS.background, 
    borderRadius: 8, 
    borderWidth: 1, 
    borderColor: '#EEE' 
  },
  activeCat: { 
    backgroundColor: COLORS.primary, 
    borderColor: COLORS.primary 
  },
  submitBtn: { 
    backgroundColor: COLORS.primary, 
    padding: 15, 
    borderRadius: 12, 
    alignItems: 'center',
    justifyContent: 'center'
  },
  submitText: { 
    color: "#FFF", 
    fontWeight: "bold",
    fontSize: 16
  }
});