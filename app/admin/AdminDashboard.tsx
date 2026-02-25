"use client"

import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts"
import type { AnalyticsData } from "@/lib/adminAnalytics"

const C = {
  accent: "#3b82f6",
  success: "#22c55e",
  warning: "#f59e0b",
  purple: "#a855f7",
  border: "#2a2a2a",
  surface: "#141414",
  muted: "#888888",
  text: "#ededed",
}

const PIE_COLORS = [C.accent, C.success, C.warning, C.purple, "#ec4899", "#14b8a6"]

const tooltipStyle = {
  backgroundColor: C.surface,
  border: `1px solid ${C.border}`,
  borderRadius: 6,
  color: C.text,
  fontSize: 12,
}

interface StatCardProps {
  label: string
  value: string | number
  sub?: string
}

function StatCard({ label, value, sub }: StatCardProps) {
  return (
    <div className="rounded-lg border border-[#2a2a2a] bg-[#141414] p-5">
      <p className="text-xs text-[#888]">{label}</p>
      <p className="mt-1 text-3xl font-bold text-[#ededed]">{value}</p>
      {sub && <p className="mt-1 text-xs text-[#888]">{sub}</p>}
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-3 text-sm font-semibold text-[#888] uppercase tracking-wider">{children}</h2>
}

export function AdminDashboard({ data }: { data: AnalyticsData }) {
  const { stats, userGrowth, dau30, codeRuns30, topLessonsByViews, exerciseCompletionRate, authProviderBreakdown, recentUsers } = data

  return (
    <div className="space-y-8">
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Users" value={stats.totalUsers} />
        <StatCard label="DAU (today)" value={stats.dau} />
        <StatCard label="Total Code Runs" value={stats.totalCodeRuns} />
        <StatCard label="Completion Rate" value={`${stats.completionRate}%`} sub="lessons completed / users" />
      </div>

      {/* User growth */}
      <div>
        <SectionTitle>User Growth (30 days)</SectionTitle>
        <div className="rounded-lg border border-[#2a2a2a] bg-[#141414] p-4">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="date" tick={{ fill: C.muted, fontSize: 11 }} tickLine={false} />
              <YAxis tick={{ fill: C.muted, fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="count" stroke={C.accent} strokeWidth={2} dot={false} name="New users" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* DAU + code runs */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <SectionTitle>Daily Active Users (30 days)</SectionTitle>
          <div className="rounded-lg border border-[#2a2a2a] bg-[#141414] p-4">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dau30}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                <XAxis dataKey="date" tick={{ fill: C.muted, fontSize: 11 }} tickLine={false} />
                <YAxis tick={{ fill: C.muted, fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="count" stroke={C.success} fill={C.success} fillOpacity={0.15} strokeWidth={2} name="Active users" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <SectionTitle>Code Runs / Day (30 days)</SectionTitle>
          <div className="rounded-lg border border-[#2a2a2a] bg-[#141414] p-4">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={codeRuns30}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                <XAxis dataKey="date" tick={{ fill: C.muted, fontSize: 11 }} tickLine={false} />
                <YAxis tick={{ fill: C.muted, fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="count" stroke={C.warning} fill={C.warning} fillOpacity={0.15} strokeWidth={2} name="Code runs" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top lessons */}
      <div>
        <SectionTitle>Top Lessons by Views</SectionTitle>
        <div className="rounded-lg border border-[#2a2a2a] bg-[#141414] p-4">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topLessonsByViews} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} horizontal={false} />
              <XAxis type="number" tick={{ fill: C.muted, fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
              <YAxis type="category" dataKey="lessonId" tick={{ fill: C.muted, fontSize: 11 }} tickLine={false} width={160} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" fill={C.accent} name="Views" radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Exercise completions + auth providers */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <SectionTitle>Exercise Completions per Lesson</SectionTitle>
          <div className="rounded-lg border border-[#2a2a2a] bg-[#141414] p-4">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={exerciseCompletionRate}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                <XAxis dataKey="lessonId" tick={{ fill: C.muted, fontSize: 11 }} tickLine={false} />
                <YAxis tick={{ fill: C.muted, fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="completors" fill={C.success} name="Completors" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <SectionTitle>Auth Provider Split</SectionTitle>
          <div className="flex items-center justify-center rounded-lg border border-[#2a2a2a] bg-[#141414] p-4">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={authProviderBreakdown}
                  dataKey="count"
                  nameKey="provider"
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={3}
                >
                  {authProviderBreakdown.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend
                  formatter={(value) => <span style={{ color: C.muted, fontSize: 12 }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent users table */}
      <div>
        <SectionTitle>Recent Users</SectionTitle>
        <div className="rounded-lg border border-[#2a2a2a] bg-[#141414] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2a2a2a]">
                <th className="px-4 py-3 text-left text-xs text-[#888] font-medium">User</th>
                <th className="px-4 py-3 text-left text-xs text-[#888] font-medium">Email</th>
                <th className="px-4 py-3 text-left text-xs text-[#888] font-medium">Provider</th>
                <th className="px-4 py-3 text-left text-xs text-[#888] font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((u, i) => (
                <tr key={i} className="border-b border-[#2a2a2a] last:border-0 hover:bg-[#1a1a1a]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {u.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={u.image} alt="" className="h-7 w-7 rounded-full" />
                      ) : (
                        <div className="h-7 w-7 rounded-full bg-[#2a2a2a] flex items-center justify-center text-xs text-[#888]">
                          {u.name?.charAt(0) ?? "?"}
                        </div>
                      )}
                      <span className="text-[#ededed]">{u.name ?? "—"}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#888]">{u.email ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className="rounded bg-[#2a2a2a] px-2 py-0.5 text-xs text-[#888] capitalize">
                      {u.provider ?? "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#888]">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {recentUsers.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-[#888]">No users yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
