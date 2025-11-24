import { useState, useEffect } from 'react'
import axios from 'axios'
import './index.css'

function App() {
    const [transactions, setTransactions] = useState([])
    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        category: '',
        type: 'expense'
    })

    useEffect(() => {
        fetchTransactions()
    }, [])

    const fetchTransactions = async () => {
        try {
            const response = await axios.get(`/api/expenses?t=${Date.now()}`)
            console.log('Fetched transactions:', response.data)
            setTransactions(response.data)
        } catch (error) {
            console.error('Error fetching transactions:', error)
        }
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await axios.post('/api/expenses', formData)
            setFormData({ description: '', amount: '', category: '', type: formData.type })
            fetchTransactions()
        } catch (error) {
            console.error('Error creating transaction:', error)
        }
    }

    // Calculate totals
    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0)

    const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0)

    const balance = totalIncome - totalExpenses

    return (
        <div className="container">
            <header>
                <h1>Personal Finance Tracker</h1>
            </header>

            <main>
                {/* Summary Cards */}
                <section className="summary-section">
                    <div className="summary-card income-card">
                        <h3>Total Income</h3>
                        <p className="amount">${totalIncome.toFixed(2)}</p>
                    </div>
                    <div className="summary-card expense-card">
                        <h3>Total Expenses</h3>
                        <p className="amount">${totalExpenses.toFixed(2)}</p>
                    </div>
                    <div className="summary-card balance-card">
                        <h3>Balance</h3>
                        <p className={`amount ${balance >= 0 ? 'positive' : 'negative'}`}>
                            ${balance.toFixed(2)}
                        </p>
                    </div>
                </section>

                <section className="transaction-form">
                    <h2>Add Transaction</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group type-selector">
                            <label>
                                <input
                                    type="radio"
                                    name="type"
                                    value="expense"
                                    checked={formData.type === 'expense'}
                                    onChange={handleChange}
                                />
                                <span className="radio-label expense-label">Expense</span>
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="type"
                                    value="income"
                                    checked={formData.type === 'income'}
                                    onChange={handleChange}
                                />
                                <span className="radio-label income-label">Income</span>
                            </label>
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">Description</label>
                            <input
                                type="text"
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                placeholder="e.g. Salary, Lunch, Rent"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="amount">Amount</label>
                            <input
                                type="number"
                                id="amount"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                required
                                step="0.01"
                                placeholder="0.00"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="category">Category</label>
                            <input
                                type="text"
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                                placeholder="e.g. Food, Salary, Housing"
                            />
                        </div>

                        <button type="submit" className={`submit-btn ${formData.type}`}>
                            Add {formData.type === 'income' ? 'Income' : 'Expense'}
                        </button>
                    </form>
                </section>

                <section className="transaction-list">
                    <h2>Recent Transactions</h2>
                    {transactions.length === 0 ? (
                        <p className="empty-state">No transactions recorded yet.</p>
                    ) : (
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Type</th>
                                        <th>Description</th>
                                        <th>Category</th>
                                        <th>Date</th>
                                        <th className="text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map((transaction) => (
                                        <tr key={transaction.id} className={`transaction-row ${transaction.type}`}>
                                            <td>
                                                <span className={`type-badge ${transaction.type}`}>
                                                    {transaction.type === 'income' ? '↑' : '↓'}
                                                </span>
                                            </td>
                                            <td>{transaction.description}</td>
                                            <td><span className="badge">{transaction.category}</span></td>
                                            <td>{new Date(transaction.createdAt).toLocaleDateString()}</td>
                                            <td className={`text-right amount ${transaction.type}`}>
                                                {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}</tbody>
                            </table>
                        </div>
                    )}
                </section>
            </main>
        </div>
    )
}

export default App
