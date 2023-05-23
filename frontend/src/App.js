import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "main/pages/HomePage";
import ProfilePage from "main/pages/ProfilePage";
import AdminUsersPage from "main/pages/AdminUsersPage";

import BookIndexPage from "main/pages/Books/BookIndexPage";
import BookCreatePage from "main/pages/Books/BookCreatePage";
import BookEditPage from "main/pages/Books/BookEditPage";
import BookDetailsPage from "main/pages/Books/BookDetailsPage";

import ParkIndexPage from "main/pages/Parks/ParkIndexPage";
import ParkCreatePage from "main/pages/Parks/ParkCreatePage";
import ParkEditPage from "main/pages/Parks/ParkEditPage";
import ParkDetailsPage from "main/pages/Parks/ParkDetailsPage";

import RestaurantCreatePage from "main/pages/Restaurants/RestaurantCreatePage";
import RestaurantEditPage from "main/pages/Restaurants/RestaurantEditPage";
import RestaurantIndexPage from "main/pages/Restaurants/RestaurantIndexPage";
import RestaurantDetailsPage from "main/pages/Restaurants/RestaurantDetailsPage";

import UCSBDatesIndexPage from "main/pages/UCSBDates/UCSBDatesIndexPage";
import UCSBDatesCreatePage from "main/pages/UCSBDates/UCSBDatesCreatePage";
import UCSBDatesEditPage from "main/pages/UCSBDates/UCSBDatesEditPage";




import { hasRole, useCurrentUser } from "main/utils/currentUser";

import "bootstrap/dist/css/bootstrap.css";


function App() {

  const { data: currentUser } = useCurrentUser();

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route exact path="/profile" element={<ProfilePage />} />
        {
          hasRole(currentUser, "ROLE_ADMIN") && <Route exact path="/admin/users" element={<AdminUsersPage />} />
        }
        {
          hasRole(currentUser, "ROLE_USER") && (
            <>
              <Route exact path="/ucsbdates/list" element={<UCSBDatesIndexPage />} />
              <Route exact path="/books/list" element={<BookIndexPage />} />
              <Route exact path="/books/details/:id" element={<BookDetailsPage />} />
              <Route exact path="/restaurants/list" element={<RestaurantIndexPage />} />
              <Route exact path="/restaurants/details/:id" element={<RestaurantDetailsPage />} />
              <Route exact path="/parks/list" element={<ParkIndexPage />} />
              <Route exact path="/parks/details/:id" element={<ParkDetailsPage />} />
            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_ADMIN") && (
            <>
              <Route exact path="/ucsbdates/edit/:id" element={<UCSBDatesEditPage />} />
              <Route exact path="/ucsbdates/create" element={<UCSBDatesCreatePage />} />

              <Route exact path="/books/edit/:todoId" element={<BookEditPage />} />
              <Route exact path="/books/create" element={<BookCreatePage />} />

              <Route exact path="/restaurants/create" element={<RestaurantCreatePage />} />
              <Route exact path="/restaurants/edit/:id" element={<RestaurantEditPage />} />

              <Route exact path="/parks/create" element={<ParkCreatePage />} />
              <Route exact path="/parks/edit/:id" element={<ParkEditPage />} />
            </>
          )
        }

      </Routes>
    </BrowserRouter>
  );
}

export default App;
