import { Outlet } from 'react-router-dom'

export default function App() {
  // 画面固定＆スクロール不可
  return (
    <div className="min-h-dvh bg-zinc-950 text-zinc-200 overflow-hidden fixed inset-0 w-full h-full">
      <Outlet />
    </div>
  )
}
