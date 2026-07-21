import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Landing and Studio are separate lazy route chunks (TECHNICAL_ARCHITECTURE.md §3, §10).
const Landing = lazy(() => import("./routes/Landing"));
const Studio = lazy(() => import("./routes/Studio"));

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<RouteFallback />}>
        <Landing />
      </Suspense>
    ),
  },
  {
    path: "/studio",
    element: (
      <Suspense fallback={<RouteFallback />}>
        <Studio />
      </Suspense>
    ),
  },
]);

function RouteFallback() {
  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "grid",
        placeItems: "center",
        color: "var(--color-slate)",
      }}
      aria-busy="true"
    >
      Loading the Studio…
    </div>
  );
}

export function App() {
  return <RouterProvider router={router} />;
}
