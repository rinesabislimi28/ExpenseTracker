import React from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { useExpenses } from "../context/ExpenseContext";
import { COLORS, SIZES, SHADOWS } from "../constants/theme";
import { FontAwesome } from '@expo/vector-icons'; 

/**
 * Single Expense Item Component
 * Renders individual transaction details including icon, title, date, and amount.
 */
const ExpenseItem = ({ item, onDelete }) => {
  // Format the ISO date string to a readable format (e.g., "Dec 28")
  const dateOptions = { month: 'short', day: 'numeric' };
  const formattedDate = new Date(item.date).toLocaleDateString('en-US', dateOptions);

  /**
   * Helper function to determine the icon and color based on the category
   */
  const getCategoryConfig = (category) => {
    switch (category) {
      case 'Food': 
        return { icon: 'cutlery', color: COLORS.catFood }; 
      case 'Transport': 
        return { icon: 'car', color: COLORS.catTransport };
      case 'Entertainment': 
        return { icon: 'film', color: COLORS.catEnt };
      case 'Shopping': 
        return { icon: 'shopping-bag', color: COLORS.catShop };
      case 'Bills': 
        return { icon: 'file-text-o', color: COLORS.catBills };
      case 'Savings': 
        return { icon: 'bank', color: COLORS.success }; // Icon for savings category
      default: 
        return { icon: 'money', color: COLORS.catOther };
    }
  };

  const config = getCategoryConfig(item.category);
  
  return (
    <View style={styles.itemContainer}>
      {/* Left section: Icon and Info */}
      <View style={styles.leftSide}>
        <View style={[styles.iconBox, { backgroundColor: config.color + '20' }]}> 
          <FontAwesome name={config.icon} size={20} color={config.color} />
        </View>
        <View>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.date}>{formattedDate} • {item.category}</Text>
        </View>
      </View>
      
      {/* Right section: Amount and Delete button */}
      <View style={styles.rightSide}>
        <Text style={styles.amount}>-${item.amount.toFixed(2)}</Text>
        <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.deleteBtn}>
           <FontAwesome name="trash" size={16} color={COLORS.textTertiary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

/**
 * Main Expense List Component
 * Fetches expenses from context and maps them into a list.
 */
export default function ExpenseList() {
  const { expenses, deleteExpense } = useExpenses();

  // Show a confirmation alert before deleting a record
  const handleDelete = (id) => {
    Alert.alert(
      "Delete Item", 
      "Are you sure?", 
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: () => deleteExpense(id), style: "destructive" },
      ]
    );
  };
  
  // Render empty state if there are no expenses
  if (expenses.length === 0) {
    return (
      <View style={styles.emptyBox}>
        <Text style={styles.emptyText}>No recent activity</Text>
        <Text style={styles.emptySub}>Start by adding a new expense.</Text>
      </View>
    );
  }

  return (
    <View>
      {expenses.map((item) => (
        <ExpenseItem key={item.id} item={item} onDelete={handleDelete} />
      ))}
    </View>
  );
}

// Stylesheet with vertical property formatting
const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    ...SHADOWS.card,
  },
  leftSide: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    flex: 1 
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  title: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: COLORS.textPrimary, 
    marginBottom: 4 
  },
  date: { 
    fontSize: 13, 
    color: COLORS.textSecondary 
  },
  rightSide: { 
    alignItems: 'flex-end' 
  },
  amount: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: COLORS.textPrimary, 
    marginBottom: 4 
  },
  deleteBtn: { 
    padding: 4 
  },
  emptyBox: { 
    padding: 40, 
    alignItems: 'center' 
  },
  emptyText: { 
    color: COLORS.textPrimary, 
    fontSize: 18, 
    fontWeight: '600' 
  },
  emptySub: { 
    color: COLORS.textSecondary, 
    fontSize: 14, 
    marginTop: 5 
  }
});