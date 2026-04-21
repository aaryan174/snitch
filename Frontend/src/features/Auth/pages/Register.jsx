import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import RadioGroup from '../../../components/ui/RadioGroup';
import Checkbox from '../../../components/ui/Checkbox';
import { useAuth } from "../hooks/useAuth.js";
import { useNavigate, Link } from 'react-router-dom';


// SVG Icons
const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const GoogleIcon = () => (
  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="18" height="18">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
    <path fill="none" d="M0 0h48v48H0z"></path>
  </svg>
);

const AppleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z" />
    <path d="M10 2c1 .5 2 2 2 5h-2c0-3-1-4-2-5Z" />
  </svg>
);

const Register = () => {

  const { handleRegister } = useAuth();
  const Navigate =  useNavigate();


  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'buyer',
    termsAccepted: false
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (role) => {
    setFormData(prev => ({ ...prev, role }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await handleRegister({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        isSeller: formData.role === 'seller',
      });
      console.log('Form Submitted:', formData);
      Navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white flex items-center justify-center p-4 selection:bg-yellow-400 selection:text-black font-sans">
      <div className="w-full max-w-5xl bg-[#090909] rounded-2xl shadow-[0_0_50px_rgba(234,179,8,0.03)] border border-[#1a1a1a] flex overflow-hidden">

        {/* Left Side: Image / Brand Panel (Desktop Only) */}
        <div className="hidden lg:flex w-1/2 relative bg-[#050505] flex-col justify-end p-12 overflow-hidden">
          {/* Base Image */}
          <img
            src="/hero-yellow-model.png"
            alt="Fashion Model Background"
            className="absolute inset-0 w-full h-full object-cover opacity-90"
          />

          {/* Noise and Vignette overlay */}
          <div className="absolute inset-0 bg-[#111] opacity-30 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />

          <div className="relative z-20 max-w-md">
            <h2 className="text-4xl font-bold tracking-tight mb-3 text-white">Elevate Your<br />Esthetic.</h2>
            <p className="text-gray-300 text-sm leading-relaxed drop-shadow-md">Join the premium streetwear community. Get access to exclusive drops, personalized recommendations, and seamless checkout.</p>
          </div>
        </div>

        {/* Right Side: Form Panel */}
        <div className="w-full lg:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center relative">

          {/* Subtle bg glow for form - YELLOW accent */}
          <div className="absolute top-[-50%] right-[-50%] w-full h-full bg-yellow-500/[0.04] blur-[120px] rounded-full pointer-events-none" />

          <div className="max-w-md w-full mx-auto relative z-10">
            <div className="mb-10 text-center lg:text-left">
              <h1 className="text-3xl font-bold tracking-tight mb-2">Create an account</h1>
              <p className="text-[#a1a1a1] text-sm">Enter your details to get started.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Error Alert */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg flex items-center gap-2 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {error}
                </div>
              )}

              {/* Radio Selection for Buyer/Seller */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300 tracking-wide block mb-1">
                  I want to
                </label>
                <RadioGroup
                  name="role"
                  options={[
                    { label: 'Shop (Buyer)', value: 'buyer' },
                    { label: 'Sell (Seller)', value: 'seller' }
                  ]}
                  selectedValue={formData.role}
                  onChange={handleRoleChange}
                />
              </div>

              {/* Form Inputs */}
              <div className="space-y-4">
                <Input
                  label="Full Name"
                  name="name"
                  placeholder="John Doe"
                  icon={UserIcon}
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  icon={MailIcon}
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

                <Input
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  icon={LockIcon}
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Terms Checkbox */}
              <div className="py-2">
                <Checkbox
                  id="terms"
                  label={
                    <span>
                      I agree to the <a href="#" className="text-white hover:underline underline-offset-2">Terms of Service</a> & <a href="#" className="text-white hover:underline underline-offset-2">Privacy Policy</a>
                    </span>
                  }
                  checked={formData.termsAccepted}
                  onChange={(e) => setFormData(prev => ({ ...prev, termsAccepted: e.target.checked }))}
                  required
                />
              </div>

              {/* Submit Button */}
              <Button type="submit" variant="primary">
                Create Account
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#222]"></div>
              </div>
              <div className="relative flex justify-center text-xs text-gray-500 uppercase tracking-wider">
                <span className="bg-[#090909] px-4 font-medium">Or continue with</span>
              </div>
            </div>

            {/* Social Logins */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="api/auth/google" 
                className="flex flex-1 items-center justify-center gap-3 bg-[#131314] hover:bg-[#1f1f1f] border border-[#8e918f] text-[#e3e3e3] font-medium py-2.5 px-4 rounded shadow-sm transition-colors decoration-transparent focus:outline-none focus:ring-2 focus:ring-[#8e918f] focus:ring-offset-2 focus:ring-offset-[#090909]"
                style={{ fontFamily: '"Roboto", "Arial", sans-serif' }}
              >
                <GoogleIcon />
                <span className="text-sm">Continue with Google</span>
              </a>
              <a 
                href="#"
                className="flex flex-1 items-center justify-center gap-3 bg-[#0a0a0a] hover:bg-[#1f1f1f] border border-[#333333] text-white font-medium py-2.5 px-4 rounded shadow-sm transition-colors decoration-transparent focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#090909]"
              >
                <AppleIcon />
                <span className="text-sm">Continue with Apple</span>
              </a>
            </div>

            {/* Login Link */}
            <div className="mt-8 text-center text-sm text-[#a1a1a1]">
              Already have an account?{' '}
              <Link to="/login" className="text-white font-medium hover:text-gray-300 transition-colors hover:underline underline-offset-4">
                Log in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
