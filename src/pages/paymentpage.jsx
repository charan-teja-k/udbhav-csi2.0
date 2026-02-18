import React from "react";
import { useNavigate } from "react-router-dom";
import QrPayment from "../components/QrPaymet";
export default function PaymentPage() {

 
  return (
    <div className="min-h-screen bg-gray-50">
      <QrPayment/>
    </div>
  );
}
