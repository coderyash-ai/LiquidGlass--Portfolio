import type { ReactNode } from 'react'

type Props = {
  className?: string
  children: ReactNode
}

export function GlassPill({ className = '', children }: Props) {
  return <span className={`glass glass-pill ${className}`.trim()}>{children}</span>
}
