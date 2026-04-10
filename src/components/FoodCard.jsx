import { useState } from 'react'
import { Pencil, Trash2, BookOpen } from 'lucide-react'

export default function FoodCard({ food, onEdit, onDelete, onViewRecipe }) {
  const [confirmDelete, setConfirmDelete] = useState(false)

  const handleDelete = () => {
    if (confirmDelete) {
      onDelete(food.id)
    } else {
      setConfirmDelete(true)
      setTimeout(() => setConfirmDelete(false), 2500)
    }
  }

  return (
    <div className="food-card">
      {food.image_url ? (
        <div className="card-image-wrap">
          <img src={food.image_url} alt={food.name} className="card-image" />
        </div>
      ) : (
        <div className="card-image-empty">
          <span>🍽️</span>
        </div>
      )}

      <div className="card-body">
        <div className="card-title-row">
          <h3 className="card-title">{food.name}</h3>
        </div>

        <div className="card-actions">
          {food.recipe && (
            <button
              type="button"
              className="btn-recipe"
              onClick={() => onViewRecipe(food)}
              title="레시피"
              aria-label="레시피 보기"
            >
              <BookOpen size={14} aria-hidden />
            </button>
          )}
          <div className="card-icon-actions">
            <button className="icon-btn edit" onClick={() => onEdit(food)} title="수정">
              <Pencil size={14} />
            </button>
            <button
              className={`icon-btn delete ${confirmDelete ? 'confirm' : ''}`}
              onClick={handleDelete}
              title={confirmDelete ? '한 번 더 누르면 삭제' : '삭제'}
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
