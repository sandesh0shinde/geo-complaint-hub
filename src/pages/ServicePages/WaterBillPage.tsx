
import React from "react";
import Layout from "@/components/Layout";
import WaterBillForm from "@/components/ServiceForms/WaterBillForm";

export default function WaterBillPage() {
  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <WaterBillForm />
      </div>
    </Layout>
  );
}
