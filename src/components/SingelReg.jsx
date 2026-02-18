import React, { useState, useEffect } from 'react';
import { User, MoveRight, MoveLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SingleRegistration({setform, onsubmit}) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    gender: "",
    regnum: "",
    email: '',
    mobile: '',
    department: '',
    year: '1st Year',
    location: '',
    tshirtSize: '',
    collegeType: 'srkr',
    otherCollege: '',
    price: "800",
    transactionId: ""
  });

  const updateField = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!e.target.checkValidity()) {
      e.target.reportValidity();
      alert("Please fill all fields correctly before submitting.");
      return;
    }

    try {
      // localStorage.setItem("singelformdata", JSON.stringify(formData));
      
      setform(formData);   
      onsubmit();          
    }catch (error) {
      console.error("Registration failed:", error);
      alert(error.response?.data?.msg || "Registration failed");
    }
  };

  // useEffect(() => {
  //   // const saved = localStorage.getItem("formdata");
  //   if (saved) {
  //     setFormData(JSON.parse(saved));
  //   }
  // }, []);

  return (
    <div className="w-full">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl p-4 md:p-6 lg:p-8">
          <div className="mb-6 md:mb-8">
            <h1 className="flex items-center gap-3 text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-3 bg-gradient-to-r from-[#0f2027] via-[#1d2a38] to-[#203a43] bg-clip-text animate-gradient">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="p-2 rounded-full bg-black/10 hover:bg-black/20 transition"
              >
                <MoveLeft size={24} />
              </button>
              Event Registration
            </h1>
            <p className="text-gray-600 text-sm md:text-base lg:text-lg">
              Enter your details to complete the registration process.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4 md:space-y-6">
              {/* College Information */}
              <div className="bg-white rounded-xl shadow-md p-4 md:p-6 border-l-4 transition-all duration-300 hover:shadow-lg" style={{ borderColor: '#0f2027' }}>
                <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                  <User className="animate-pulse" style={{ color: '#d97706' }} size={24} />
                  <h2 className="text-xl md:text-2xl font-bold" style={{ color: '#d97706' }}>
                    College Information
                  </h2>
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
                        onChange={(e) => updateField('collegeType', e.target.value)}
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
                        onChange={(e) => updateField('collegeType', e.target.value)}
                        className="w-4 h-4 accent-[#0f2027]"
                      />
                      <span className="text-gray-700 group-hover:text-[#0f2027] transition-colors">Others</span>
                    </label>
                  </div>
                  {formData.collegeType === 'others' && (
                    <div className="animate-slideIn">
                      <input
                        type="text"
                        required
                        placeholder="Enter college name"
                        value={formData.otherCollege}
                        onChange={(e) => updateField('otherCollege', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#203a43] focus:outline-none transition-all duration-300 bg-gray-50 hover:bg-white"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Personal Information */}
              <div className="bg-white rounded-xl shadow-md p-4 md:p-6 border-l-4 transition-all duration-300 hover:shadow-lg" style={{ borderColor: '#1d2a38' }}>
                <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-4 md:mb-6">
                  <User className="animate-pulse" style={{ color: '#d97706' }} size={24} />
                  <h2 className="text-xl md:text-2xl font-bold" style={{ color: '#d97706' }}>
                    Personal Information
                  </h2>
                  
                  <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-red-100 text-red-700 ml-auto">
                    ₹{formData.price||800}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={(e) => updateField('name', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#203a43] focus:outline-none transition-all duration-300 bg-gray-50 hover:bg-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Registration Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Registration Number"
                      value={formData.regnum}
                      onChange={(e) => updateField('regnum', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#203a43] focus:outline-none transition-all duration-300 bg-gray-50 hover:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <select 
                      required
                      value={formData.gender}
                      onChange={(e) => updateField('gender', e.target.value)}
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
                      required
                      pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                      placeholder="example@gmail.com"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#203a43] focus:outline-none transition-all duration-300 bg-gray-50 hover:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Mobile No <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      pattern="[6-9][0-9]{9}"
                      maxLength={10}
                      placeholder="98xxxxx78"
                      value={formData.mobile}
                      onChange={(e) => updateField('mobile', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#203a43] focus:outline-none transition-all duration-300 bg-gray-50 hover:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Branch <span className="text-red-500">*</span>
                    </label>
                    <select 
                      required
                      value={formData.department}
                      onChange={(e) => updateField('department', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#203a43] focus:outline-none transition-all duration-300 bg-gray-50 hover:bg-white cursor-pointer"
                    >
                      <option value="">Select branch</option>
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
                      Year of Study <span className="text-red-500">*</span>
                    </label>
                    <select 
                      required
                      value={formData.year}
                      onChange={(e) => updateField('year', e.target.value)}
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
                      Location <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Bhimavaram, Andhra Pradesh"
                      value={formData.location}
                      onChange={(e) => updateField('location', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#203a43] focus:outline-none transition-all duration-300 bg-gray-50 hover:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      T-Shirt Size <span className="text-red-500">*</span>
                    </label>
                    <select 
                      required
                      value={formData.tshirtSize}
                      onChange={(e) => updateField('tshirtSize', e.target.value)}
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

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 md:py-4 text-white font-bold text-base md:text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:brightness-110"
                style={{
                  background: 'linear-gradient(135deg, #0f2027, #1d2a38, #203a43)'
                }}
              >
                <MoveRight className="w-5 h-5 md:w-6 md:h-6" />
                <span>Proceed to Payment</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>{`
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