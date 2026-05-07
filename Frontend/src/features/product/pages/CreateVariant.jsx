import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useProduct } from '../hooks/useProduct.js'

const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 19-7-7 7-7" /><path d="M19 12H5" />
  </svg>
)

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" /><path d="M12 5v14" />
  </svg>
)

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </svg>
)

const CreateVariant = () => {
  const { productId } = useParams()
  const navigate = useNavigate()
  const { handleCreateVariant } = useProduct()

  const [images, setImages] = useState([])
  const [priceAmount, setPriceAmount] = useState('')
  const [stock, setStock] = useState('')
  const [attributes, setAttributes] = useState([{ key: '', value: '' }])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleImageChange = (e) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).slice(0, 7) // max 7
      setImages(selectedFiles)
    }
  }

  const handleAttributeChange = (index, field, val) => {
    const newAttrs = [...attributes]
    newAttrs[index][field] = val
    setAttributes(newAttrs)
  }

  const addAttribute = () => {
    setAttributes([...attributes, { key: '', value: '' }])
  }

  const removeAttribute = (index) => {
    const newAttrs = attributes.filter((_, i) => i !== index)
    setAttributes(newAttrs)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const formData = new FormData()
      images.forEach(img => formData.append('images', img))
      formData.append('priceAmount', priceAmount)
      formData.append('stock', stock)
      
      const attrsObj = {}
      attributes.forEach(attr => {
        if (attr.key.trim() && attr.value.trim()) {
          attrsObj[attr.key.trim()] = attr.value.trim()
        }
      })
      formData.append('attributes', JSON.stringify(attrsObj))

      await handleCreateVariant(productId, formData)
      
      // Navigate back to product detail
      navigate(`/product/detail/${productId}`)
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create variant')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 bg-[#000000] text-white font-sans overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      <div className="max-w-[800px] mx-auto px-6 py-8">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(`/product/detail/${productId}`)} className="text-[#888] hover:text-white transition-colors">
            <ArrowLeftIcon />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Create Variant</h1>
            <p className="text-[#666] text-xs mt-1">Add a new style, size, or color for this product.</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Images */}
          <div className="bg-[#0e0e0e] border border-[#1a1a1a] rounded-xl p-6">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Variant Images (Max 7)</h2>
            <div className="flex items-center justify-center w-full">
              <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-40 border-2 border-[#1a1a1a] border-dashed rounded-xl cursor-pointer bg-[#111] hover:bg-[#151515] hover:border-yellow-500/50 transition-all duration-300">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-8 h-8 mb-4 text-[#666]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                  </svg>
                  <p className="mb-2 text-sm text-[#888]"><span className="font-semibold text-white">Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-[#555]">PNG, JPG, WEBP</p>
                </div>
                <input id="dropzone-file" type="file" className="hidden" multiple accept="image/*" onChange={handleImageChange} />
              </label>
            </div>
            {images.length > 0 && (
              <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                {images.map((file, idx) => (
                  <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-[#333]">
                    <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="bg-[#0e0e0e] border border-[#1a1a1a] rounded-xl p-6 space-y-6">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Pricing & Inventory</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-[#888] uppercase tracking-wider mb-2">Variant Price Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#666] font-medium">₹</span>
                  <input 
                    type="number" 
                    required 
                    value={priceAmount}
                    onChange={(e) => setPriceAmount(e.target.value)}
                    className="w-full bg-[#111] border border-[#1a1a1a] rounded-xl py-3 pl-10 pr-4 text-white placeholder-[#444] focus:outline-none focus:border-yellow-500/50 transition-colors"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#888] uppercase tracking-wider mb-2">Stock Quantity</label>
                <input 
                  type="number" 
                  required 
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="w-full bg-[#111] border border-[#1a1a1a] rounded-xl py-3 px-4 text-white placeholder-[#444] focus:outline-none focus:border-yellow-500/50 transition-colors"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Attributes */}
          <div className="bg-[#0e0e0e] border border-[#1a1a1a] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Attributes</h2>
              <button 
                type="button" 
                onClick={addAttribute}
                className="text-yellow-400 text-xs font-bold tracking-widest uppercase hover:text-yellow-300 flex items-center gap-1"
              >
                <PlusIcon /> Add Attribute
              </button>
            </div>
            
            <div className="space-y-4">
              {attributes.map((attr, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <input 
                      type="text" 
                      placeholder="e.g. Size, Color" 
                      value={attr.key}
                      onChange={(e) => handleAttributeChange(index, 'key', e.target.value)}
                      className="w-full bg-[#111] border border-[#1a1a1a] rounded-xl py-2.5 px-4 text-sm text-white placeholder-[#444] focus:outline-none focus:border-yellow-500/50 transition-colors"
                    />
                    <input 
                      type="text" 
                      placeholder="e.g. XL, Midnight Black" 
                      value={attr.value}
                      onChange={(e) => handleAttributeChange(index, 'value', e.target.value)}
                      className="w-full bg-[#111] border border-[#1a1a1a] rounded-xl py-2.5 px-4 text-sm text-white placeholder-[#444] focus:outline-none focus:border-yellow-500/50 transition-colors"
                    />
                  </div>
                  {attributes.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeAttribute(index)}
                      className="p-2 text-[#666] hover:text-red-400 bg-[#111] rounded-xl border border-[#1a1a1a] transition-colors"
                    >
                      <TrashIcon />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <p className="text-[10px] text-[#555] mt-4">Define properties that make this variant unique (e.g., Color: Red, Size: L).</p>
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#EAB308] hover:bg-[#d4a006] disabled:bg-[#EAB308]/50 disabled:cursor-not-allowed text-black text-sm font-bold tracking-[0.15em] uppercase py-4 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(234,179,8,0.15)] flex justify-center items-center h-14"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Save Variant'
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default CreateVariant
