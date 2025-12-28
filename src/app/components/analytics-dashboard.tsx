import { ArrowLeft, Download, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { FinancialSummary } from '../utils/data-processor';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface AnalyticsDashboardProps {
  data: FinancialSummary;
  onBack: () => void;
}

const COLORS = ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5', '#f0fdfa'];

export function AnalyticsDashboard({ data, onBack }: AnalyticsDashboardProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl text-gray-900">
                Dashboard
              </h1>
              <p className="text-sm text-gray-600">Your 2024 Financial Analytics</p>
            </div>
          </div>
          <Button variant="outline" className="border-green-300 text-green-700">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6 border-green-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Total Transactions</p>
              <Wallet className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-3xl">{data.totalTransactions.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-1">{data.spendingPersonality}</p>
          </Card>

          <Card className="p-6 border-green-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Total Received</p>
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-3xl text-green-600">
              KES {(data.totalReceived / 1000).toFixed(0)}K
            </p>
            <p className="text-sm text-gray-500 mt-1">Income</p>
          </Card>

          <Card className="p-6 border-green-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Total Sent</p>
              <TrendingDown className="h-5 w-5 text-red-600" />
            </div>
            <p className="text-3xl text-red-600">
              KES {(data.totalSent / 1000).toFixed(0)}K
            </p>
            <p className="text-sm text-gray-500 mt-1">Expenses</p>
          </Card>

          <Card className="p-6 border-green-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Net Change</p>
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <p className={`text-3xl ${data.netChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.netChange >= 0 ? '+' : ''}KES {(Math.abs(data.netChange) / 1000).toFixed(0)}K
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {data.netChange >= 0 ? 'Saved' : 'Deficit'}
            </p>
          </Card>
        </div>

        {/* Charts */}
        <Tabs defaultValue="trends" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="recipients">Recipients</TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl mb-6">Monthly Income vs Expenses</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => `KES ${(value / 1000).toFixed(1)}K`}
                  />
                  <Legend />
                  <Bar dataKey="income" fill="#10b981" name="Income" />
                  <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl mb-6">Spending Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => `KES ${(value / 1000).toFixed(1)}K`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="expenses"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Expenses"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-xl mb-6">Category Distribution</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={data.categoryBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name} ${percentage}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {data.categoryBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => `KES ${(value / 1000).toFixed(1)}K`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl mb-6">Top Spending Categories</h3>
                <div className="space-y-4">
                  {data.categoryBreakdown.map((category, index) => (
                    <div key={category.name} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{category.name}</span>
                        <span>KES {(category.value / 1000).toFixed(1)}K ({category.percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full transition-all"
                          style={{ width: `${category.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="recipients" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl mb-6">Top Recipients</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data.topRecipients} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={150} />
                  <Tooltip
                    formatter={(value: number) => `KES ${(value / 1000).toFixed(1)}K`}
                  />
                  <Bar dataKey="amount" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl mb-6">Recipient Details</h3>
              <div className="space-y-3">
                {data.topRecipients.map((recipient, index) => (
                  <div
                    key={recipient.name}
                    className="flex items-center justify-between p-4 bg-green-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white">
                        {index + 1}
                      </div>
                      <div>
                        <p>{recipient.name}</p>
                        <p className="text-sm text-gray-600">{recipient.count} transactions</p>
                      </div>
                    </div>
                    <p className="text-lg">KES {(recipient.amount / 1000).toFixed(1)}K</p>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
