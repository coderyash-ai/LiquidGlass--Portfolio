import type { ReactNode } from 'react'

type Props = {
  className?: string
  children: ReactNode
  as?: 'article' | 'div' | 'li'
}

export function GlassCard({ className = '', children, as: Tag = 'article' }: Props) {
  return <Tag className={`glass glass-card ${className}`.trim()}>{children}</Tag>
}
