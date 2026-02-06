import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { APIUrl, handleError, handleSuccess } from "../utils";
import ExpenseTable from "./ExpenseTable";
import ExpenseDetails from "./ExpenseDetails";
import ExpenseForm from "./ExpenseForm";

function Home() {
  const [loggedInUser, setLoggedInUser] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [incomeAmt, setIncomeAmt] = useState(0);
  const [expenseAmt, setExpenseAmt] = useState(0);

  const navigate = useNavigate();

  // 🔹 Logged-in user
  useEffect(() => {
    setLoggedInUser(localStorage.getItem("loggedInUser"));
  }, []);

  // 🔹 Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    handleSuccess("User Logged out");

    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  // 🔹 Calculate income & expense
  useEffect(() => {
    let income = 0;
    let expense = 0;

    expenses.forEach((item) => {
      const amt = Number(item.amount);
      if (amt > 0) income += amt;
      else expense += amt;
    });

    setIncomeAmt(income);
    setExpenseAmt(Math.abs(expense));
  }, [expenses]);

  // 🔹 Fetch expenses (Vercel-safe)
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch(`${APIUrl}/expenses/getData`, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });

        if (response.status === 403) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        const result = await response.json();
        setExpenses(result.data);
      } catch (err) {
        handleError(err);
      }
    };

    fetchExpenses();
  }, [navigate]);

  // 🔹 Add Expense
  const addTransaction = async (data) => {
    try {
      const response = await fetch(`${APIUrl}/expenses/add`, {
        method: "POST",
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.status === 403) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      const result = await response.json();
      handleSuccess(result.message);
      setExpenses(result.data);
    } catch (err) {
      handleError(err);
    }
  };

  // 🔹 Delete Expense
  const deleteExpense = async (id) => {
    try {
      const response = await fetch(`${APIUrl}/expenses/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      if (response.status === 403) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      const result = await response.json();
      handleSuccess(result.message);
      setExpenses(result.data);
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <div>
      <div className="user-section">
        <h1>Welcome {loggedInUser}</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <ExpenseDetails
        incomeAmt={incomeAmt}
        expenseAmt={expenseAmt}
      />

      <ExpenseForm addTransaction={addTransaction} />

      <ExpenseTable
        expenses={expenses}
        deleteExpense={deleteExpense}
      />

      <ToastContainer />
    </div>
  );
}

export default Home;
