import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const vendors = [
  { name: "Bajaj", value: 85, color: "bg-blue-500" },
  { name: "Maharaja", value: 70, color: "bg-purple-500" },
  { name: "Crompton", value: 75, color: "bg-green-500" },
];

export const VendorComparisonCharts = () => {
  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Vendor Comparison Analysis</CardTitle>
          <Badge variant="outline" className="text-xs">CS-2024-001</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-6">
          {/* Bar Chart Placeholder */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">Price Comparison</h4>
            <div className="space-y-3 bg-muted/30 rounded-lg p-4">
              {vendors.map((vendor) => (
                <div key={vendor.name} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{vendor.name}</span>
                    <span className="font-semibold text-foreground">₹{vendor.value}K</span>
                  </div>
                  <div className="h-6 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${vendor.color} transition-all duration-500`}
                      style={{ width: `${vendor.value}%` }}
                    />
                  </div>
                </div>
              ))}
              <div className="pt-2 border-t border-border mt-4">
                <p className="text-xs text-muted-foreground text-center">
                  Lower is better
                </p>
              </div>
            </div>
          </div>

          {/* Radar Chart Placeholder */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">Overall Score</h4>
            <div className="bg-muted/30 rounded-lg p-4 flex items-center justify-center">
              <div className="relative w-40 h-40">
                {/* Radar Chart Background */}
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {/* Background circles */}
                  <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-border" />
                  <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-border" />
                  <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-border" />
                  <circle cx="50" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-border" />
                  
                  {/* Axis lines */}
                  <line x1="50" y1="50" x2="50" y2="10" stroke="currentColor" strokeWidth="0.5" className="text-border" />
                  <line x1="50" y1="50" x2="85" y2="25" stroke="currentColor" strokeWidth="0.5" className="text-border" />
                  <line x1="50" y1="50" x2="85" y2="75" stroke="currentColor" strokeWidth="0.5" className="text-border" />
                  <line x1="50" y1="50" x2="50" y2="90" stroke="currentColor" strokeWidth="0.5" className="text-border" />
                  <line x1="50" y1="50" x2="15" y2="75" stroke="currentColor" strokeWidth="0.5" className="text-border" />
                  <line x1="50" y1="50" x2="15" y2="25" stroke="currentColor" strokeWidth="0.5" className="text-border" />
                  
                  {/* Data polygon - Bajaj (winner) */}
                  <polygon
                    points="50,15 75,28 78,70 50,80 22,70 25,28"
                    fill="rgb(59 130 246 / 0.3)"
                    stroke="rgb(59 130 246)"
                    strokeWidth="2"
                  />
                  
                  {/* Center point */}
                  <circle cx="50" cy="50" r="2" fill="currentColor" className="text-primary" />
                </svg>
                
                {/* Labels */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">85</div>
                    <div className="text-xs text-muted-foreground">Score</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-1.5 pt-2">
              {vendors.map((vendor) => (
                <div key={vendor.name} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${vendor.color}`} />
                  <span className="text-xs text-muted-foreground">{vendor.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
