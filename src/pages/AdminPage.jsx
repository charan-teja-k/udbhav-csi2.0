
import { useEffect, useState } from "react"
import axios from "axios"
import calculateTotalAmount from "../utils/totalAmount"
export default function AdminPage() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

 

  const fetchTeams = async () => {
    try {
      setLoading(true)
      const res = await axios.get("https://hackthon-backend-1-d2zj.onrender.com/admin/teams")
      setData(res.data)
    } catch (error) {
      console.error("Failed to fetch teams:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTeams()
  }, [])

  const verifyTeam = async (teamcode) => {
    await axios.post("http://localhost:6961/admin/verify", {teamcode} )
    fetchTeams()
  }

  const markFraud = async (teamcode) => {
    await axios.post("http://localhost:6961/admin/fraud", { teamcode })
    fetchTeams()
  }

  const pendingTeams = data.filter((team) => team.paymentStatus === "DONE")
  const verifiedTeams = data.filter((team) => team.paymentStatus === "VERIFIED")

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Admin – Payment Verification</h1>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
          </div>
        ) : (
          <>
            <section className="mb-12">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">Pending Verification</h2>
                <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800">
                  {pendingTeams.length} pending
                </span>
              </div>

              <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-max text-left text-sm">
                    <thead className="bg-gray-50 text-xs font-medium uppercase tracking-wider text-gray-700">
                      <tr>
                        <th className="px-4 py-3">Team Name</th>
                        <th className="px-4 py-3">Team Code</th>
                        <th className="px-4 py-3">Lead Mobile</th>
                        <th className="px-4 py-3 text-center">Members</th>
                        <th className="px-4 py-3">Transaction ID</th>
                        <th className="px-4 py-3 text-right">Amount</th>
                        <th className="px-4 py-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {pendingTeams.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                            No pending verifications
                          </td>
                        </tr>
                      ) : (
                        pendingTeams.map((team) => (
                          <tr key={team.teamcode} className="transition-colors hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-900">{team.teamName}</td>
                            <td className="px-4 py-3 font-mono text-xs text-gray-600">{team.teamcode}</td>
                            <td className="px-4 py-3 text-gray-600">{team.teamLead.mobile}</td>
                            <td className="px-4 py-3 text-center text-gray-600">{1 + team.teamMembers.length}</td>
                            <td className="px-4 py-3 font-mono text-xs text-gray-600">{team.transactionId}</td>
                            <td className="px-4 py-3 text-right font-semibold text-gray-900">
                              ₹{calculateTotalAmount(team)}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => verifyTeam(team.teamcode)}
                                  className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                >
                                  Verify
                                </button>
                                <button
                                  onClick={() => markFraud(team.teamcode)}
                                  className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                >
                                  Fraud
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">Verified Teams</h2>
                <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                  {verifiedTeams.length} verified
                </span>
              </div>

              <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-max text-left text-sm">
                    <thead className="bg-gray-50 text-xs font-medium uppercase tracking-wider text-gray-700">
                      <tr>
                        <th className="px-4 py-3">Team Name</th>
                        <th className="px-4 py-3">Team Code</th>
                        <th className="px-4 py-3">Lead Mobile</th>
                        <th className="px-4 py-3 text-center">Members</th>
                        <th className="px-4 py-3">Transaction ID</th>
                        <th className="px-4 py-3 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {verifiedTeams.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                            No verified teams yet
                          </td>
                        </tr>
                      ) : (
                        verifiedTeams.map((team) => (
                          <tr key={team.teamcode} className="transition-colors hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-900">{team.teamName}</td>
                            <td className="px-4 py-3 font-mono text-xs text-gray-600">{team.teamcode}</td>
                            <td className="px-4 py-3 text-gray-600">{team.teamLead.mobile}</td>
                            <td className="px-4 py-3 text-center text-gray-600">{1 + team.teamMembers.length}</td>
                            <td className="px-4 py-3 font-mono text-xs text-gray-600">{team.transactionId}</td>
                            <td className="px-4 py-3 text-right font-semibold text-gray-900">
                              ₹{calculateTotalAmount(team)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  )
}
