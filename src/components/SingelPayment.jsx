import React, { useEffect, useState } from "react";
import { User, CreditCard, CheckCircle, IndianRupee, ArrowLeft } from "lucide-react";
import axios from "axios";

export default function SingelPaymentSummary({ formData, goback }) {
  if (!formData) return null;
  
  const [loading, setLoading] = useState(false);

  const REGISTRATION_PRICE = 800;
  const totalAmount = REGISTRATION_PRICE;

  const handlePayment = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const res = await axios.post(
        "https://hackthon-backend-1-d2zj.onrender.com/single/reg",
        formData
      );
      console.log(formData)
      if (res.status === 200 || res.status === 201) {
        const url = `single/payment?name=${encodeURIComponent(
          formData.name
        )}&amount=${totalAmount}`;

        window.open(url, "_blank");
      }

      
    } catch (errors) {
      console.error(errors.response);
      const data = errors?.response?.data;

      alert(
        Array.isArray(data?.errors)
          ? data.errors.join(", ")
          : typeof data?.message === "string"
          ? data.message
          : typeof data?.msg === "string"
          ? data.msg
          : "Registration failed. Check all fields once."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="max-w-5xl mx-auto">
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl p-4 md:p-6 lg:p-8">
          <div className="mb-6 md:mb-8">
            <div className="flex items-center gap-3 mb-2">
              <button
                onClick={() => goback()}
                className="p-2 rounded-lg hover:bg-gray-100 transition"
                aria-label="Go back"
              >
                <ArrowLeft className="w-6 h-6 text-[#0f2027]" />
              </button>

              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#0f2027] via-[#1d2a38] to-[#203a43] bg-clip-text text-transparent">
                Payment Summary
              </h1>
            </div>

            <p className="text-gray-600">
              Review your registration details and proceed to payment
            </p>
          </div>

          <div className="space-y-6">
            {/* Participant Details */}
            <div className="bg-white rounded-xl shadow-md p-4 md:p-6 border-l-4 border-[#1d2a38]">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="text-amber-600" size={24} />
                <h2 className="text-xl font-bold text-amber-600">
                  Participant Details
                </h2>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="space-y-1">
                    <p className="font-semibold text-lg">
                      {formData.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {formData.department} - {formData.year}
                    </p>
                    <p className="text-sm text-gray-600">
                      {formData.email}
                    </p>
                    <p className="text-sm text-gray-600">
                      {formData.mobile}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 text-2xl font-bold text-[#0f2027]">
                    <IndianRupee size={20} />
                    <span>{REGISTRATION_PRICE}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Registration Number</p>
                    <p className="font-semibold">{formData.regnum}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Gender</p>
                    <p className="font-semibold">{formData.gender}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">T-Shirt Size</p>
                    <p className="font-semibold">{formData.tshirtSize}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">College</p>
                    <p className="font-semibold">
                      {formData.collegeType === 'srkr' ? 'SRKR College' : formData.otherCollege}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Total */}
            <div className="rounded-xl shadow-xl p-6 md:p-8 border-2 border-amber-500 bg-gradient-to-br from-[#0f2027] via-[#1d2a38] to-[#203a43]">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                  <p className="text-white/80">Total Amount to Pay</p>
                  <div className="flex items-center gap-2 text-4xl font-bold text-white">
                    <IndianRupee size={32} />
                    <span>{totalAmount}</span>
                  </div>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className={`flex items-center gap-3 px-8 py-4 text-white font-bold text-lg rounded-xl shadow-lg transition
                    ${loading
                      ? "bg-orange-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-orange-500 to-orange-600 hover:scale-105"
                    }`}
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        />
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard size={24} />
                      Proceed to Payment
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
              <p className="text-sm text-yellow-700">
                <strong>Note:</strong> Registration fees are non-refundable.
                Please verify details before proceeding.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}