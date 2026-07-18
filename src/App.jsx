import { useState, useEffect, useCallback, lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import GlowCursor from './components/GlowCursor.jsx'
import LangSwitch from './components/LangSwitch.jsx'
import AdminLock from './components/AdminLock.jsx'

const Splash = lazy(() => import('./pages/Splash.jsx'))
const Home = lazy(() => import('./pages/Home.jsx'))
const MenuPage = lazy(() => import('./pages/MenuPage.jsx'))
const PadelPage = lazy(() => import('./pages/PadelPage.jsx'))
const PlaystationPage = lazy(() => import('./pages/PlaystationPage.jsx'))
const EventsPage = lazy(() => import('./pages/EventsPage.jsx'))
const AdminLogin = lazy(() => import('./pages/AdminLogin.jsx'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard.jsx'))

function Fallback() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
    </div>
  )
}

export default function App() {
  const { i18n } = useTranslation()
  const [lang, setLang] = useState(i18n.language)
  const loc = useLocation()
  const isAdminRoute = loc.pathname.startsWith('/admin')

  const toggleLang = useCallback(() => {
    const next = lang === 'ar' ? 'en' : 'ar'
    i18n.changeLanguage(next)
    setLang(next)
  }, [lang, i18n])

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
  }, [lang])

  return (
    <>
      <GlowCursor />
      {!isAdminRoute && <LangSwitch lang={lang} toggle={toggleLang} />}
      <AdminLock />
      <Suspense fallback={<Fallback />}>
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/home" element={<Home />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/padel" element={<PadelPage />} />
          <Route path="/playstation" element={<PlaystationPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </Suspense>
    </>
  )
}