'use client'

import { useState, useMemo } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function Dashboard() {
  // State for expense types
  const [expenseTypes, setExpenseTypes] = useState<string[]>([])
  const [newExpenseType, setNewExpenseType] = useState('')

  // State for revenue types
  const [revenueTypes, setRevenueTypes] = useState<string[]>([])
  const [newRevenueType, setNewRevenueType] = useState('')

  // State for expenses
  const [expenses, setExpenses] = useState<{
    year: number
    month: number
    type: string
    amount: number
  }[]>([])

  // State for revenues
  const [revenues, setRevenues] = useState<{
    year: number
    month: number
    type: string
    amount: number
  }[]>([])

  // Compute monthly totals
  const monthlyTotals = useMemo(() => {
    const totals: { [key: string]: { expenses: number, revenues: number, netProfit: number } } = {}

    // Calculate expense totals
    expenses.forEach(expense => {
      const key = `${expense.year}-${expense.month}`
      if (!totals[key]) {
        totals[key] = { expenses: 0, revenues: 0, netProfit: 0 }
      }
      totals[key].expenses += expense.amount
    })

    // Calculate revenue totals
    revenues.forEach(revenue => {
      const key = `${revenue.year}-${revenue.month}`
      if (!totals[key]) {
        totals[key] = { expenses: 0, revenues: 0, netProfit: 0 }
      }
      totals[key].revenues += revenue.amount
    })

    // Calculate net profit
    Object.keys(totals).forEach(key => {
      totals[key].netProfit = totals[key].revenues - totals[key].expenses
    })

    return totals
  }, [expenses, revenues])

  // Add Expense Type
  const handleAddExpenseType = () => {
    if (newExpenseType && !expenseTypes.includes(newExpenseType)) {
      setExpenseTypes([...expenseTypes, newExpenseType])
      setNewExpenseType('')
    }
  }

  // Add Revenue Type
  const handleAddRevenueType = () => {
    if (newRevenueType && !revenueTypes.includes(newRevenueType)) {
      setRevenueTypes([...revenueTypes, newRevenueType])
      setNewRevenueType('')
    }
  }

  // Add Expense
  const handleAddExpense = (expense: {
    year: number
    month: number
    type: string
    amount: number
  }) => {
    setExpenses([...expenses, expense])
  }

  // Add Revenue
  const handleAddRevenue = (revenue: {
    year: number
    month: number
    type: string
    amount: number
  }) => {
    setRevenues([...revenues, revenue])
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Financial Dashboard</h1>

      {/* Expense Types Management */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Expense Types</h2>
        <div className="flex space-x-2 mb-4">
          <Input 
            placeholder="New Expense Type" 
            value={newExpenseType}
            onChange={(e) => setNewExpenseType(e.target.value)}
          />
          <Button onClick={handleAddExpenseType}>Add Type</Button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {expenseTypes.map((type, index) => (
            <div key={index} className="bg-gray-100 p-2 rounded flex justify-between items-center">
              {type}
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => setExpenseTypes(expenseTypes.filter(t => t !== type))}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Revenue Types Management */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Revenue Types</h2>
        <div className="flex space-x-2 mb-4">
          <Input 
            placeholder="New Revenue Type" 
            value={newRevenueType}
            onChange={(e) => setNewRevenueType(e.target.value)}
          />
          <Button onClick={handleAddRevenueType}>Add Type</Button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {revenueTypes.map((type, index) => (
            <div key={index} className="bg-gray-100 p-2 rounded flex justify-between items-center">
              {type}
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => setRevenueTypes(revenueTypes.filter(t => t !== type))}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Add Expense Modal */}
      <Dialog>
        <DialogTrigger asChild>
          <Button>Add Expense</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Expense</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={(e) => {
            e.preventDefault()
            const formData = new FormData(e.currentTarget)
            handleAddExpense({
              year: Number(formData.get('year')),
              month: Number(formData.get('month')),
              type: formData.get('type') as string,
              amount: Number(formData.get('amount'))
            })
          }}>
            <Select name="type">
              <SelectTrigger>
                <SelectValue placeholder="Select Expense Type" />
              </SelectTrigger>
              <SelectContent>
                {expenseTypes.map((type, index) => (
                  <SelectItem key={index} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input type="number" name="year" placeholder="Year" required />
            <Input type="number" name="month" placeholder="Month (1-12)" min="1" max="12" required />
            <Input type="number" name="amount" placeholder="Amount" step="0.01" required />
            <Button type="submit">Save Expense</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Revenue Modal */}
      <Dialog>
        <DialogTrigger asChild>
          <Button>Add Revenue</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Revenue</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={(e) => {
            e.preventDefault()
            const formData = new FormData(e.currentTarget)
            handleAddRevenue({
              year: Number(formData.get('year')),
              month: Number(formData.get('month')),
              type: formData.get('type') as string,
              amount: Number(formData.get('amount'))
            })
          }}>
            <Select name="type">
              <SelectTrigger>
                <SelectValue placeholder="Select Revenue Type" />
              </SelectTrigger>
              <SelectContent>
                {revenueTypes.map((type, index) => (
                  <SelectItem key={index} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input type="number" name="year" placeholder="Year" required />
            <Input type="number" name="month" placeholder="Month (1-12)" min="1" max="12" required />
            <Input type="number" name="amount" placeholder="Amount" step="0.01" required />
            <Button type="submit">Save Revenue</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Monthly Totals Table */}
      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Monthly Financial Summary</h2>
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Year-Month</th>
              <th className="border p-2">Total Expenses</th>
              <th className="border p-2">Total Revenues</th>
              <th className="border p-2">Net Profit</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(monthlyTotals).map(([key, total]) => (
              <tr key={key}>
                <td className="border p-2">{key}</td>
                <td className="border p-2">${total.expenses.toFixed(2)}</td>
                <td className="border p-2">${total.revenues.toFixed(2)}</td>
                <td className={`border p-2 ${
                  total.netProfit >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  ${total.netProfit.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Expenses List */}
      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Expenses</h2>
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Year</th>
              <th className="border p-2">Month</th>
              <th className="border p-2">Type</th>
              <th className="border p-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense, index) => (
              <tr key={index}>
                <td className="border p-2">{expense.year}</td>
                <td className="border p-2">{expense.month}</td>
                <td className="border p-2">{expense.type}</td>
                <td className="border p-2">${expense.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Revenues List */}
      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Revenues</h2>
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Year</th>
              <th className="border p-2">Month</th>
              <th className="border p-2">Type</th>
              <th className="border p-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {revenues.map((revenue, index) => (
              <tr key={index}>
                <td className="border p-2">{revenue.year}</td>
                <td className="border p-2">{revenue.month}</td>
                <td className="border p-2">{revenue.type}</td>
                <td className="border p-2">${revenue.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}
