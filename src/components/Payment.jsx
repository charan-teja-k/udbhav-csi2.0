import React, { useState } from "react";
import { Users, CreditCard, CheckCircle, IndianRupee, ArrowLeft } from "lucide-react";
import axios from "axios"
export default function PaymentSummary({ formData ,goback}) {
  const [loading, setLoading] = useState(false);

  if (!formData) return null;

  const TEAM_LEAD_CSI_PRICE = 800;
  const TEAM_LEAD_NON_CSI_PRICE = 800;

  const teamLeadAmount = formData.teamLead.isCsi
    ? TEAM_LEAD_CSI_PRICE
    : TEAM_LEAD_NON_CSI_PRICE;

  const teamMembersWithAmount = formData.teamMembers.map((member) => ({
    ...member,
    amount: member.isCsi ? TEAM_LEAD_CSI_PRICE : TEAM_LEAD_NON_CSI_PRICE,
  }));

  const totalAmount =
    teamLeadAmount +
    teamMembersWithAmount.reduce((sum, m) => sum + m.amount, 0);

  const totalMembers = 1 + teamMembersWithAmount.length;
const handlePayment = async () => {
  if (loading) return; // prevent double click

  setLoading(true);

  try {
    const res = await axios.post(
      "https://hackthon-backend-1-d2zj.onrender.com/reg",
      formData
    );

    if (res.status === 200 || res.status === 201) {
      const url = `/payment?name=${encodeURIComponent(
        formData.teamName
      )}&amount=${totalAmount}`;

      window.open(url, "_blank");
    }

  } catch (error) {
    console.error(error.response)
    const data = error?.response?.data;

alert(
  Array.isArray(data?.errors)
    ? data.errors.join(", ")
    : typeof data?.message === "string"
    ? data.message
    : typeof data?.msg === "string"
    ? data.msg
    : "Registration failed Check All Fields Once "
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
    Review your team registration details and proceed to payment
  </p>
</div>


          <div className="space-y-6">
            {/* Team Details */}
            <div className="bg-white rounded-xl shadow-md p-4 md:p-6 border-l-4 border-[#0f2027]">
              <div className="flex items-center gap-3 mb-4">
                <Users className="text-amber-600" size={24} />
                <h2 className="text-xl font-bold text-amber-600">
                  Team Details
                </h2>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Team Name:</span>
                  <span className="font-semibold">
                    {formData.teamName}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">
                    Total Members:
                  </span>
                  <span className="font-semibold">
                    {totalMembers} (including Team Lead)
                  </span>
                </div>
              </div>
            </div>

            {/* Team Lead */}
            <div className="bg-white rounded-xl shadow-md p-4 md:p-6 border-l-4 border-[#1d2a38]">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="text-amber-600" size={24} />
                <h2 className="text-xl font-bold text-amber-600">
                  Team Lead
                </h2>
              </div>

              <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div>
                  <p className="font-semibold">
                    {formData.teamLead.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {formData.teamLead.isCsi ? "CSI Member" : "Non-CSI Member"}
                  </p>
                </div>

                <div className="flex items-center gap-1 text-2xl font-bold text-[#0f2027]">
                  <IndianRupee size={20} />
                  <span>{teamLeadAmount}</span>
                </div>
              </div>
            </div>

            
            {teamMembersWithAmount.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-4 md:p-6 border-l-4 border-[#203a43]">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="text-amber-600" size={24} />
                  <h2 className="text-xl font-bold text-amber-600">
                    Team Members
                  </h2>
                </div>

                <div className="space-y-3">
                  {teamMembersWithAmount.map((member, index) => (
                    <div
                      key={member.id}
                      className="flex justify-between items-center p-4 bg-purple-50 rounded-lg border border-purple-200"
                    >
                      <div>
                        <p className="font-semibold">
                          {index + 1}. {member.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {member.isCsi ? "CSI Member" : "Non-CSI Member"}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 text-xl font-bold text-[#1d2a38]">
                        <IndianRupee size={18} />
                        <span>{member.amount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
