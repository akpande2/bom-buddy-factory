import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, DollarSign, TrendingUp, AlertTriangle, Warehouse, Activity } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Badge } from "@/components/ui/badge";

const InventoryDashboard = () => {
  // KPI Stats
  const stats = [
    {
      title: "Total SKUs",
      value: "1,247",
      description: "Active inventory items",
      icon: Package,
      trend: "+12%",
      trendUp: true,
    },
    {
      title: "Total Stock Value",
      value: "₹45.2L",
      description: "Current inventory worth",
      icon: DollarSign,
      trend: "+8%",
      trendUp: true,
    },
    {
      title: "Fast Moving Items",
      value: "387",
      description: "High turnover rate",
      icon: TrendingUp,
      trend: "+15%",
      trendUp: true,
    },
    {
      title: "Items Below Reorder",
      value: "23",
      description: "Need replenishment",
      icon: AlertTriangle,
      trend: "-5%",
      trendUp: false,
    },
  ];

  // Stock by Warehouse - Donut Chart Data
  const warehouseStockData = [
    { name: "WH-001 (Main)", value: 12500, percentage: 35 },
    { name: "WH-002 (North)", value: 9500, percentage: 27 },
    { name: "WH-003 (South)", value: 7000, percentage: 20 },
    { name: "WH-004 (East)", value: 4500, percentage: 13 },
    { name: "WH-005 (West)", value: 1800, percentage: 5 },
  ];

  // Category-wise Stock Value - Bar Chart Data
  const categoryStockData = [
    { category: "Raw Materials", value: 18500, items: 456 },
    { category: "Finished Goods", value: 15200, items: 234 },
    { category: "Consumables", value: 7800, items: 312 },
    { category: "Assets", value: 3700, items: 245 },
  ];

  // Movement Analysis Data
  const movementData = [
    { name: "Fast Moving", count: 387, color: "bg-green-500" },
    { name: "Medium Moving", count: 562, color: "bg-blue-500" },
    { name: "Slow Moving", count: 298, color: "bg-yellow-500" },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border p-3 rounded-lg shadow-lg">
          <p className="font-semibold">{payload[0].name}</p>
          <p className="text-sm text-muted-foreground">
            Stock: {payload[0].value.toLocaleString()} units
          </p>
          <p className="text-sm text-primary font-medium">
            {payload[0].payload.percentage}%
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomBarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border p-3 rounded-lg shadow-lg">
          <p className="font-semibold">{payload[0].payload.category}</p>
          <p className="text-sm text-muted-foreground">
            Value: ₹{(payload[0].value / 1000).toFixed(1)}K
          </p>
          <p className="text-sm text-primary">
            Items: {payload[0].payload.items}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Inventory Dashboard</h1>
        <p className="text-muted-foreground mt-1">Real-time overview of inventory operations and analytics</p>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              <div className="flex items-center mt-2">
                <span className={`text-xs font-medium ${stat.trendUp ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.trend}
                </span>
                <span className="text-xs text-muted-foreground ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Stock by Warehouse - Donut Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Warehouse className="h-5 w-5 text-primary" />
              <CardTitle>Stock by Warehouse</CardTitle>
            </div>
            <CardDescription>Distribution of inventory across warehouses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={warehouseStockData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={2}
                  dataKey="value"
                  label={({ percentage }) => `${percentage}%`}
                >
                  {warehouseStockData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value) => <span className="text-sm">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category-wise Stock Value - Bar Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              <CardTitle>Stock Value by Category</CardTitle>
            </div>
            <CardDescription>Inventory value distribution across categories</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryStockData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="category" 
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  tickFormatter={(value) => value.split(' ')[0]}
                />
                <YAxis 
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  tickFormatter={(value) => `₹${value/1000}K`}
                />
                <Tooltip content={<CustomBarTooltip />} />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Movement Analysis & Low Stock Alerts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Item Movement Classification */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <CardTitle>Item Movement Analysis</CardTitle>
            </div>
            <CardDescription>Classification based on turnover rate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {movementData.map((item) => (
                <div key={item.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${item.color}`} />
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <span className="font-semibold">{item.count} items</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`${item.color} h-2 rounded-full`}
                      style={{ width: `${(item.count / 1247) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {((item.count / 1247) * 100).toFixed(1)}% of total inventory
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alerts */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <CardTitle>Critical Stock Alerts</CardTitle>
            </div>
            <CardDescription>Items requiring immediate attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: "Motor Assembly XL", sku: "MTR-001", current: 15, reorder: 50, warehouse: "WH-001" },
                { name: "Blade Set - 48 inch", sku: "BLD-048", current: 8, reorder: 25, warehouse: "WH-001" },
                { name: "Capacitor 2.5 μF", sku: "CAP-2.5", current: 22, reorder: 100, warehouse: "WH-002" },
                { name: "Copper Winding", sku: "COP-WND", current: 35, reorder: 150, warehouse: "WH-001" },
              ].map((item) => (
                <div key={item.sku} className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm">{item.name}</p>
                      <Badge variant="outline" className="text-xs">{item.sku}</Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>Reorder: {item.reorder}</span>
                      <span>•</span>
                      <span>{item.warehouse}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-red-600">{item.current}</p>
                    <p className="text-xs text-muted-foreground">units</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Row */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Stock Turnover</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2x</div>
            <p className="text-xs text-muted-foreground mt-1">Per year</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Stock Accuracy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">97.8%</div>
            <p className="text-xs text-muted-foreground mt-1">System vs physical</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Deadstock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground mt-1">No movement in 180 days</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InventoryDashboard;
