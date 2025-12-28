import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Keyboard,
  Alert 
} from "react-native";
import { useExpenses } from "../context/ExpenseContext";
import { COLORS, SIZES, SHADOWS } from "../constants/theme";
import { Ionicons } from '@expo/vector-icons';

export default function SavingsForm() {
  // Access addSaving function from the global context
  const { addSaving } = useExpenses();

  // Local state for form inputs and toggle logic
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [isGoal, setIsGoal] = useState(true); // Toggle between "New Goal" or "Adding Money"

  /**
   * Validates and submits the saving data to Firebase
   */
  const handleAddSaving = async () => {
    // Basic Validation: Ensure fields are not empty
    if (!title.trim() || !amount) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    // Amount Validation: Ensure number is positive and valid
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }

    // Data structure for Firestore
    const savingData = {
      title: title.trim(),
      amount: numericAmount,
      type: isGoal ? "GOAL" : "CONTRIBUTION", // GOAL = target, CONTRIBUTION = progress update
      date: new Date().toISOString(),
    };

    try {
      await addSaving(savingData);
      
      // Clear form and hide keyboard on success
      setTitle("");
      setAmount("");
      Keyboard.dismiss();
      Alert.alert("Success", isGoal ? "New goal set!" : "Savings updated!");
    } catch (error) {
      Alert.alert("Error", "Could not save to Cloud. Check connection.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Savings Management</Text>
      
      <View style={styles.card}>
        {/* Toggle Switch: Switch between creating a goal or adding money */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity 
            style={[styles.toggleBtn, isGoal && styles.toggleActive]} 
            onPress={() => setIsGoal(true)}
          >
            <Text style={[styles.toggleText, isGoal && styles.toggleTextActive]}>Set Goal</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleBtn, !isGoal && styles.toggleActive]} 
            onPress={() => setIsGoal(false)}
          >
            <Text style={[styles.toggleText, !isGoal && styles.toggleTextActive]}>Add Money</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          {/* Label changes based on toggle state */}
          <Text style={styles.label}>
            {isGoal ? "What are you saving for?" : "Which goal are you funding?"}
          </Text>
          <TextInput 
            style={styles.input} 
            value={title} 
            onChangeText={setTitle} 
            placeholder={isGoal ? "e.g. New iPhone" : "e.g. Vacation Fund"} 
            placeholderTextColor={COLORS.textTertiary}
          />
          
          <Text style={[styles.label, {marginTop: 15}]}>
            {isGoal ? "Target Amount ($)" : "Amount to add ($)"}
          </Text>

          {/* Icon-integrated Input for Amount */}
          <View style={styles.amountWrapper}>
            <Ionicons 
              name="cash-outline" 
              size={20} 
              color={COLORS.textSecondary} 
              style={styles.icon} 
            />
            <TextInput 
              style={styles.amountInput} 
              value={amount} 
              onChangeText={setAmount} 
              placeholder="0.00" 
              keyboardType="numeric" 
              placeholderTextColor={COLORS.textTertiary}
            />
          </View>

          {/* Action Button: Dynamic color and icon */}
          <TouchableOpacity 
            style={[
                styles.button, 
                { backgroundColor: isGoal ? COLORS.primary : COLORS.success }
            ]} 
            onPress={handleAddSaving}
          >
            <Ionicons 
              name={isGoal ? "flag" : "add-circle"} 
              size={20} 
              color="#FFF" 
              style={{marginRight: 8}} 
            />
            <Text style={styles.buttonText}>
              {isGoal ? "Establish Goal" : "Save Now"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// Stylesheet with vertical property formatting
const styles = StyleSheet.create({
  container: { 
    marginVertical: 20 
  },
  heading: { 
    fontSize: SIZES.h2, 
    fontWeight: "800", 
    color: COLORS.textPrimary, 
    marginBottom: 12,
    letterSpacing: 0.5
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 20,
    ...SHADOWS.card
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 4,
    marginBottom: 20
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10
  },
  toggleActive: {
    backgroundColor: COLORS.card,
    ...SHADOWS.small
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary
  },
  toggleTextActive: {
    color: COLORS.primary
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase'
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)'
  },
  amountWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)'
  },
  icon: {
    paddingLeft: 12
  },
  amountInput: {
    flex: 1,
    padding: 14,
    fontSize: 16,
    color: COLORS.textPrimary
  },
  button: {
    flexDirection: 'row',
    borderRadius: 15,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
    ...SHADOWS.medium
  },
  buttonText: { 
    color: "#FFF", 
    fontWeight: "700", 
    fontSize: 16 
  }
});