const ExpenseTable = ({ expenses, deleteExpense }) => {
  return (
    <div className="expense-list">
      {expenses.map((expense) => (
        <div key={expense._id} className="expense-item">
          <button
            className="delete-button"
            onClick={() => deleteExpense(expense._id)}
          >
            X
          </button>

          <div className="expense-description">{expense.text}</div>

          <div
            className="expense-amount"
            style={{ color: expense.amount > 0 ? "#27ae60" : "#c0392b" }}
          >
            ₹{expense.amount}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExpenseTable;
