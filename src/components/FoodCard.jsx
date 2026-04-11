import { useRef, useLayoutEffect, useCallback } from 'react'
import { Pencil, Trash2, BookOpen } from 'lucide-react'

const TITLE_FONT_MAX = 14.4
const TITLE_FONT_MIN = 8

function useFitCardTitle(name) {
  const titleRef = useRef(null)
  const rowRef = useRef(null)

  const fit = useCallback(() => {
    const el = titleRef.current
    if (!el) return
    el.style.fontSize = `${TITLE_FONT_MAX}px`
    let size = TITLE_FONT_MAX
    while (size > TITLE_FONT_MIN && el.scrollWidth > el.clientWidth) {
      size -= 0.25
      el.style.fontSize = `${size}px`
    }
  }, [name])

  useLayoutEffect(() => {
    fit()
    const row = rowRef.current
    if (!row || typeof ResizeObserver === 'undefined') return undefined
    const ro = new ResizeObserver(() => fit())
    ro.observe(row)
    return () => ro.disconnect()
  }, [fit])

  return { titleRef, rowRef }
}

export default function FoodCard({ food, onEdit, onRequestDelete, onViewRecipe }) {
  const { titleRef, rowRef } = useFitCardTitle(food.name)
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
        <div className="card-title-row" ref={rowRef}>
          <h3 className="card-title" ref={titleRef} title={food.name}>
            {food.name}
          </h3>
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
