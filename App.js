import React from 'react';
import { ExpenseProvider } from "./src/context/ExpenseContext";
import MainScreen from "./src/screens/MainScreen";

/**
 * Root Application Component
 * This is the entry point of your mobile app.
 */
export default function App() {
  return (
    /**
     * ExpenseProvider:
     * We wrap the MainScreen with this Provider so that all nested components
     * can access the global expenses and savings state without prop drilling.
     */
    <ExpenseProvider>
      <MainScreen />
    </ExpenseProvider>
  );
}