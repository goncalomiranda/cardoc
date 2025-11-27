import React from "react";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/clerk-react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import SummaryPage from "./pages/SummaryPage";
import ProtectedPage from "./components/ProtectedPage";
import "./styles/cardoc-theme.css";

if (!process.env.REACT_APP_CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key from Clerk");
}
const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

function ClerkWithRoutes() {
  const navigate = useNavigate();

  return (
    <ClerkProvider publishableKey={clerkPubKey} navigate={(to) => navigate(to)}>
      <Header />
      <main className="bg-gray-200 min-vh-100">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <SignedIn>
                  <SummaryPage />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />
          <Route
            path="/protected"
            element={
              <>
                <SignedIn>
                  <ProtectedPage />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />
        </Routes>
      </main>
    </ClerkProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ClerkWithRoutes />
    </BrowserRouter>
  );
}

export default App;
