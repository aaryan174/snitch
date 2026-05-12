import React, { useState, useRef, useCallback } from 'react';
import { useProduct } from '../hooks/useProduct';
import { useNavigate } from 'react-router-dom';

// ─── SVG Icons ────────────────────────────────────────────────────────────────

const CloudUploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#EAB308" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-80">
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

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

const AlertIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <path d="m9 11 3 3L22 4" />
  </svg>
);

// ─── Currency Data ────────────────────────────────────────────────────────────

const CURRENCIES = [
  { value: 'USD', label: 'USD', symbol: '$' },
  { value: 'INR', label: 'INR', symbol: '₹' },
  { value: 'EUR', label: 'EUR', symbol: '€' },
  { value: 'GBP', label: 'GBP', symbol: '£' },
  { value: 'JPY', label: 'JPY', symbol: '¥' },
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
    prizeCurrency: 'USD',
  });
  const [sizes, setSizes] = useState([{ size: 'M', stock: 10 }]);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const MAX_IMAGES = 7;
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB as in image

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSize = () => {
    setSizes([...sizes, { size: '', stock: 0 }]);
  };

  const handleSizeChange = (index, field, value) => {
    const newSizes = [...sizes];
    newSizes[index][field] = value;
    setSizes(newSizes);
  };

  const handleRemoveSize = (index) => {
    setSizes(sizes.filter((_, i) => i !== index));
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
      data.append('sizes', JSON.stringify(sizes));
      images.forEach((file) => {
        data.append('image', file);
      });

      await handleCreateProduct(data);
      setSuccess(true);

      setFormData({ title: '', description: '', prizeAmount: '', prizeCurrency: 'USD' });
      previews.forEach(url => URL.revokeObjectURL(url));
      setImages([]);
      setPreviews([]);

      setTimeout(() => navigate('/product/Dashboard'), 2000);
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
    <div className="flex-1 flex bg-[#070707] text-white overflow-hidden relative min-h-full">
      {/* Background glowing effect similar to image */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-yellow-500/[0.03] blur-[150px] rounded-full pointer-events-none" />

      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center p-8 lg:p-16 gap-12 lg:gap-24 max-w-[1400px] mx-auto w-full z-10">
        
        {/* ─── Left Side: Text ─────────────────────────────────────────── */}
        <div className="flex-1 max-w-lg lg:pr-8 flex flex-col justify-center">
          <p className="text-[#EAB308] text-xs font-bold tracking-widest uppercase mb-4">
            Merchant Portal
          </p>
          <h1 className="text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] mb-6">
            <span className="text-white block">LIST YOUR</span>
            <span className="text-[#EAB308] block">PRODUCT</span>
          </h1>
          <div className="text-[#888] text-sm lg:text-base leading-relaxed space-y-2">
            <p>Reach millions of premium customers.</p>
            <p>Your creation deserves the spotlight of</p>
            <p>The Midnight Gallery.</p>
          </div>
        </div>

        {/* ─── Right Side: Form Card ───────────────────────────────────── */}
        <div className="w-full max-w-[420px] bg-[#0c0c0c] border border-[#1a1a1a] rounded-2xl p-8 shadow-2xl relative">
          <form onSubmit={handleSubmit} className="space-y-6 flex flex-col">
            
            {/* Alerts */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded-lg flex items-center gap-2">
                <AlertIcon />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs p-3 rounded-lg flex items-center gap-2">
                <CheckCircleIcon />
                <span>Product published successfully! Redirecting...</span>
              </div>
            )}

            {/* Product Title */}
            <div>
              <label className="block text-[10px] font-bold text-[#666] tracking-widest uppercase mb-2">
                Product Title
              </label>
              <input
                type="text"
                name="title"
                placeholder="e.g. Midnight Silk Blazer"
                value={formData.title}
                onChange={handleChange}
                maxLength={150}
                required
                className="w-full bg-[#111111] border border-transparent focus:border-[#333] hover:border-[#222] rounded-lg py-3 px-4 text-sm text-white placeholder-[#444] outline-none transition-all"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-[10px] font-bold text-[#666] tracking-widest uppercase mb-2">
                Description
              </label>
              <textarea
                name="description"
                placeholder="Describe the craftsmanship, fabric, and fit..."
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full bg-[#111111] border border-transparent focus:border-[#333] hover:border-[#222] rounded-lg py-3 px-4 text-sm text-white placeholder-[#444] outline-none resize-none transition-all"
              />
            </div>

            {/* Price & Currency */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-[10px] font-bold text-[#666] tracking-widest uppercase mb-2">
                  Price
                </label>
                <input
                  type="number"
                  name="prizeAmount"
                  placeholder="0.00"
                  value={formData.prizeAmount}
                  onChange={handleChange}
                  min="1"
                  step="0.01"
                  required
                  className="w-full bg-[#111111] border border-transparent focus:border-[#333] hover:border-[#222] rounded-lg py-3 px-4 text-sm text-white placeholder-[#444] outline-none transition-all"
                />
              </div>
              <div className="w-28">
                <label className="block text-[10px] font-bold text-[#666] tracking-widest uppercase mb-2">
                  Currency
                </label>
                <div className="relative">
                  <select
                    name="prizeCurrency"
                    value={formData.prizeCurrency}
                    onChange={handleChange}
                    className="w-full bg-[#111111] border border-transparent focus:border-[#333] hover:border-[#222] rounded-lg py-3 pl-4 pr-8 text-sm text-white outline-none appearance-none cursor-pointer transition-all"
                  >
                    {CURRENCIES.map(c => (
                      <option key={c.value} value={c.value} className="bg-[#111] text-white">{c.label}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#555]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Sizes & Stock */}
            <div>
              <label className="block text-[10px] font-bold text-[#666] tracking-widest uppercase mb-2">
                Sizes & Stock
              </label>
              <div className="space-y-3 mb-6">
                {sizes.map((s, index) => (
                  <div key={index} className="flex gap-4 items-center">
                    <input 
                      type="text" 
                      placeholder="Size (e.g. S, M, L)"
                      value={s.size} 
                      onChange={(e) => handleSizeChange(index, 'size', e.target.value)}
                      className="w-1/2 bg-[#111111] border border-transparent focus:border-[#333] rounded-lg py-2 px-3 text-sm text-white placeholder-[#444] outline-none transition-all uppercase"
                      required
                    />
                    <input 
                      type="number" 
                      placeholder="Stock quantity"
                      value={s.stock} 
                      onChange={(e) => handleSizeChange(index, 'stock', e.target.value)}
                      min="0"
                      className="w-1/2 bg-[#111111] border border-transparent focus:border-[#333] rounded-lg py-2 px-3 text-sm text-white placeholder-[#444] outline-none transition-all"
                      required
                    />
                    {sizes.length > 1 && (
                      <button type="button" onClick={() => handleRemoveSize(index)} className="text-red-500 hover:text-red-400 p-2">
                        <CloseIcon />
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={handleAddSize} className="text-[#EAB308] text-[10px] font-bold tracking-widest uppercase hover:underline">
                  + Add another size
                </button>
              </div>

            {/* Visual Assets */}
              <label className="block text-[10px] font-bold text-[#666] tracking-widest uppercase mb-2">
                Visual Assets
              </label>
              <div
                onClick={() => images.length < MAX_IMAGES && fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`w-full border border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                  isDragOver
                    ? 'border-yellow-500/50 bg-yellow-500/[0.02]'
                    : images.length >= MAX_IMAGES
                      ? 'border-[#222] bg-[#0a0a0a] cursor-not-allowed opacity-50'
                      : 'border-[#333] hover:border-[#555] bg-[#111111]'
                }`}
              >
                <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileSelect} className="hidden" />
                <div className="mb-3">
                  <CloudUploadIcon />
                </div>
                <p className="text-xs font-bold text-white mb-1">
                  Drag & drop or click to upload
                </p>
                <p className="text-[10px] text-[#666]">
                  High-resolution PNG, JPG up to 10MB.
                </p>
              </div>

              {/* Previews */}
              <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
                {previews.map((preview, index) => (
                  <div key={index} className="relative group shrink-0 w-8 h-8 rounded overflow-hidden bg-[#1a1a1a] border border-[#222]">
                    <img src={preview} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                    <button 
                      type="button" 
                      onClick={(e) => { e.stopPropagation(); removeImage(index); }} 
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                    >
                      <CloseIcon />
                    </button>
                  </div>
                ))}
                {/* Empty placeholders up to 7 slots to match the image */}
                {Array.from({ length: Math.max(0, MAX_IMAGES - previews.length) }).map((_, i) => (
                  <div key={`empty-${i}`} className="shrink-0 w-8 h-8 rounded bg-[#111111] border border-[#222] flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-white hover:bg-gray-100 text-black font-bold text-xs py-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-70 mt-2"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  PUBLISHING...
                </div>
              ) : (
                <>
                  PUBLISH PRODUCT
                  <ArrowRightIcon />
                </>
              )}
            </button>

            {/* Terms Footer */}
            <p className="text-center text-[8px] font-bold tracking-widest text-[#444] uppercase leading-relaxed mt-4">
              By publishing, you agree to the<br />Snitch Gallery Curator terms.
            </p>
          </form>
        </div>

      </div>
    </div>
  );
};

export default CreateProduct;

