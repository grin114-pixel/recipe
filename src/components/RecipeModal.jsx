import { X } from 'lucide-react'

export default function RecipeModal({ food, onClose }) {
  return (
    <div
      className="modal-overlay modal-overlay--recipe"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-box recipe-modal-box">
        <div className="recipe-modal-header-row">
          <h2 className="recipe-title">📝 {food.name} 레시피</h2>
          <button type="button" className="icon-btn recipe-modal-close" onClick={onClose} aria-label="닫기">
            <X size={22} />
          </button>
        </div>

        <div className="recipe-content">
          <p className="recipe-text">{food.recipe}</p>
        </div>
      </div>
    </div>
  )
}
