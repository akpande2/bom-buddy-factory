import BillOfMaterials from "@/components/BillOfMaterials";

const BOM = () => {
  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Bill of Materials</h1>
        <p className="text-muted-foreground mt-1">Complete list of materials and components</p>
      </div>
      <BillOfMaterials />
    </div>
  );
};

export default BOM;
