import React from 'react';
import { ExpenseProvider } from "./src/context/ExpenseContext";
import MainScreen from "./src/screens/MainScreen";

export default function App() {
  return (
    <ExpenseProvider>
      <MainScreen />
    </ExpenseProvider>
  );
}