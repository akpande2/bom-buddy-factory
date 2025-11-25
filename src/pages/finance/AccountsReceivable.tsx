import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";

const AccountsReceivable = () => {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Accounts Receivable</h1>
          <p className="text-muted-foreground mt-1">Track customer payments and outstanding invoices</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Record Receipt
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search receivables..." className="pl-10" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Accounts receivable features coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountsReceivable;
