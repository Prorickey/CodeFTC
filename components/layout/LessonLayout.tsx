"use client"

import { Group, Panel, Separator } from "react-resizable-panels"

interface LessonLayoutProps {
  leftPanel: React.ReactNode
  rightPanel: React.ReactNode
}

export function LessonLayout({ leftPanel, rightPanel }: LessonLayoutProps) {
  return (
    <Group orientation="horizontal" className="h-full">
      <Panel id="lesson-content" defaultSize="45%" minSize="30%" className="h-full">
        <div className="h-full overflow-y-auto">{leftPanel}</div>
      </Panel>

      <Separator className="w-1.5 bg-[var(--color-border)] transition-colors data-[separator]:hover:bg-[var(--color-accent)] data-[separator]:active:bg-[var(--color-accent)]" />

      <Panel id="code-editor" defaultSize="55%" minSize="30%" className="h-full">
        <div className="flex h-full flex-col">{rightPanel}</div>
      </Panel>
    </Group>
  )
}
