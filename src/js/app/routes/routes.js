import React from "react";
import { createBrowserRouter } from "react-router-dom";

import { Navbar, Sidebar, Footer, Header } from "../components";
import { Home, Body, Profile, NotFound, Posts } from "../views";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        {/* <Navbar /> */}
        <Header />
        <Sidebar />
        <Home />
        <Footer />
      </>
    ),
    children: [
      {
        path: "/",
        element: <Body />,
      },
      {
        path: "/:slug_name",
        element: <Body />,
      },
      {
        path: "profile/:slug_name",
        element: <Profile />,
      },
      {
        path: "posts/:slug_name",
        element: <Posts />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);
