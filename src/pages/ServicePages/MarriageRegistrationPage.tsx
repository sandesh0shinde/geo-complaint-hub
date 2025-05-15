
import React from "react";
import Layout from "@/components/Layout";
import MarriageRegistrationForm from "@/components/ServiceForms/MarriageRegistrationForm";

export default function MarriageRegistrationPage() {
  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <MarriageRegistrationForm />
      </div>
    </Layout>
  );
}
