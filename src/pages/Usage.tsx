import MaterialUsage from "@/components/MaterialUsage";

const Usage = () => {
  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Material Usage</h1>
        <p className="text-muted-foreground mt-1">Track and record material consumption</p>
      </div>
      <MaterialUsage />
    </div>
  );
};

export default Usage;
