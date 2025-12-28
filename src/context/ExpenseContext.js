import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy,
  getDocs 
} from "firebase/firestore";
import { db } from "../firebaseConfig"; 

// Initialize the Context
const ExpenseContext = createContext();

/**
 * ExpenseProvider Component
 * Manages global state for expenses and savings with real-time Firebase sync.
 */
export function ExpenseProvider({ children }) {
  const [expenses, setExpenses] = useState([]);
  const [savings, setSavings] = useState([]);
  const [loading, setLoading] = useState(true);

  /**
   * Real-time listeners for Firestore collections
   */
  useEffect(() => {
    // Reference and query for Expenses collection (sorted by newest date)
    const qExpenses = query(
      collection(db, "expenses"), 
      orderBy("date", "desc")
    );

    const unsubscribeExpenses = onSnapshot(qExpenses, (snapshot) => {
      setExpenses(
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    });

    // Reference and query for Savings collection
    const qSavings = query(
      collection(db, "savings"), 
      orderBy("date", "desc")
    );

    const unsubscribeSavings = onSnapshot(qSavings, (snapshot) => {
      setSavings(
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
      setLoading(false);
    });

    // Clean up listeners on component unmount
    return () => {
      unsubscribeExpenses();
      unsubscribeSavings();
    };
  }, []);

  /**
   * Adds a new expense record to Firestore
   */
  const addExpense = async (expense) => {
    try {
      await addDoc(collection(db, "expenses"), expense);
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  /**
   * Deletes a specific expense record by ID
   */
  const deleteExpense = async (id) => {
    try {
      await deleteDoc(doc(db, "expenses", id));
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  /**
   * Adds a new saving contribution or goal to Firestore
   */
  const addSaving = async (saving) => {
    try {
      await addDoc(collection(db, "savings"), saving);
    } catch (error) {
      console.error("Error adding saving:", error);
    }
  };

  /**
   * Resets the Active Goal by deleting all documents in the savings collection
   */
  const resetSavings = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "savings"));
      
      // Map all documents to delete promises
      const deletePromises = querySnapshot.docs.map((document) =>
        deleteDoc(doc(db, "savings", document.id))
      );
      
      // Execute all deletions simultaneously
      await Promise.all(deletePromises);
    } catch (error) {
      console.error("Error resetting savings:", error);
      throw error;
    }
  };

  return (
    <ExpenseContext.Provider 
      value={{ 
        expenses, 
        addExpense, 
        deleteExpense, 
        savings, 
        addSaving, 
        resetSavings, 
        loading 
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}

/**
 * Custom Hook for accessing the Expense Context
 */
export function useExpenses() {
  return useContext(ExpenseContext);
}