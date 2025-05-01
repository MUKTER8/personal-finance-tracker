import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Cards from "../components/Cards";
import AddExpenseModal from "../components/Modals/addExpenses";
import AddIncomeModal from "../components/Modals/addIncome";
import moment from "moment";
import {
  addDoc,
  doc,
  collection,
  query,
  getDocs,
  writeBatch,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "react-toastify";
import TransactionsTable from "../components/TransactionsTable";
import AIFinancialAdvisor from "../components/AIFinancialAdvisor";
import ChartComponent from "../components/Charts";
import NoTransactions from "../components/NoTransactions";

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isExpensesModalVisible, setIsExpensesModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [user] = useAuthState(auth);

  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);

  const showExpensesModal = () => setIsExpensesModalVisible(true);
  const showIncomeModal = () => setIsIncomeModalVisible(true);
  const handleExpensesCancel = () => setIsExpensesModalVisible(false);
  const handleIncomeCancel = () => setIsIncomeModalVisible(false);

  const onFinish = (values, type) => {
    let transactionDate;

    try {
      if (values.date && values.date.format) {
        transactionDate = values.date.format("YYYY-MM-DD");
      } else if (values.date) {
        transactionDate = moment(values.date).format("YYYY-MM-DD");
      } else {
        throw new Error("Date not provided");
      }
    } catch (error) {
      console.error("Date processing error:", error);
      transactionDate = moment().format("YYYY-MM-DD");
      toast.warn("Defaulting to current date");
    }

    const newTransaction = {
      type: type,
      date: transactionDate,
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name,
    };

    if (type === "income") {
      addTransaction(newTransaction, handleIncomeCancel);
    } else {
      addTransaction(newTransaction, handleExpensesCancel);
    }
  };

  // Add the resetBalance function to your existing Dashboard component
  const resetBalance = async () => {
    if (!user) {
      toast.error("Please sign in to reset balance");
      return;
    }

    if (
      !window.confirm(
        "Are you sure you want to reset all transactions? This cannot be undone."
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      const transactionsRef = collection(db, `users/${user.uid}/transactions`);
      const q = query(transactionsRef);
      const querySnapshot = await getDocs(q);

      const batch = writeBatch(db);
      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      await fetchTransactions();
      toast.success("All transactions have been reset");
    } catch (error) {
      console.error("Error resetting transactions:", error);
      toast.error("Failed to reset transactions");
    } finally {
      setLoading(false);
    }
  };

  // Then update the Cards component in the return statement:

  async function addTransaction(transaction, closeModal) {
    if (!user) {
      toast.error("Please sign in to add transactions");
      return;
    }
    try {
      await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );
      await fetchTransactions(false);
      closeModal();
      toast.success(
        `${
          transaction.type === "income" ? "Income" : "Expense"
        } added successfully!`
      );
    } catch (e) {
      console.error("Error adding transaction:", e);
      toast.error("Failed to add transaction");
    }
  }

  // NEW: Handle CSV import
  const handleImport = async (importedTransactions) => {
    if (!user) {
      toast.error("Please sign in to import transactions");
      return false;
    }

    try {
      setLoading(true);
      const batch = writeBatch(db);
      const transactionsRef = collection(db, `users/${user.uid}/transactions`);

      // Add all transactions to batch
      importedTransactions.forEach((tx) => {
        const docRef = doc(transactionsRef);
        batch.set(docRef, tx);
      });

      await batch.commit();

      // Immediately update local state while Firebase processes
      const newTransactions = [...importedTransactions, ...transactions].sort(
        (a, b) => moment(b.date).valueOf() - moment(a.date).valueOf()
      );

      setTransactions(newTransactions);
      calculateBalance(newTransactions);

      toast.success(`Imported ${importedTransactions.length} transactions`);
      return true;
    } catch (error) {
      console.error("Import error:", error);
      toast.error("Failed to import transactions");
      return false;
    } finally {
      await fetchTransactions(false); // Refresh from Firebase to ensure consistency
    }
  };

  async function fetchTransactions(showLoader = true) {
    if (!user) return;

    if (showLoader) setLoading(true);

    try {
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      console.log(querySnapshot);
      const transactionsArray = [];

      querySnapshot.forEach((doc) => {
        transactionsArray.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      transactionsArray.sort(
        (a, b) => moment(b.date).valueOf() - moment(a.date).valueOf()
      );

      setTransactions(transactionsArray);
      calculateBalance(transactionsArray);
    } catch (error) {
      console.error("Failed to load transactions:", error);
      toast.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  const calculateBalance = (transactionsData) => {
    const totals = transactionsData.reduce(
      (acc, transaction) => {
        const amount = parseFloat(transaction.amount) || 0;
        if (transaction.type === "income") {
          acc.income += amount;
        } else {
          acc.expense += amount;
        }
        return acc;
      },
      { income: 0, expense: 0 }
    );

    setIncome(parseFloat(totals.income.toFixed(2)));
    setExpense(parseFloat(totals.expense.toFixed(2)));
    setTotalBalance(parseFloat((totals.income - totals.expense).toFixed(2)));
  };

  let sortedTransactions = transactions.sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });

  return (
    <div>
      <Header />
      <Cards
        income={income}
        expense={expense}
        totalBalance={totalBalance}
        showExpensesModal={showExpensesModal}
        showIncomeModal={showIncomeModal}
        resetBalance={resetBalance}
      />

      {transactions.length != 0 ? (
        <ChartComponent sortedTransactions={sortedTransactions} />
      ) : (
        <NoTransactions />
      )}

      {loading && (
        <p style={{ textAlign: "center", marginTop: "10px" }}>
          Loading transactions...
        </p>
      )}

      <AddExpenseModal
        isExpenseModalVisible={isExpensesModalVisible}
        handleExpenseCancel={handleExpensesCancel}
        onFinish={onFinish}
      />

      <AddIncomeModal
        isIncomeModalVisible={isIncomeModalVisible}
        handleIncomeCancel={handleIncomeCancel}
        onFinish={onFinish}
      />

      <TransactionsTable
        transactions={transactions}
        loading={loading}
        refreshData={fetchTransactions}
        onImport={handleImport} // Pass the import handler
      />
      <AIFinancialAdvisor
        income={income}
        expenses={expense}
        transactions={transactions}
      />
    </div>
  );
}

export default Dashboard;
