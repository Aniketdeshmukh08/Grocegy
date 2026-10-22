import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  LineChart, Line, 
  BarChart, Bar, 
  XAxis, YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Interfaces
interface SalesMetrics {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  topProducts: { name: string; sales: number }[];
  topCategories: { name: string; sales: number }[];
}

interface ChartDataPoint {
  name: string;
  revenue: number;
  orders: number;
}

interface SalesData {
  summary: SalesMetrics;
  chartData: ChartDataPoint[];
}

const SalesStatisticsPage = () => {
  const [salesData, setSalesData] = useState<SalesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom'>('weekly');
  const [startDate, setStartDate] = useState<Date>(() => {
    const date = new Date();
    date.setDate(date.getDate() - 6); // Default to last 7 days (including today)
    return date;
  });
  const [endDate, setEndDate] = useState<Date>(new Date());

  
  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  
  const fetchSalesData = async () => {
    setLoading(true);
    setError(null);

    try {
      const body = {
        period: selectedPeriod,
        from: formatDate(startDate),
        to: formatDate(endDate)
      };

     const response = await axios.post(
  `${process.env.REACT_APP_API_URL}orderdetails/salesStatistics`,
  body
);

const data = response.data;
      console.log('API Response:', data); 

      const transformedData: SalesData = {
        summary: {
          totalRevenue: data.summary?.totalRevenue || 0,
          totalOrders: data.summary?.totalOrders || 0,
          averageOrderValue: data.summary?.averageOrderValue || 0,
          topProducts: data.summary?.topProducts || [],
          topCategories: data.summary?.topCategories || []
        },
        chartData: data.chartData?.map((item: any) => ({
          name: item.name,
          revenue: item.revenue || 0,
          orders: item.orders || 0
        })) || []
      };

      setSalesData(transformedData);
    } catch (err) {
      console.error("Error fetching sales data:", err);
      setError("Failed to load sales data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    const today = new Date();
    let newStartDate = startDate;
    let newEndDate = endDate;

    switch (selectedPeriod) {
      case 'daily':
        newStartDate = today;
        newEndDate = today;
        break;
      case 'weekly':
        newStartDate = new Date(today);
        newStartDate.setDate(today.getDate() - today.getDay());  
        newEndDate = today;
        break;
      case 'monthly':
        newStartDate = new Date(today.getFullYear(), today.getMonth(), 1);
        newEndDate = today;
        break;
      case 'yearly':
        newStartDate = new Date(today.getFullYear(), 0, 1);
        newEndDate = today;
        break;
      case 'custom':
        
        if (!startDate || !endDate) {
          newStartDate = new Date();
          newStartDate.setDate(newStartDate.getDate() - 7);
          newEndDate = new Date();
        }
        break;
    }

    
    if (newStartDate.getTime() !== startDate.getTime() || newEndDate.getTime() !== endDate.getTime()) {
      setStartDate(newStartDate);
      setEndDate(newEndDate);
    }
  }, [selectedPeriod]);

  useEffect(() => {
    fetchSalesData();
  }, [selectedPeriod, startDate, endDate]);

  const handlePeriodChange = (period: typeof selectedPeriod) => {
  setLoading(true); 
  setError(null);  
  setSelectedPeriod(period); 
};


  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-xl p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Sales Statistics
        </h1>

        
<div className="mb-4">
  <h5 className="text-success fw-bold mb-3">Select Period</h5>
  <div className="d-flex flex-wrap gap-2">
    <button
      onClick={() => handlePeriodChange('daily')}
      className={`btn ${
        selectedPeriod === 'daily' ? 'btn-success text-white' : 'btn-outline-success'
      }`}
    >
      Daily
    </button>
    <button
      onClick={() => handlePeriodChange('weekly')}
      className={`btn ${
        selectedPeriod === 'weekly' ? 'btn-success text-white' : 'btn-outline-success'
      }`}
    >
      Weekly
    </button>
    <button
      onClick={() => handlePeriodChange('monthly')}
      className={`btn ${
        selectedPeriod === 'monthly' ? 'btn-success text-white' : 'btn-outline-success'
      }`}
    >
      Monthly
    </button>
    <button
      onClick={() => handlePeriodChange('yearly')}
      className={`btn ${
        selectedPeriod === 'yearly' ? 'btn-success text-white' : 'btn-outline-success'
      }`}
    >
      Yearly
    </button>
    <button
      onClick={() => handlePeriodChange('custom')}
      className={`btn ${
        selectedPeriod === 'custom' ? 'btn-success text-white' : 'btn-outline-success'
      }`}
    >
      Custom Range
    </button>
  </div>



{selectedPeriod === 'custom' && (
  <div className="d-flex flex-column gap-3 mt-3">
    <div>
      <label htmlFor="startDate" className="form-label">
        Start Date:
      </label>
      <DatePicker
        id="startDate"
        selected={startDate}
        onChange={(date) => date && setStartDate(date)}
        selectsStart
        startDate={startDate}
        endDate={endDate}
        maxDate={endDate}
        className="form-control border-0 shadow-none"
      />
    </div>
    <div>
      <label htmlFor="endDate" className="form-label">
        End Date:
      </label>
      <DatePicker
        id="endDate"
        selected={endDate}
        onChange={(date) => date && setEndDate(date)}
        selectsEnd
        startDate={startDate}
        endDate={endDate}
        minDate={startDate}
        maxDate={new Date()}
        className="form-control border-0 shadow-none"
      />
    </div>
  </div>
)}

        </div>

      
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-4 p-4 bg-yellow-50 rounded-lg text-sm">
            <p>Current Period: {selectedPeriod}</p>
            <p>Date Range: {formatDate(startDate)} to {formatDate(endDate)}</p>
            <p>Loading: {loading ? 'Yes' : 'No'}</p>
          </div>
        )}

        
        {loading ? (
  <div className="text-center py-10">
    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
    <p className="text-lg text-gray-700 mt-3">
      Loading {selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)} data...
    </p>
  </div>
) : error ? (
          <div className="text-center py-10">
            <p className="text-lg text-red-600">{error}</p>
            <button 
              onClick={fetchSalesData}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        ) : salesData ? (
          <>
            
<div className="row mb-4">
  <div className="col-md-4 mb-3 mb-md-0">
    <div className="card text-white bg-success h-100 shadow">
      <div className="card-body text-center">
        <h5 className="card-title">Total Revenue</h5>
        <p className="card-text display-6 text-white">₹{salesData.summary.totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
      </div>
    </div>
  </div>
  <div className="col-md-4 mb-3 mb-md-0">
    <div className="card text-white bg-success h-100 shadow">
      <div className="card-body text-center">
        <h5 className="card-title">Total Orders</h5>
        <p className="card-text display-6 text-white">{salesData.summary.totalOrders.toLocaleString()}</p>
      </div>
    </div>
  </div>
  <div className="col-md-4">
    <div className="card text-white bg-success h-100 shadow">
      <div className="card-body text-center">
        <h5 className="card-title">Avg. Order Value</h5>
        <p className="card-text display-6 text-white">₹{salesData.summary.averageOrderValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
      </div>
    </div>
  </div>
</div>

           
            <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Sales Trend ({selectedPeriod})
              </h2>
              {salesData.chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart
                    data={salesData.chartData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="name" stroke="#555" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip
                      formatter={(value: number, name: string) => {
                        if (name === 'revenue') return [`₹${value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`, 'Revenue'];
                        if (name === 'orders') return [value, 'Orders'];
                        return value;
                      }}
                    />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="revenue"
                      stroke="#ad1616ff"
                      activeDot={{ r: 8 }}
                      name="Revenue (₹)"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="orders"
                      stroke="#1cc88a"
                      name="Orders"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-gray-600 py-4">No chart data available for this period.</p>
              )}
            </div>

           
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Products */}
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Top Products
                </h2>
                {salesData.summary.topProducts.length > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={salesData.summary.topProducts}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Sales']}
                        />
                        <Legend />
                        <Bar dataKey="sales" name="Sales (₹)" fill="#36b9cc" />
                      </BarChart>
                    </ResponsiveContainer>
                    <div className="mt-4">
                      <ul className="divide-y divide-gray-200">
                        {salesData.summary.topProducts.map((product, index) => (
                          <li key={product.name} className="py-2">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{index + 1}. {product.name}</span>
                              <span className="text-blue-600">₹{product.sales.toLocaleString('en-IN')}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                ) : (
                  <p className="text-center text-gray-600 py-4">No product data available.</p>
                )}
              </div>

            
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Top Categories
                </h2>
                {salesData.summary.topCategories.length > 0 ? (
                  <>
                    <div className="space-y-4">
                      {salesData.summary.topCategories.map((category, index) => {
                        const percentage = salesData.summary.totalRevenue > 0 
                          ? (category.sales / salesData.summary.totalRevenue * 100).toFixed(1)
                          : 0;
                        return (
                          <div key={category.name} className="mb-3">
                            <div className="flex justify-between mb-1">
                              <span className="font-medium">{index + 1}. {category.name}</span>
                              <span className="text-blue-600">₹{category.sales.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div 
                                className="bg-green-600 h-2.5 rounded-full" 
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <div className="text-right text-sm text-gray-500 mt-1">
                              {percentage}% of total revenue
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <p className="text-center text-gray-600 py-4">No category data available.</p>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-10">
            <p className="text-lg text-gray-700">No sales data available for the selected period.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesStatisticsPage;