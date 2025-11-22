import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Suppliers = () => {
  const suppliers = [
    { name: "Bajaj", contact: "+91 9876543210", email: "bajaj@example.com", items: 15 },
    { name: "Maharaja", contact: "+91 9876543211", email: "maharaja@example.com", items: 12 },
    { name: "Local Supplier", contact: "+91 9876543212", email: "local@example.com", items: 8 },
  ];

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Suppliers</h1>
        <p className="text-muted-foreground mt-1">Manage your supplier relationships</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {suppliers.map((supplier) => (
          <Card key={supplier.name}>
            <CardHeader>
              <CardTitle>{supplier.name}</CardTitle>
              <CardDescription>{supplier.items} items supplied</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">
                  <span className="font-medium">Phone:</span> {supplier.contact}
                </p>
                <p className="text-muted-foreground">
                  <span className="font-medium">Email:</span> {supplier.email}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Suppliers;
