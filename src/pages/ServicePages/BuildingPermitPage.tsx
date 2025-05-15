
import React from "react";
import Layout from "@/components/Layout";
import BuildingPermitForm from "@/components/ServiceForms/BuildingPermitForm";

export default function BuildingPermitPage() {
  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <BuildingPermitForm />
      </div>
    </Layout>
  );
}
