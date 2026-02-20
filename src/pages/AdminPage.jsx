import { useEffect, useState } from "react"
import axios from "axios"
import calculateTotalAmount from "../utils/totalAmount"
import { Button } from "@/components/ui/button";
import { motion, stagger, useAnimate, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
export default function AdminPage() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [singeldata, setsingelData] = useState([])
  const navigate=useNavigate()
  const fetchTeams = async (adminCode) => {
    try {
      setLoading(true)
      const res = await axios.get(`https://hackthon-backend-1-d2zj.onrender.com/admin/teams?adminCode=${adminCode}`)
      
      setData(res.data)
    } catch (error) {
      console.error("Failed to fetch teams:", error)
    } finally {
      setLoading(false)
    }
  }
  const fetchSingels = async (adminCode) => {
    try {
      setLoading(true)
      const res = await axios.get(`https://hackthon-backend-1-d2zj.onrender.com/admin/singels?adminCode=${adminCode}`)
      setsingelData(res.data)
    } catch (error) {
      console.error("Failed to fetch teams:", error)
    } finally {
      setLoading(false)
    }
  }
 useEffect(() => {
    let adminCode = sessionStorage.getItem("adminCode");
    if (!adminCode) {
      adminCode = window.prompt("Enter Admin Code:");

      if (!adminCode) {
        alert("Admin code is required!");
        return;
      }
      sessionStorage.setItem("adminCode", adminCode);
    }
    fetchTeams(adminCode);
    fetchSingels(adminCode);
  }, []);
  
  const verifyTeam = async (teamName) => {
    let adminCode = sessionStorage.getItem("adminCode");
    await axios.post(`https://hackthon-backend-1-d2zj.onrender.com/payment/paid?adminCode=${adminCode}`, {teamName} )
    fetchTeams(adminCode)
    fetchSingels(adminCode)
  }
  const markFraud = async (teamName) => {
    let adminCode = sessionStorage.getItem("adminCode");
    await axios.post(`https://hackthon-backend-1-d2zj.onrender.com/payment/failed?adminCode=${adminCode}`, { teamName })
    fetchTeams(adminCode)
    fetchSingels(adminCode)
  }
    const verifysingel = async (name,_id) => {
    let adminCode = sessionStorage.getItem("adminCode");
    await axios.post(`https://hackthon-backend-1-d2zj.onrender.com/admin/payment/paid?adminCode=${adminCode}`, {name,_id,} )
    fetchTeams(adminCode)
    fetchSingels(adminCode)
  }
  const marksingelFraud = async (name,_id) => {
    let adminCode = sessionStorage.getItem("adminCode");
    await axios.post(`https://hackthon-backend-1-d2zj.onrender.com/admin/payment/failed?adminCode=${adminCode}`, { name, _id })
    fetchTeams(adminCode)
    fetchSingels(adminCode)
  }
const deletePenindgsingel = async (_id) => {
    let adminCode = sessionStorage.getItem("adminCode");
    await axios.delete(`https://hackthon-backend-1-d2zj.onrender.com/admin/deletePending/singel?_id=${_id}&adminCode=${adminCode}`)
    fetchTeams(adminCode)
    fetchSingels(adminCode)
  }
 const deletePenindgteam = async (_id) => {
    let adminCode = sessionStorage.getItem("adminCode");
    await axios.delete(`https://hackthon-backend-1-d2zj.onrender.com/admin/deletePending/team?_id=${_id}&adminCode=${adminCode}`)
    fetchTeams(adminCode)
    fetchSingels(adminCode)
  }

  let pendingTeams = data.filter((team) => team.paymentStatus === "DONE")
  let verifiedTeams = data.filter((team) => team.paymentStatus === "PAID")
  let failedteams = data.filter((team) => team.paymentStatus === "FAILED")
  let Pendingteams = data.filter((team) => team.paymentStatus === "PENDING")

const parsedSingles = singeldata.map(member => ({
  _id:member._id,
    teamcode: `SINGLE-${member.mobile}`,
  teamName: member.name,
  teamLead: {
    name: member.name,
    mobile: member.mobile
  },
  teamMembers: [],
  transactionId: member.transactionId,
  paymentStatus: member.paymentStatus,
  amount: member.price,
  createdAt:member.updatedAt,
  isSingle: true
}));
pendingTeams=[...pendingTeams,...parsedSingles.filter((data)=>data.paymentStatus==="DONE")]
const verifiedSinglesOnly = parsedSingles.filter((data) => data.paymentStatus === "PAID")
const verifiedTeamsOnly = verifiedTeams
verifiedTeams=[...verifiedTeams,...verifiedSinglesOnly]
failedteams=[...failedteams,...parsedSingles.filter(data=>data.paymentStatus==="FAILED")]
Pendingteams=[...Pendingteams,...parsedSingles.filter(data=>data.paymentStatus==="PENDING")]
let totalCollected = verifiedTeamsOnly.reduce((sum, team) => {
  return sum + Number(calculateTotalAmount(team));
}, 0);
let totalSingelsCollected = parsedSingles
  .filter(data => data.paymentStatus === "PAID")
  .reduce((sum, data) => sum + Number(data.amount), 0);

let totalSingel = parsedSingles.filter(
  data => data.paymentStatus === "PAID"
).length;

let grandTotal = totalCollected + totalSingelsCollected;

  const GetCountParticepents=()=>{
    let count=0;
    for(const team of verifiedTeams ){
      if(team.isSingle){
        continue
      }
      count+=1 + team.teamMembers.length;
    }
    return count;
  }
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
            {/* Revenue Summary Section */}
            <section className="mb-8">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <p className="text-sm font-medium text-gray-600">Total Collected</p>
                  <p className="mt-2 text-3xl font-bold text-green-600">₹{totalCollected.toLocaleString('en-IN')}</p>
                  <p className="mt-1 text-xs text-gray-500">{verifiedTeamsOnly.length} verified teams={GetCountParticepents()}</p>
                </div>
                 <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <p className="text-sm font-medium text-gray-600">Total Single Collected</p>
                  <p className="mt-2 text-3xl font-bold text-green-600">₹{totalSingelsCollected.toLocaleString('en-IN')}</p>
                  <p className="mt-1 text-xs text-gray-500"> verified Single={totalSingel}</p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <p className="text-sm font-medium text-gray-600">Grand Total Collected</p>
                  <p className="mt-2 text-3xl font-bold text-emerald-700">₹{grandTotal.toLocaleString('en-IN')}</p>
                  <p className="mt-1 text-xs text-gray-500">Teams + Individuals</p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <p className="text-sm font-medium text-gray-600">Pending Verification</p>
                  <p className="mt-2 text-3xl font-bold text-yellow-600">{pendingTeams.length}</p>
                  <p className="mt-1 text-xs text-gray-500">Teams awaiting review</p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <p className="text-sm font-medium text-gray-600">Failed/Fraud</p>
                  <p className="mt-2 text-3xl font-bold text-red-600">{failedteams.length}</p>
                  <p className="mt-1 text-xs text-gray-500">Fraudulent payments</p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <p className="text-sm font-medium text-gray-600">Not Submitted</p>
                  <p className="mt-2 text-3xl font-bold text-gray-600">{Pendingteams.length}</p>
                  <p className="mt-1 text-xs text-gray-500">Payment pending</p>
                </div>
              </div>
            </section>
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <Button
                size="lg"
                className="text-lg px-5 py-4 shadow-lg shadow-teal-500/25 bg-transparent border border-teal-500/30 "
                onClick={()=>{
                  navigate("/admin/SubmessionsPage")
                }}
              >
                Submsiions
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
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
                        <th className="px-4 py-3">Team Lead</th>
                        <th className="px-4 py-3">Lead Mobile</th>
                        <th className="px-4 py-3 text-center">Members</th>
                        <th className="px-4 py-3">Transaction ID</th>
                        <th className="px-4 py-3">Time Stamp</th>
                        <th className="px-4 py-3 text-right">Amount</th>
                        <th className="px-4 py-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {pendingTeams.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                            No pending verifications
                          </td>
                        </tr>
                      ) : (
                        pendingTeams.map((team) => (
                          <tr key={team.teamcode} className="transition-colors hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-900">{team.teamName}</td>
                            <td className="px-4 py-3 font-mono text-xs text-gray-600">{team.teamLead.name}</td>
                            <td className="px-4 py-3 text-gray-600">{team.teamLead.mobile}</td>
                            <td className="px-4 py-3 text-center text-gray-600">{1 + team.teamMembers.length}</td>
                            <td className="px-4 py-3 font-mono text-xs text-gray-600">{team.transactionId}</td>
                            <td className="px-4 py-3 font-mono text-xs text-gray-600">{team.createdAt}</td>
                            <td className="px-4 py-3 text-right font-semibold text-gray-900">
                              ₹{team.isSingle?team.amount:
                              calculateTotalAmount(team)}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() =>
                                    team.isSingle?verifysingel(team.teamLead.name,team._id): verifyTeam(team.teamName)
                                    }
                                  className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                >
                                  Verify
                                </button>
                                <button
                                  onClick={() => team.isSingle?marksingelFraud(team.teamLead.name,team._id):markFraud(team.teamName)}
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

            <section className="mb-12">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">Verified Teams</h2>
                <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                  {verifiedTeamsOnly.length} verified
                </span>
              </div>

              <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-max text-left text-sm">
                    <thead className="bg-gray-50 text-xs font-medium uppercase tracking-wider text-gray-700">
                      <tr>
                        <th className="px-4 py-3">Team Name</th>
                        <th className="px-4 py-3">Team Lead</th>
                        <th className="px-4 py-3">Lead Mobile</th>
                        <th className="px-4 py-3 text-center">Members</th>
                        <th className="px-4 py-3">Transaction ID</th>
                        <th className="px-4 py-3 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {verifiedTeamsOnly.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                            No verified teams yet
                          </td>
                        </tr>
                      ) : (
                        verifiedTeamsOnly.map((team) => (
                          <tr key={team.teamcode} className="transition-colors hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-900">{team.teamName}</td>
                            <td className="px-4 py-3 font-mono text-xs text-gray-600">{team.teamLead.name}</td>
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

            <section className="mb-12">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">Verified Individual Members</h2>
                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                  {verifiedSinglesOnly.length} verified
                </span>
              </div>

              <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-max text-left text-sm">
                    <thead className="bg-gray-50 text-xs font-medium uppercase tracking-wider text-gray-700">
                      <tr>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Mobile</th>
                        <th className="px-4 py-3">Transaction ID</th>
                        <th className="px-4 py-3 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {verifiedSinglesOnly.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                            No verified individual members yet
                          </td>
                        </tr>
                      ) : (
                        verifiedSinglesOnly.map((member) => (
                          <tr key={member.teamcode} className="transition-colors hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-900">{member.teamLead.name}</td>
                            <td className="px-4 py-3 text-gray-600">{member.teamLead.mobile}</td>
                            <td className="px-4 py-3 font-mono text-xs text-gray-600">{member.transactionId}</td>
                            <td className="px-4 py-3 text-right font-semibold text-gray-900">
                              ₹{member.amount}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">Failed Teams</h2>
                <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800">
                  {failedteams.length} Failed
                </span>
              </div>

              <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-max text-left text-sm">
                    <thead className="bg-gray-50 text-xs font-medium uppercase tracking-wider text-gray-700">
                      <tr>
                        <th className="px-4 py-3">Team Name</th>
                        <th className="px-4 py-3">Team Lead</th>
                        <th className="px-4 py-3">Lead Mobile</th>
                        <th className="px-4 py-3 text-center">Members</th>
                        <th className="px-4 py-3">Transaction ID</th>
                        <th className="px-4 py-3 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {failedteams.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                            No failed teams yet
                          </td>
                        </tr>
                      ) : (
                        failedteams.map((team) => (
                          <tr key={team.teamcode} className="transition-colors hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-900">{team.teamName}</td>
                            <td className="px-4 py-3 font-mono text-xs text-gray-600">{team.teamLead.name}</td>
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

            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">Pending Teams</h2>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800">
                  {Pendingteams.length} pending
                </span>
              </div>

              <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-max text-left text-sm">
                    <thead className="bg-gray-50 text-xs font-medium uppercase tracking-wider text-gray-700">
                      <tr>
                        <th className="px-4 py-3">Team Name</th>
                        <th className="px-4 py-3">Team Lead</th>
                        <th className="px-4 py-3">Lead Mobile</th>
                        <th className="px-4 py-3 text-center">Members</th>
                        <th className="px-4 py-3">Transaction ID</th>
                        <th className="px-4 py-3 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {Pendingteams.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                            No pending teams yet
                          </td>
                        </tr>
                      ) : (
                        Pendingteams.map((team) => (
                          <tr key={team.teamcode} className="transition-colors hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-900">{team.teamName}</td>
                            <td className="px-4 py-3 font-mono text-xs text-gray-600">{team.teamLead.name}</td>
                            <td className="px-4 py-3 text-gray-600">{team.teamLead.mobile}</td>
                            <td className="px-4 py-3 text-center text-gray-600">{1 + team.teamMembers.length}</td>
                            <td className="px-4 py-3 font-mono text-xs text-gray-600">{team.transactionId}</td>
                            <td className="px-4 py-3 text-right font-semibold text-gray-900">
                              ₹{calculateTotalAmount(team)}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() =>
                                    team.isSingle?deletePenindgsingel(team._id): deletePenindgteam(team._id)
                                    }
                                  className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                >
                                  delete
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
          </>
        )}
      </div>
    </div>
  )
}
