import { useEffect, useState, useRef } from 'react'
import { X, Camera, Loader2 } from 'lucide-react'
import { compressAndUpload, deleteImage } from '../lib/imageUtils'

export default function FoodModal({ onClose, onSave, initialData }) {
  const isEdit = !!initialData
  const [name, setName] = useState(initialData?.name || '')
  const [imageUrl, setImageUrl] = useState(initialData?.image_url || '')
  const [imagePreview, setImagePreview] = useState(initialData?.image_url || '')
  const [hasRecipe, setHasRecipe] = useState(initialData?.recipe ? true : false)
  const [recipe, setRecipe] = useState(initialData?.recipe || '')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const fileRef = useRef()
  const recipeRef = useRef(null)
  const oldImageUrl = initialData?.image_url || null

  const resizeRecipe = () => {
    const el = recipeRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }

  useEffect(() => {
    if (!hasRecipe) return
    resizeRecipe()
  }, [hasRecipe, recipe])

  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const preview = URL.createObjectURL(file)
    setImagePreview(preview)
    setUploading(true)
    try {
      const url = await compressAndUpload(file)
      setImageUrl(url)
    } catch (err) {
      alert('이미지 업로드에 실패했습니다.')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) return alert('음식 이름을 입력해주세요.')
    if (uploading) return alert('이미지 업로드 중입니다. 잠시 기다려주세요.')
    setSaving(true)
    // 수정 시 이미지가 바뀌었으면 기존 이미지 삭제
    if (isEdit && oldImageUrl && oldImageUrl !== imageUrl) {
      await deleteImage(oldImageUrl)
    }
    await onSave({
      name: name.trim(),
      image_url: imageUrl || null,
      recipe: hasRecipe ? recipe.trim() : null,
    })
    setSaving(false)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-header">
          <h2>{isEdit ? '음식 수정' : '음식 등록'}</h2>
          <button className="icon-btn" onClick={onClose}><X size={22} /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* 이미지 첨부 */}
          <div className="image-upload-area" onClick={() => fileRef.current.click()}>
            {imagePreview ? (
              <img src={imagePreview} alt="preview" className="image-preview" />
            ) : (
              <div className="image-placeholder">
                <Camera size={36} className="placeholder-icon" />
                <span>사진 첨부</span>
              </div>
            )}
            {uploading && (
              <div className="upload-overlay">
                <Loader2 size={28} className="spin" />
                <span>압축 업로드 중...</span>
              </div>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImageChange}
          />

          {/* 음식 이름 */}
          <div className="form-group">
            <label>음식 이름</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="음식 이름을 입력하세요"
              className="text-input"
              required
            />
          </div>

          {/* 레시피 등록 */}
          <div className="checkbox-row">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={hasRecipe}
                onChange={(e) => setHasRecipe(e.target.checked)}
              />
              <span className="checkbox-custom" />
              레시피 등록하기
            </label>
          </div>
          <div className="form-group">
            <textarea
              ref={recipeRef}
              value={recipe}
              onChange={(e) => setRecipe(e.target.value)}
              onInput={resizeRecipe}
              placeholder="레시피를 입력하세요"
              className="text-input textarea"
              disabled={!hasRecipe}
              rows={4}
            />
          </div>

          <button type="submit" className="btn-primary" disabled={saving || uploading}>
            {saving ? <Loader2 size={18} className="spin" /> : null}
            {isEdit ? '수정 완료' : '등록하기'}
          </button>
        </form>
      </div>
    </div>
  )
}
