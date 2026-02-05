import React, { useState, useEffect } from 'react';
import { Users, CheckCircle, Plus, MoveRight, MoveLeft, XCircle, Trash, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

export default function Registration({setform, onsubmit}) {
  const navigate = useNavigate();
  const [teamStatus, setTeamStatus] = useState(null); 
  const [checking, setChecking] = useState(false);
  const [checkingLeadCsi, setCheckingLeadCsi] = useState(false);
  const [leadCsiChecked, setLeadCsiChecked] = useState(false);

  const [formData, setFormData] = useState({
    teamcode: null,
    teamName: '',
    collegeType: 'srkr',
    otherCollege: '',
    teamLead: {
      name: '',
      gender: "",
      regnum:"",
      email: '',
      mobile: '',
      department: '',
      year: '1st Year',
      location: '',
      tshirtSize: '',
      isCsi: null,
      price:"800",
      transactionId: ""
    },
    teamMembers: []
  });

  const addTeamMember = () => {
     console.log("add member")
    if (formData.teamMembers.length < 5) {
      setFormData({
        ...formData,
        teamMembers: [
          ...formData.teamMembers,
          {
            id: Date.now(),
            name: '',
            regnum:"",
            gender: "",
            email: '',
            mobile: '',
            department: '',
            year: '1st Year',
            tshirtSize: '',
            location: '',
            isCsi: null,
            price: "800",
            checkingCsi: false,
            csiChecked: false
          }
        ]
      });
    }
  };

  const deleteTeamMember = (id) => {
    setFormData({
      ...formData,
      teamMembers: formData.teamMembers.filter(member => member.id !== id)
    });
  };

  const updateTeamLead = (field, value) => {
    setFormData({
      ...formData,
      teamLead: {
        ...formData.teamLead,
        [field]: value
      }
    });
  };

  const updateTeamMember = (id, field, value) => {
    setFormData({
      ...formData,
      teamMembers: formData.teamMembers.map(member =>
        member.id === id ? { ...member, [field]: value } : member
      )
    });
  };

  const isCSi = async (mobileNumber, email) => {
    try {
      const res = await axios.get(
        `https://hackthon-backend-1-d2zj.onrender.com/verify?mobileNumber=${mobileNumber}&email=${email}`
      );
      return res.data.found;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const handleTeamLeadCsiCheck = async () => {
    if (!formData.teamLead.email || !formData.teamLead.mobile) {
      alert("Please enter email and mobile number first");
      return;
    }

    setCheckingLeadCsi(true);

    try {
      const found = await isCSi(formData.teamLead.mobile, formData.teamLead.email);
      
      setFormData(prev => ({
        ...prev,
        teamLead: {
          ...prev.teamLead,
          isCsi: found,
          price: found ? "800" : "800"
        }
      }));

      setLeadCsiChecked(true);
    } catch (error) {
      console.error("CSI verification failed:", error);
      alert("Failed to verify CSI membership. Please try again.");
    } finally {
      setCheckingLeadCsi(false);
    }
  };

  const handleMemberCsiCheck = async (memberId) => {
    const member = formData.teamMembers.find(m => m.id === memberId);
    
    if (!member.email || !member.mobile) {
      alert("Please enter email and mobile number first");
      return;
    }

    // Set checking state for this specific member
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.map(m =>
        m.id === memberId ? { ...m, checkingCsi: true } : m
      )
    }));

    try {
      const found = await isCSi(member.mobile, member.email);
      
      setFormData(prev => ({
        ...prev,
        teamMembers: prev.teamMembers.map(m =>
          m.id === memberId 
            ? { 
                ...m, 
                isCsi: found, 
                price: found ? "800" : "800",
                checkingCsi: false,
                csiChecked: true
              } 
            : m
        )
      }));
    } catch (error) {
      console.error("CSI verification failed:", error);
      alert("Failed to verify CSI membership. Please try again.");
      
      setFormData(prev => ({
        ...prev,
        teamMembers: prev.teamMembers.map(m =>
          m.id === memberId ? { ...m, checkingCsi: false } : m
        )
      }));
    }
  };

  // Team name availability check
  useEffect(() => {
    if (!formData.teamName.trim()) {
      setTeamStatus(null);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setChecking(true);
        const res = await axios.get(
          `https://hackthon-backend-1-d2zj.onrender.com/check-team-name?name=${formData.teamName}`
        );
        setTeamStatus(res.data.available);
      } catch (err) {
        setTeamStatus(null);
      } finally {
        setChecking(false);
      }
    }, 600); 

    return () => clearTimeout(timer);
  }, [formData.teamName]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const totalMembers = formData.teamMembers.length + 1; 
    
    if (totalMembers < 4 || totalMembers > 6) {
      alert("Team must have minimum 4 and maximum 6 members (including team lead)");
      return;
    }

    try {
      localStorage.setItem("formdata", JSON.stringify(formData));
      
      setform(formData);   
      onsubmit();          
    } catch (error) {
      console.error("Registration failed:", error);
      alert(error.response?.data?.msg || "Registration failed");
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("formdata");
    if (saved) {
      setFormData(JSON.parse(saved));
    }
  }, []);

  const totalMembers = formData.teamMembers.length + 1;
  const isPaymentEnabled = totalMembers >= 4 && totalMembers <= 6;

  return (
    <div className="w-full">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl p-4 md:p-6 lg:p-8">
          <div className="mb-6 md:mb-8">
            <h1 className="flex items-center gap-3 text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-3 bg-gradient-to-r from-[#0f2027] via-[#1d2a38] to-[#203a43] bg-clip-text animate-gradient">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-full bg-black/10 hover:bg-black/20 transition"
              >
                <MoveLeft size={24} />
              </button>
              Team Registration
            </h1>
            <p className="text-gray-600 text-sm md:text-base lg:text-lg">
              Enter the Team Lead details and add team members. Minimum 4 members total (including team lead), maximum 6 members total.
            </p>
          </div>

          <div className="space-y-4 md:space-y-6">
            {/* Team Information */}
            <div className="bg-white rounded-xl shadow-md p-4 md:p-6 border-l-4 transition-all duration-300 hover:shadow-lg" style={{ borderColor: '#0f2027' }}>
              <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                <Users className="animate-pulse" style={{ color: '#d97706' }} size={24} />
                <h2 className="text-xl md:text-2xl font-bold" style={{ color: '#d97706' }}>
                  Team Information
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Team Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your team name"
                    value={formData.teamName}
                    onChange={(e) => {
                      const teamName = e.target.value;
                      setFormData({
                        ...formData,
                        teamName,
                        teamcode: `${teamName}-${Date.now()}`
                      });
                    }}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#203a43] focus:outline-none transition-all duration-300 bg-gray-50 hover:bg-white"
                  />
                  {checking && (
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                      <Loader2 className="animate-spin" size={14} />
                      Checking availability...
                    </p>
                  )}
                  {!checking && teamStatus === true && (
                    <p className="flex items-center gap-1 text-sm text-green-600 mt-1">
                      <CheckCircle size={16} />
                      <span>Team name is available</span>
                    </p>
                  )}
                  {!checking && teamStatus === false && (
                    <p className="flex items-center gap-1 text-sm text-red-600 mt-1">
                      <XCircle size={16} />
                      Team name already taken
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Team Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Your Team Code"
                    value={formData.teamcode || ''}
                    onChange={(e) => setFormData({ ...formData, teamcode: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#203a43] focus:outline-none transition-all duration-300 bg-gray-50 hover:bg-white"
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    College Type
                  </label>
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="college"
                        value="srkr"
                        checked={formData.collegeType === 'srkr'}
                        onChange={(e) => setFormData({ ...formData, collegeType: e.target.value })}
                        className="w-4 h-4 accent-[#0f2027]"
                      />
                      <span className="text-gray-700 group-hover:text-[#0f2027] transition-colors">SRKR College</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="college"
                        value="others"
                        checked={formData.collegeType === 'others'}
                        onChange={(e) => setFormData({ ...formData, collegeType: e.target.value })}
                        className="w-4 h-4 accent-[#0f2027]"
                      />
                      <span className="text-gray-700 group-hover:text-[#0f2027] transition-colors">Others</span>
                    </label>
                  </div>
                  {formData.collegeType === 'others' && (
                    <div className="animate-slideIn">
                      <input
                        type="text"
                        placeholder="Enter college name"
                        value={formData.otherCollege}
                        onChange={(e) => setFormData({ ...formData, otherCollege: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#203a43] focus:outline-none transition-all duration-300 bg-gray-50 hover:bg-white"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Team Lead */}
            <div className="bg-white rounded-xl shadow-md p-4 md:p-6 border-l-4 transition-all duration-300 hover:shadow-lg" style={{ borderColor: '#1d2a38' }}>
              <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-4 md:mb-6">
                <CheckCircle className="animate-pulse" style={{ color: '#d97706' }} size={24} />
                <h2 className="text-xl md:text-2xl font-bold" style={{ color: '#d97706' }}>
                  Team Lead
                </h2>
                
                {/* <label className="inline-flex items-center cursor-pointer ml-auto">
                  <input 
                    type="checkbox" 
                    checked={formData.teamLead.isCsi === true}
                    onChange={handleTeamLeadCsiCheck}
                    disabled={checkingLeadCsi || leadCsiChecked}
                    className="sr-only peer"
                  />
                  <div className={`relative w-9 h-5 border rounded-full peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-disabled:opacity-50 peer-disabled:cursor-not-allowed peer-focus:outline-none peer-focus:ring-2 ${
                    leadCsiChecked 
                      ? (formData.teamLead.isCsi 
                          ? 'bg-green-600 border-green-600 peer-focus:ring-green-300' 
                          : 'bg-red-600 border-red-600 peer-focus:ring-red-300')
                      : 'bg-gray-300 border-gray-400 peer-focus:ring-gray-300'
                  }`}></div>
                  <span className="select-none ms-3 text-sm font-medium text-gray-700">
                    {checkingLeadCsi ? (
                      <span className="flex items-center gap-1">
                        <Loader2 className="animate-spin" size={14} />
                        Verifying...
                      </span>
                    ) : (
                      'CSI Member?'
                    )}
                  </span>
                </label>*/
                
                <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-red-100 text-red-700">
                  ₹{formData.teamLead.price}
                </span> }
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={formData.teamLead.name}
                    onChange={(e) => updateTeamLead('name', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#203a43] focus:outline-none transition-all duration-300 bg-gray-50 hover:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Registration Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Regetsration Number"
                    value={formData.teamLead.regnum}
                    onChange={(e) => updateTeamLead('regnum', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#203a43] focus:outline-none transition-all duration-300 bg-gray-50 hover:bg-white"
                  />
                </div>


                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select 
                    value={formData.teamLead.gender}
                    onChange={(e) => updateTeamLead('gender', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#203a43] focus:outline-none transition-all duration-300 bg-gray-50 hover:bg-white cursor-pointer"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Email ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="example@gmail.com"
                    value={formData.teamLead.email}
                    onChange={(e) => updateTeamLead('email', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#203a43] focus:outline-none transition-all duration-300 bg-gray-50 hover:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Mobile No <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="98xxxxx78"
                    value={formData.teamLead.mobile}
                    onChange={(e) => updateTeamLead('mobile', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#203a43] focus:outline-none transition-all duration-300 bg-gray-50 hover:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <select 
                    value={formData.teamLead.department}
                    onChange={(e) => updateTeamLead('department', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#203a43] focus:outline-none transition-all duration-300 bg-gray-50 hover:bg-white cursor-pointer"
                  >
                    <option value="">Select department</option>
                    <option value="CSE">CSE</option>
                    <option value="IT">IT</option>
                    <option value="AIML">AIML</option>
                    <option value="CSIT">CSIT</option>
                    <option value="AIDS">AIDS</option>
                    <option value="CSBS">CSBS</option>
                    <option value="CSG">CSG</option>
                    <option value="ECE">ECE</option>
                    <option value="EEE">EEE</option>
                    <option value="CIVIL">CIVIL</option>
                    <option value="MECH">MECH</option>
                    <option value="CIC">CIC</option>
                    <option value="OTHERS">Others</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Year of Study
                  </label>
                  <select 
                    value={formData.teamLead.year}
                    onChange={(e) => updateTeamLead('year', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#203a43] focus:outline-none transition-all duration-300 bg-gray-50 hover:bg-white cursor-pointer"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="Bhimavaram, Andhra Pradesh"
                    value={formData.teamLead.location}
                    onChange={(e) => updateTeamLead('location', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#203a43] focus:outline-none transition-all duration-300 bg-gray-50 hover:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    T-Shirt Size <span className="text-red-500">*</span>
                  </label>
                  <select 
                    value={formData.teamLead.tshirtSize}
                    onChange={(e) => updateTeamLead('tshirtSize', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#203a43] focus:outline-none transition-all duration-300 bg-gray-50 hover:bg-white cursor-pointer"
                  >
                    <option value="">Select size</option>
                    <option value="XS">XS</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="XXL">XXL</option>
                  </select>
                </div>
              </div>

              
            </div>

            {/* Team Members */}
            {formData.teamMembers.map((member, index) => (
              <div key={member.id} className="bg-white rounded-xl shadow-md p-4 md:p-6 border-l-4 transition-all duration-300 hover:shadow-lg animate-slideIn" style={{ borderColor: '#203a43' }}>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4 md:mb-6">
                  <div className="flex items-center gap-2 md:gap-3">
                    <Users style={{ color: '#d97706' }} size={24} />
                    <h2 className="text-xl md:text-2xl font-bold" style={{ color: '#d97706' }}>
                      Team Member {index + 1}
                    </h2>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {/* <label className="inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={member.isCsi === true}
                        onChange={() => handleMemberCsiCheck(member.id)}
                        disabled={member.checkingCsi || member.csiChecked}
                        className="sr-only peer"
                      />
                      <div className={`relative w-9 h-5 border rounded-full peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-disabled:opacity-50 peer-disabled:cursor-not-allowed peer-focus:outline-none peer-focus:ring-2 ${
                        member.csiChecked 
                          ? (member.isCsi 
                              ? 'bg-green-600 border-green-600 peer-focus:ring-green-300' 
                              : 'bg-red-600 border-red-600 peer-focus:ring-red-300')
                          : 'bg-gray-300 border-gray-400 peer-focus:ring-gray-300'
                      }`}></div>
                      <span className="select-none ms-3 text-sm font-medium text-gray-700">
                        {member.checkingCsi ? (
                          <span className="flex items-center gap-1">
                            <Loader2 className="animate-spin" size={14} />
                            Verifying...
                          </span>
                        ) : (
                          'CSI Member?'
                        )}
                      </span>
                    </label> */}
                    
                    <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-red-100 text-red-700">
                      ₹{member.price}
                    </span>
                    
                    <button
                      type="button"
                      onClick={() => deleteTeamMember(member.id)}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-all duration-300 transform hover:scale-110"
                    >
                      <Trash size={20} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Member name"
                      value={member.name}
                      onChange={(e) => updateTeamMember(member.id, 'name', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#203a43] focus:outline-none transition-all duration-300 bg-gray-50 hover:bg-white"
                    />
                  </div>

                  <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Registration Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Regetsration Number"
                    value={member.regnum}
                    onChange={(e) => updateTeamMember(member.id,'regnum', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#203a43] focus:outline-none transition-all duration-300 bg-gray-50 hover:bg-white"
                  />
                </div>
                  
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <select 
                      value={member.gender}
                      onChange={(e) => updateTeamMember(member.id, 'gender', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#203a43] focus:outline-none transition-all duration-300 bg-gray-50 hover:bg-white cursor-pointer"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Email ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="example@gmail.com"
                      value={member.email}
                      onChange={(e) => updateTeamMember(member.id, 'email', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#203a43] focus:outline-none transition-all duration-300 bg-gray-50 hover:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Mobile No <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="98xxxxxx78"
                      value={member.mobile}
                      onChange={(e) => updateTeamMember(member.id, 'mobile', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#203a43] focus:outline-none transition-all duration-300 bg-gray-50 hover:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Department <span className="text-red-500">*</span>
                    </label>
                    <select 
                      value={member.department}
                      onChange={(e) => updateTeamMember(member.id, 'department', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#203a43] focus:outline-none transition-all duration-300 bg-gray-50 hover:bg-white cursor-pointer"
                    >
                      <option value="">Select department</option>
                      <option value="CSE">CSE</option>
                      <option value="IT">IT</option>
                      <option value="AIML">AIML</option>
                      <option value="CSIT">CSIT</option>
                      <option value="AIDS">AIDS</option>
                      <option value="CSBS">CSBS</option>
                      <option value="CSG">CSG</option>
                      <option value="ECE">ECE</option>
                      <option value="EEE">EEE</option>
                      <option value="CIVIL">CIVIL</option>
                      <option value="MECH">MECH</option>
                      <option value="CIC">CIC</option>
                      <option value="OTHERS">Others</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Year of Study
                    </label>
                    <select 
                      value={member.year}
                      onChange={(e) => updateTeamMember(member.id, 'year', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#203a43] focus:outline-none transition-all duration-300 bg-gray-50 hover:bg-white cursor-pointer"
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      T-Shirt Size <span className="text-red-500">*</span>
                    </label>
                    <select 
                      value={member.tshirtSize}
                      onChange={(e) => updateTeamMember(member.id, 'tshirtSize', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#203a43] focus:outline-none transition-all duration-300 bg-gray-50 hover:bg-white cursor-pointer"
                    >
                      <option value="">Select size</option>
                      <option value="XS">XS</option>
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="XL">XL</option>
                      <option value="XXL">XXL</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Location
                    </label>
                    <input
                      type="text"
                      placeholder="Bhimavaram, Andhra Pradesh"
                      value={member.location}
                      onChange={(e) => updateTeamMember(member.id, "location", e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#203a43] focus:outline-none transition-all duration-300 bg-gray-50 hover:bg-white"
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* Add Team Member Button */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={addTeamMember}
                disabled={formData.teamMembers.length >= 5}
                className="group relative px-6 md:px-8 py-3 md:py-4 border-2 border-dashed rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-md hover:scale-105 w-full sm:w-auto"
                style={{ 
                  borderColor: '#d97706',
                  color: '#d97706'
                }}
              >
                <div className="flex items-center justify-center gap-2 md:gap-3">
                  <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                  <span className="text-base md:text-lg font-semibold">Add Team Member</span>
                </div>
              </button>
            </div>

            {/* Team Size Warning */}
            {!isPaymentEnabled && (
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <XCircle className="text-amber-600" size={20} />
                  <p className="text-amber-800 text-sm font-medium">
                    {totalMembers < 4 
                      ? `Please add ${4 - totalMembers} more member${4 - totalMembers > 1 ? 's' : ''} (Total members: ${totalMembers}/4 minimum)`
                      : `Maximum 6 members allowed (Current: ${totalMembers})`
                    }
                  </p>
                </div>
              </div>
            )}

            {/* Payment Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isPaymentEnabled}
              className="w-full flex items-center justify-center gap-2 py-3 md:py-4 text-white font-bold text-base md:text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:brightness-100"
              style={{
                background: isPaymentEnabled 
                  ? 'linear-gradient(135deg, #0f2027, #1d2a38, #203a43)' 
                  : 'linear-gradient(135deg, #9ca3af, #6b7280, #4b5563)',
              }}
            >
              <MoveRight className="w-5 h-5 md:w-6 md:h-6" />
              <span>
                {isPaymentEnabled 
                  ? 'Proceed to Payment' 
                  : `Payment (${totalMembers}/4-6 members)`
                }
              </span>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}