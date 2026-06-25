import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PageWrapper from '../components/layout/PageWrapper'
import HomePage        from '../pages/HomePage'
import ListingPage     from '../pages/ListingPage'
import DetailPage      from '../pages/DetailPage'
import LoginPage       from '../pages/LoginPage'
import RegisterPage    from '../pages/RegisterPage'
import DashboardPage   from '../pages/DashboardPage'
import HowItWorksPage  from '../pages/HowItWorksPage'
import PublishPage     from '../pages/PublishPage'
import EditListingPage from '../pages/EditListingPage'
import NotFoundPage    from '../pages/NotFoundPage'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PageWrapper />}>
          <Route path="/"                     element={<HomePage />}       />
          <Route path="/logements"            element={<ListingPage />}    />
          <Route path="/logements/:id"        element={<DetailPage />}     />
          <Route path="/logements/:id/modifier" element={<EditListingPage />} />
          <Route path="/dashboard"            element={<DashboardPage />}  />
          <Route path="/comment-ca-marche"    element={<HowItWorksPage />} />
          <Route path="/publier"              element={<PublishPage />}    />
        </Route>

        {/* Pages sans layout (nav/footer) */}
        <Route path="/connexion"   element={<LoginPage />}    />
        <Route path="/inscription" element={<RegisterPage />} />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}