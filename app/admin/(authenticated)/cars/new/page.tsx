import React from "react";
import { redirect } from "next/navigation";
import { getStaffSession } from "@/lib/auth/guards";
import { VehicleForm } from "@/components/admin/VehicleForm";

export const revalidate = 0;

export default function NewCarPage() {
  const session = getStaffSession();
  if (!session) {
    redirect("/admin/login");
  }

  return <VehicleForm />;
}
