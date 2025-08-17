import { Outlet } from 'react-router-dom'

export default function App() {
  // スクロール可能に変更
  return (
    <div className="min-h-dvh bg-zinc-950 text-zinc-200">
      <Outlet />
    </div>
  )
}
