'use client';

import { useState, useEffect } from 'react';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June', 
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function DashboardPage() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [projections, setProjections] = useState<{
    month: string;
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;
  }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFinancialProjections();
  }, [selectedYear]);

  const fetchFinancialProjections = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/projections?year=${selectedYear}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch projections');
      }

      const data = await response.json();
      
      // Create projections for all months, filling in with zeros if no data
      const monthlyProjections = MONTHS.map((month, index) => {
        const monthData = data.find((item: any) => item.month === index + 1);
        return {
          month,
          totalRevenue: monthData ? monthData.totalRevenue : 0,
          totalExpenses: monthData ? monthData.totalExpenses : 0,
          netProfit: monthData ? monthData.netProfit : 0
        };
      });

      setProjections(monthlyProjections);
      setLoading(false);
    } catch (err) {
      setError('Unable to load financial projections');
      setLoading(false);
    }
  };

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Financial Projections</h1>
      
      <div className="mb-6">
        <label htmlFor="year-select" className="block text-sm font-medium text-gray-700">
          Select Year
        </label>
        <select
          id="year-select"
          value={selectedYear}
          onChange={(e) => handleYearChange(Number(e.target.value))}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          {[selectedYear - 1, selectedYear, selectedYear + 1].map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Month
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Expenses
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Net Profit
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {projections.map((projection) => (
                <tr key={projection.month}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {projection.month}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-green-600">
                    ${projection.totalRevenue.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-red-600">
                    ${projection.totalExpenses.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ${projection.netProfit.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
