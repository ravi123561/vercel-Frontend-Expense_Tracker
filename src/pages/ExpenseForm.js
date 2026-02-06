import React, { useState } from 'react'
import { handleError } from '../utils';

function ExpenseForm({ addTransaction }) {

    const [expenseInfo, setExpenseInfo] = useState({
        amount: '',
        text: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target;

        setExpenseInfo({
            ...expenseInfo,
            [name]: name === 'amount' ? Number(value) : value
        });
    }

    const addExpenses = (e) => {
        e.preventDefault();
        const { amount, text } = expenseInfo;

        if (!amount || !text) {
            handleError('Please add Expense Details');
            return;
        }

        addTransaction({
            ...expenseInfo,
            amount: Number(amount)
        });

        setExpenseInfo({ amount: '', text: '' });
    }

    return (
        <div className='container'>
            <h1>Expense Tracker</h1>
            <form onSubmit={addExpenses}>
                <div>
                    <label>Expense Detail</label>
                    <input
                        type='text'
                        name='text'
                        placeholder='Enter your Expense Detail...'
                        value={expenseInfo.text}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Amount</label>
                    <input
                        type='number'
                        name='amount'
                        placeholder='Enter your Amount...'
                        value={expenseInfo.amount}
                        onChange={handleChange}
                    />
                </div>

                <button type='submit'>Add Expense</button>
            </form>
        </div>
    )
}

export default ExpenseForm;
