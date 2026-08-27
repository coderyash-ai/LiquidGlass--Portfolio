import type { ReactNode } from 'react'

type Props = {
  className?: string
  children: ReactNode
}

export function GlassControl({ className = '', children }: Props) {
  return <div className={`glass glass-control ${className}`.trim()}>{children}</div>
}
