
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { APIUrl, handleError, handleSuccess } from '../utils'
import { ToastContainer } from 'react-toastify'
import ExpenseTable from './ExpenseTable'
import ExpenseDetails from './ExpenseDetails'
import ExpenseForm from './ExpenseForm'

function Home() {
    const [loggedInUser, setLoggedInUser] = useState('')
    const [expenses, setExpenses] = useState([])
    const [incomeAmt, setIncomeAmt] = useState(0)
    const [expenseAmt, setExpenseAmt] = useState(0)

    const navigate = useNavigate()

    // 🔹 Logged-in user
    useEffect(() => {
        setLoggedInUser(localStorage.getItem('loggedInUser'))
    }, [])

    // 🔹 Logout
    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('loggedInUser')
        handleSuccess('User Loggedout')
        setTimeout(() => {
            navigate('/login')
        }, 1000)
    }

    // 🔹 EXPENSE CALCULATION (FIXED)
    useEffect(() => {
    let income = 0
    let expense = 0

    expenses.forEach(item => {
        const amt = Number(item.amount)

        if (amt > 0) {
            income += amt
        } else {
            expense += amt
        }
    })

    setIncomeAmt(income)
    setExpenseAmt(Math.abs(expense))
}, [expenses])


    // 🔹 Delete Expense
    const deleteExpens = async (id) => {
        try {
            const response = await fetch(`${APIUrl}/expenses/${id}`, {//send to backend for expense deletion 
                method: 'DELETE',
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            })

            if (response.status === 403) {
                localStorage.removeItem('token')
                navigate('/login')
                return
            }

            const result = await response.json()
            handleSuccess(result?.message)
            setExpenses(result.data)

        } catch (err) {
            handleError(err)
        }
    }

    // 🔹 Fetch Expenses
    const fetchExpenses = async () => {
        try {
            const response = await fetch(`${APIUrl}/expenses/getData`, {
                // First goes to base URL, then to /expenses route,
                // then ExpenseRouter ke /getData route ko trigger karta hai

                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            })

            if (response.status === 403) {
                localStorage.removeItem('token')
                navigate('/login')
                return
            }

            const result = await response.json()
            setExpenses(result.data)

        } catch (err) {
            handleError(err)
        }
    }

    // 🔹 Add Expense
    const addTransaction = async (data) => {
        try {
            const response = await fetch(`${APIUrl}/expenses/add`, {
                method: 'POST',
                headers: {
                    'Authorization': localStorage.getItem('token'),
                    'Content-Type': 'application/json'//it says which type data you want to send to backend.
                },
                body: JSON.stringify(data)
            })

            if (response.status === 403) {
                localStorage.removeItem('token')
                navigate('/login')
                return
            }

            const result = await response.json()
            handleSuccess(result?.message)
            setExpenses(result.data)

        } catch (err) {
            handleError(err)
        }
    }

    // 🔹 Initial fetch
    useEffect(() => {
        fetchExpenses()
    }, [])

    return (
        <div>
            <div className='user-section'>
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
                deleteExpens={deleteExpens}
            />

            <ToastContainer />
        </div>
    )
}

export default Home
