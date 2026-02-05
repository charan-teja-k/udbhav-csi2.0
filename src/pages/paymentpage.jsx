import React from "react";
import { useNavigate } from "react-router-dom";
import QrPayment from "../components/QrPaymet";
export default function PaymentPage() {

  const totalAmount = JSON.parse(
    localStorage.getItem("totalAmount")
  ) || 0;
  return (
    <div className="min-h-screen bg-gray-50">
      <QrPayment/>
    </div>
  );
}
