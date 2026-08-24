import { useEffect } from 'react'
import type { ReactNode } from 'react'

type Props = {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
}

export function GlassModal({ open, title, onClose, children }: Props) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="modal-root" role="presentation">
      <button className="modal-scrim" aria-label="Close dialog" type="button" onClick={onClose} />
      <div
        className="glass glass--strong modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-head">
          <h2 id="modal-title">{title}</h2>
          <button className="glass-btn glass-btn--light glass-btn--icon" type="button" onClick={onClose}>
            <span>Close</span>
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  )
}
