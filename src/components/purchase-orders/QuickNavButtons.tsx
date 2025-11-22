import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FileText, FileCheck, Mail, Package, Truck } from "lucide-react";

export const QuickNavButtons = () => {
  const navigate = useNavigate();

  return (
    <div className="flex gap-2 flex-wrap">
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate("/ops-form")}
        className="gap-1.5"
      >
        <FileText className="h-3.5 w-3.5" />
        Create OPS
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate("/pr-form")}
        className="gap-1.5"
      >
        <FileCheck className="h-3.5 w-3.5" />
        Create PR
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate("/loi-form")}
        className="gap-1.5"
      >
        <Mail className="h-3.5 w-3.5" />
        Create LOI
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate("/po-form")}
        className="gap-1.5"
      >
        <Package className="h-3.5 w-3.5" />
        Create PO
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate("/grn-form")}
        className="gap-1.5"
      >
        <Truck className="h-3.5 w-3.5" />
        Create GRN
      </Button>
    </div>
  );
};
