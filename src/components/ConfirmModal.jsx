import { X } from 'lucide-react'

export default function ConfirmModal({
  title = '확인',
  message = '진행할까요?',
  confirmText = '확인',
  cancelText = '취소',
  danger = false,
  onConfirm,
  onClose,
}) {
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box confirm-modal-box">
        <div className="confirm-modal-header">
          <h2 className="confirm-modal-title">{title}</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="닫기">
            <X size={22} />
          </button>
        </div>

        <p className="confirm-modal-message">{message}</p>

        <div className="confirm-modal-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>
            {cancelText}
          </button>
          <button
            type="button"
            className={`btn-primary ${danger ? 'danger' : ''}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

