import { Pencil, Trash2, BookOpen } from 'lucide-react'

export default function FoodCard({ food, onEdit, onRequestDelete, onViewRecipe }) {
  const isRecipe = !!food.recipe

  const openRecipe = () => {
    if (!isRecipe) return
    onViewRecipe(food)
  }

  return (
    <div
      className={`food-card ${isRecipe ? 'clickable' : ''}`}
      onClick={openRecipe}
      role={isRecipe ? 'button' : undefined}
      tabIndex={isRecipe ? 0 : undefined}
      onKeyDown={(e) => {
        if (!isRecipe) return
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          openRecipe()
        }
      }}
    >
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
          <div className="card-icon-actions">
            <button
              type="button"
              className="icon-btn edit"
              onClick={(e) => {
                e.stopPropagation()
                onEdit(food)
              }}
              title="수정"
            >
              <Pencil size={14} />
            </button>
            <button
              type="button"
              className="icon-btn delete"
              onClick={(e) => {
                e.stopPropagation()
                onRequestDelete(food)
              }}
              title="삭제"
              aria-label="삭제"
            >
              <Trash2 size={14} />
            </button>
          </div>
          {food.recipe && (
            <div className="recipe-indicator" title="레시피 있음" aria-label="레시피 있음">
              <BookOpen size={14} aria-hidden />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
