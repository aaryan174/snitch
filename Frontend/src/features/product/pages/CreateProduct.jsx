import React, { useState, useRef, useCallback } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { useProduct } from '../hooks/useProduct';
import { useNavigate } from 'react-router-dom';

// ─── SVG Icons ────────────────────────────────────────────────────────────────

const TagIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
    <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
  </svg>
);

const CurrencyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
    <path d="M12 18V6" />
  </svg>
);

const CloudUploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
    <path d="M12 12v9" />
    <path d="m16 16-4-4-4 4" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

const SparkleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <path d="m9 11 3 3L22 4" />
  </svg>
);

const AlertIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

// ─── Currency Data ────────────────────────────────────────────────────────────

const CURRENCIES = [
  { value: 'INR', label: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { value: 'USD', label: 'USD', symbol: '$', name: 'US Dollar' },
  { value: 'EUR', label: 'EUR', symbol: '€', name: 'Euro' },
  { value: 'GBP', label: 'GBP', symbol: '£', name: 'British Pound' },
  { value: 'JPY', label: 'JPY', symbol: '¥', name: 'Japanese Yen' },
];

// ─── Main Component ──────────────────────────────────────────────────────────

const CreateProduct = () => {
  const { handleCreateProduct } = useProduct();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    prizeAmount: '',
    prizeCurrency: 'INR',
  });
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const MAX_IMAGES = 7;
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const processFiles = useCallback((files) => {
    const validFiles = [];
    const newPreviews = [];

    const remaining = MAX_IMAGES - images.length;
    const filesToProcess = Array.from(files).slice(0, remaining);

    for (const file of filesToProcess) {
      if (!file.type.startsWith('image/')) continue;
      if (file.size > MAX_FILE_SIZE) continue;
      validFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    }

    if (validFiles.length > 0) {
      setImages(prev => [...prev, ...validFiles]);
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  }, [images.length]);

  const handleFileSelect = (e) => {
    processFiles(e.target.files);
    e.target.value = '';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    processFiles(e.dataTransfer.files);
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(previews[index]);
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (formData.title.trim().length < 3) {
      setError('Title must be at least 3 characters.');
      return;
    }
    if (formData.description.trim().length < 10) {
      setError('Description must be at least 10 characters.');
      return;
    }
    if (!formData.prizeAmount || parseFloat(formData.prizeAmount) < 1) {
      setError('Price must be a positive number (min 1).');
      return;
    }
    if (images.length === 0) {
      setError('Please upload at least one product image.');
      return;
    }

    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append('title', formData.title.trim());
      data.append('description', formData.description.trim());
      data.append('prizeAmount', formData.prizeAmount);
      data.append('prizeCurrency', formData.prizeCurrency);
      images.forEach((file) => {
        data.append('image', file);
      });

      await handleCreateProduct(data);
      setSuccess(true);

      setFormData({ title: '', description: '', prizeAmount: '', prizeCurrency: 'INR' });
      previews.forEach(url => URL.revokeObjectURL(url));
      setImages([]);
      setPreviews([]);

      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.message ||
        'Failed to create product. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="h-screen bg-[#000000] text-white flex items-center justify-center p-3 selection:bg-yellow-400 selection:text-black font-sans overflow-hidden">
      <div className="w-full max-w-6xl h-[calc(100vh-1.5rem)] bg-[#090909] rounded-2xl shadow-[0_0_60px_rgba(234,179,8,0.04)] border border-[#1a1a1a] flex overflow-hidden">

        {/* ─── Left Panel: Brand / Hero ─────────────────────────────────── */}
        <div className="hidden lg:flex w-[38%] relative bg-[#050505] flex-col justify-between p-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/[0.06] via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
          <div className="absolute top-1/4 -left-20 w-60 h-60 bg-yellow-500/[0.08] blur-[100px] rounded-full pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                <span className="text-yellow-400 font-bold text-sm">S</span>
              </div>
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#666]">Seller Studio</span>
            </div>
          </div>

          <div className="relative z-10 flex-1 flex flex-col justify-center">
            <h2 className="text-4xl font-bold tracking-tight mb-3 leading-[1.1]">
              List Your<br />
              <span className="text-yellow-400">Product.</span>
            </h2>
            <p className="text-[#888] text-xs leading-relaxed max-w-xs">
              Reach millions of premium customers. Your creation deserves the spotlight.
            </p>
            <div className="mt-6 space-y-3">
              {['Multi-image upload support', 'Instant global visibility', 'Multi-currency pricing'].map((feature, i) => (
                <div key={i} className="flex items-center gap-3 group">
                  <div className="w-5 h-5 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center group-hover:border-yellow-500/30 transition-colors duration-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/60" />
                  </div>
                  <span className="text-[#666] text-xs tracking-wide group-hover:text-[#999] transition-colors duration-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10">
            <div className="w-full h-px bg-gradient-to-r from-transparent via-[#222] to-transparent" />
            <p className="text-[#333] text-[10px] mt-3 tracking-widest uppercase">© 2026 Snitch — Seller Dashboard</p>
          </div>
        </div>

        {/* ─── Right Panel: Form ────────────────────────────────────────── */}
        <div className="w-full lg:w-[62%] py-4 px-6 md:px-8 lg:px-10 flex flex-col justify-start relative overflow-hidden">
          <div className="absolute top-[-40%] right-[-40%] w-[80%] h-[80%] bg-yellow-500/[0.03] blur-[120px] rounded-full pointer-events-none" />

          <div className="w-full max-w-lg mx-auto relative z-10">
            {/* Mobile header */}
            <div className="lg:hidden flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded bg-yellow-500/20 flex items-center justify-center">
                <span className="text-yellow-400 font-bold text-[10px]">S</span>
              </div>
              <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#666]">Seller Studio</span>
            </div>

            {/* Page heading */}
            <div className="mb-3">
              <div className="flex items-center gap-1.5 mb-0.5">
                <SparkleIcon />
                <span className="text-[10px] font-medium tracking-widest uppercase text-yellow-500/80">New Listing</span>
              </div>
              <h1 className="text-xl font-bold tracking-tight">Publish Your Product</h1>
              <p className="text-[#555] text-xs mt-0.5">Fill in the details to list your product in the gallery.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-2.5">
              {/* Alerts */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-2 rounded-lg flex items-center gap-2">
                  <AlertIcon />
                  <span>{error}</span>
                </div>
              )}
              {success && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs p-2 rounded-lg flex items-center gap-2">
                  <CheckCircleIcon />
                  <span>Product published successfully! Redirecting...</span>
                </div>
              )}

              {/* ─── Image Upload (compact inline) ───────────────────── */}
              <div>
                <label className="text-xs font-medium text-gray-300 tracking-wide flex items-center justify-between mb-1">
                  <span>Product Images</span>
                  <span className="text-[#444] text-[10px] font-normal">{images.length}/{MAX_IMAGES}</span>
                </label>
                <div
                  onClick={() => images.length < MAX_IMAGES && fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border border-dashed rounded-lg px-3 py-2 cursor-pointer transition-all duration-300 group flex items-center gap-3 ${
                    isDragOver
                      ? 'border-yellow-500/60 bg-yellow-500/[0.04]'
                      : images.length >= MAX_IMAGES
                        ? 'border-[#222] bg-[#0a0a0a] cursor-not-allowed opacity-50'
                        : 'border-[#222] hover:border-[#444] bg-[#0a0a0a] hover:bg-[#0e0e0e]'
                  }`}
                >
                  <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileSelect} className="hidden" id="product-image-upload" />
                  <div className={`text-[#444] shrink-0 transition-colors duration-300 ${isDragOver ? 'text-yellow-500/60' : 'group-hover:text-[#666]'}`}>
                    <CloudUploadIcon />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[#888]">{isDragOver ? 'Drop images here' : 'Drag & drop or click to upload'}</p>
                    <p className="text-[10px] text-[#444]">PNG, JPG up to 5MB · Max {MAX_IMAGES} images</p>
                  </div>
                </div>
                {previews.length > 0 && (
                  <div className="grid grid-cols-7 gap-1.5 mt-1.5">
                    {previews.map((preview, index) => (
                      <div key={index} className="relative group aspect-square rounded overflow-hidden bg-[#111] border border-[#1a1a1a] hover:border-[#333] transition-all duration-300">
                        <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                          <button type="button" onClick={(e) => { e.stopPropagation(); removeImage(index); }} className="w-5 h-5 rounded-full bg-red-500/80 hover:bg-red-500 flex items-center justify-center">
                            <CloseIcon />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ─── Title ───────────────────────────────────────────── */}
              <Input label="Product Title" name="title" placeholder="e.g. Premium Cotton Oversized Tee" icon={TagIcon} value={formData.title} onChange={handleChange} maxLength={150} required />

              {/* ─── Description ─────────────────────────────────────── */}
              <div className="flex flex-col gap-1 w-full">
                <label className="text-xs font-medium text-gray-300 tracking-wide flex items-center justify-between">
                  <span>Description</span>
                  <span className="text-[#444] text-[10px] font-normal">{formData.description.length} chars</span>
                </label>
                <div className={`relative bg-[#111111] border rounded-lg overflow-hidden transition-all duration-300 ${focusedField === 'description' ? 'border-white shadow-[0_0_10px_rgba(255,255,255,0.1)]' : 'border-[#222222] hover:border-[#444444]'}`}>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('description')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Describe your product — materials, fit, care instructions..."
                    rows={2}
                    required
                    className="w-full bg-transparent py-2 px-3 text-white placeholder-gray-500 outline-none text-xs resize-none focus:ring-0"
                  />
                </div>
              </div>

              {/* ─── Price & Currency ────────────────────────────────── */}
              <div className="grid grid-cols-5 gap-2">
                <div className="col-span-3">
                  <Input label="Price" name="prizeAmount" type="number" placeholder="999" icon={CurrencyIcon} value={formData.prizeAmount} onChange={handleChange} min="1" step="0.01" required />
                </div>
                <div className="col-span-2">
                  <div className="flex flex-col gap-1 w-full">
                    <label className="text-xs font-medium text-gray-300 tracking-wide">Currency</label>
                    <div className={`relative bg-[#111111] border rounded-lg overflow-hidden transition-all duration-300 ${focusedField === 'currency' ? 'border-white shadow-[0_0_10px_rgba(255,255,255,0.1)]' : 'border-[#222222] hover:border-[#444444]'}`}>
                      <select
                        name="prizeCurrency"
                        value={formData.prizeCurrency}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('currency')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full bg-transparent py-3 px-4 text-white outline-none text-sm appearance-none cursor-pointer focus:ring-0"
                      >
                        {CURRENCIES.map(c => (
                          <option key={c.value} value={c.value} className="bg-[#111] text-white">{c.symbol} {c.label}</option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#555]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ─── Submit ──────────────────────────────────────────── */}
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Publishing...
                  </div>
                ) : 'Publish Product'}
              </Button>

              <p className="text-center text-[10px] text-[#444] leading-relaxed">
                By publishing, you agree to the{' '}
                <a href="#" className="text-[#666] hover:text-white transition-colors underline underline-offset-2">Snitch Seller Terms</a>{' '}
                and{' '}
                <a href="#" className="text-[#666] hover:text-white transition-colors underline underline-offset-2">Gallery Curator Guidelines</a>.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;
