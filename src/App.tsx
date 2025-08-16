import { Outlet } from 'react-router-dom'

export default function App() {
  // 画面スクロール不可（中央寄せ維持）
  return (
    <div className="min-h-dvh bg-zinc-950 text-zinc-200 overflow-hidden">
      <Outlet />
    </div>
  )
}
