import { useState } from 'react'
import { Plus, Search, Shuffle } from 'lucide-react'
import { useFoods } from './hooks/useFoods'
import FoodCard from './components/FoodCard'
import FoodModal from './components/FoodModal'
import RecipeModal from './components/RecipeModal'
import ConfirmModal from './components/ConfirmModal'
import './App.css'

const TABS = [
  { id: 'today', label: '오늘 뭐 먹지' },
  { id: 'recipe', label: '레시피' },
]

function ChefLogo() {
  return (
    <svg
      className="app-logo-mark"
      viewBox="0 0 48 48"
      width="22"
      height="22"
      role="img"
      aria-label="Yummy 로고"
    >
      {/* steam */}
      <path
        d="M18 12c-2 2-2 4 0 6"
        fill="none"
        stroke="rgba(255,255,255,0.9)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M24 10c-2 2-2 4 0 6"
        fill="none"
        stroke="rgba(255,255,255,0.9)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M30 12c-2 2-2 4 0 6"
        fill="none"
        stroke="rgba(255,255,255,0.9)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* chef hat */}
      <path
        d="M16 24c-2.8 0-5-2.1-5-4.8 0-2.4 1.7-4.3 4-4.7 1-3.2 4.1-5.5 7.7-5.5 2.1 0 4 .8 5.4 2.1 0.7-0.4 1.5-0.6 2.4-0.6 2.5 0 4.7 1.7 5.3 4.1 2 0.7 3.3 2.5 3.3 4.6 0 2.7-2.2 4.8-5 4.8H16z"
        fill="rgba(255,255,255,0.95)"
      />
      <path
        d="M17 24v12c0 1.7 1.4 3 3 3h16c1.7 0 3-1.4 3-3V24"
        fill="none"
        stroke="rgba(255,255,255,0.92)"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path
        d="M20 30h16"
        fill="none"
        stroke="rgba(255,255,255,0.75)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function App() {
  const { foods, loading, addFood, updateFood, deleteFood, shuffleFoods, refetch } = useFoods()
  const [activeTab, setActiveTab] = useState('today')
  const [showFoodModal, setShowFoodModal] = useState(false)
  const [editFood, setEditFood] = useState(null)
  const [recipeFood, setRecipeFood] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)

  const baseList =
    activeTab === 'recipe'
      ? foods.filter((f) => !!f.recipe)
      : foods

  const q = searchQuery.trim().toLowerCase()
  const filtered =
    q.length > 0
      ? baseList.filter(
          (f) =>
            (f.name && f.name.toLowerCase().includes(q)) ||
            (f.recipe && String(f.recipe).toLowerCase().includes(q)),
        )
      : baseList

  const handleSave = async (data) => {
    if (editFood) {
      await updateFood(editFood.id, data)
    } else {
      await addFood(data)
    }
    setEditFood(null)
  }

  const handleEdit = (food) => {
    setEditFood(food)
    setShowFoodModal(true)
  }

  const handleCloseModal = () => {
    setShowFoodModal(false)
    setEditFood(null)
  }

  const handleRequestDelete = (food) => {
    setDeleteTarget(food)
  }

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return
    await deleteFood(deleteTarget.id)
    // 탭 간 동기화/캐시 이슈 방지: 서버 기준으로 다시 로드
    await refetch()
    setDeleteTarget(null)
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-inner">
          <ChefLogo />
          <h1 className="app-title">Yummy</h1>
          <div className="header-search-slot">
            <div className="header-search-row">
              <div className="header-search">
                <Search className="header-search-icon" size={18} aria-hidden />
                <input
                  type="search"
                  className="header-search-input"
                  placeholder="검색"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  enterKeyHint="search"
                  autoComplete="off"
                />
              </div>
              {activeTab !== 'recipe' && filtered.length > 1 && (
                <button
                  type="button"
                  className="header-shuffle-btn"
                  onClick={shuffleFoods}
                  title="랜덤 섞기"
                  aria-label="랜덤 섞기"
                >
                  <Shuffle size={16} aria-hidden />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <nav className="tab-nav">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Content */}
      <main className="main-content">
        {loading ? (
          <div className="loading-state">
            <div className="spinner" />
            <p>불러오는 중...</p>
          </div>
        ) : baseList.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">🍽️</span>
            <p>
              {activeTab === 'today' && '음식을 등록해보세요!'}
              {activeTab === 'recipe' && '레시피가 있는 음식이 없어요.'}
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">🔍</span>
            <p>검색 결과가 없어요.</p>
          </div>
        ) : (
          <div className="food-grid">
            {filtered.map((food) => (
              <FoodCard
                key={food.id}
                food={food}
                onEdit={handleEdit}
                onRequestDelete={handleRequestDelete}
                onViewRecipe={setRecipeFood}
              />
            ))}
          </div>
        )}
      </main>

      {/* FAB */}
      <button className="fab" onClick={() => setShowFoodModal(true)} title="음식 등록">
        <Plus size={28} />
      </button>

      {/* Modals */}
      {showFoodModal && (
        <FoodModal
          onClose={handleCloseModal}
          onSave={handleSave}
          initialData={editFood}
        />
      )}
      {recipeFood && (
        <RecipeModal food={recipeFood} onClose={() => setRecipeFood(null)} />
      )}
      {deleteTarget && (
        <ConfirmModal
          title="삭제"
          message="삭제할까요?"
          cancelText="취소"
          confirmText="삭제"
          danger
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  )
}
