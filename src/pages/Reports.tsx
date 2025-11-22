import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const Reports = () => {
  const reports = [
    { name: "Inventory Summary", description: "Complete overview of current inventory", date: "2024-01-15" },
    { name: "Material Usage Report", description: "Monthly material consumption analysis", date: "2024-01-14" },
    { name: "Stock Valuation", description: "Total inventory valuation report", date: "2024-01-13" },
    { name: "Purchase Analysis", description: "Purchasing trends and insights", date: "2024-01-12" },
  ];

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Reports</h1>
        <p className="text-muted-foreground mt-1">Generate and download inventory reports</p>
      </div>

      <div className="grid gap-4">
        {reports.map((report) => (
          <Card key={report.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div className="flex items-center gap-4">
                <FileText className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle>{report.name}</CardTitle>
                  <CardDescription>{report.description}</CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">{report.date}</span>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Reports;
