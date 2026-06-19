/**
 * Emplacement : client/src/components/layout/PageWrapper.jsx
 *
 * Layout commun à toutes les pages "publiques" du site
 * (Home, Listing, Detail, Dashboard).
 *
 * <Outlet /> est remplacé par la page active selon la route
 * (voir AppRouter.jsx — Route element={<PageWrapper />}).
 *
 * Les pages sans nav/footer (Login, Register) ne passent pas
 * par ce wrapper, elles sont déclarées à part dans AppRouter.
 */

import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

export default function PageWrapper() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}