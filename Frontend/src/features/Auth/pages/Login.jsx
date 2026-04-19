import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { useAuth } from "../hooks/useAuth.js";
import { useNavigate, Link } from 'react-router-dom';

// SVG Icons
const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32" />
  </svg>
);

const AppleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z" />
    <path d="M10 2c1 .5 2 2 2 5h-2c0-3-1-4-2-5Z" />
  </svg>
);

const Login = () => {

  const { handleLogin } = useAuth();
  const Navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await handleLogin({
        email: formData.email,
        password: formData.password,
      });
      console.log('Form Submitted:', formData);
      Navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.message || 'Login failed. Please check your credentials.');
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
            <h2 className="text-4xl font-bold tracking-tight mb-3 text-white">Welcome<br />Back.</h2>
            <p className="text-gray-300 text-sm leading-relaxed drop-shadow-md">Sign in to access your exclusive drops, personalized recommendations, and seamless checkout.</p>
          </div>
        </div>

        {/* Right Side: Form Panel */}
        <div className="w-full lg:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center relative">

          {/* Subtle bg glow for form - YELLOW accent */}
          <div className="absolute top-[-50%] right-[-50%] w-full h-full bg-yellow-500/[0.04] blur-[120px] rounded-full pointer-events-none" />

          <div className="max-w-md w-full mx-auto relative z-10">
            <div className="mb-10 text-center lg:text-left">
              <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome Back</h1>
              <p className="text-[#a1a1a1] text-sm">Enter your credentials to access your account.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Error Alert */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {error}
                </div>
              )}

              {/* Form Inputs */}
              <div className="space-y-4">
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

              {/* Forgot Password Link */}
              <div className="flex justify-end">
                <a href="#" className="text-sm text-[#a1a1a1] hover:text-white transition-colors">
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <Button type="submit" variant="primary">
                Sign In
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
            <div className="flex gap-4">
              <Button type="button" variant="social">
                <GoogleIcon />
                Google
              </Button>
              <Button type="button" variant="social">
                <AppleIcon />
                Apple
              </Button>
            </div>

            {/* Register Link */}
            <div className="mt-8 text-center text-sm text-[#a1a1a1]">
              Don't have an account?{' '}
              <Link to="/register" className="text-white font-medium hover:text-gray-300 transition-colors hover:underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
