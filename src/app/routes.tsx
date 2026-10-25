import { createBrowserRouter } from "react-router";
import { IntroPage } from "./components/IntroPage";
import { Layout } from "./components/Layout";
import { HomePage } from "./components/HomePage";
import { AboutPage } from "./components/AboutPage";
import { ServicesPage } from "./components/ServicesPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <IntroPage />,
  },
  {
    element: <Layout />,
    children: [
      {
        path: "/home",
        element: <HomePage />,
      },
      {
        path: "/about",
        element: <AboutPage />,
      },
      {
        path: "/services",
        element: <ServicesPage />,
      },
    ],
  },
]);
