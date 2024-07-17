import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { json, LinksFunction, LoaderFunctionArgs } from "@remix-run/node";

import stylesheet from "~/tailwind.css?url";
import Header from "./components/Header";
import { createSupabaseServerClient } from "./supabase.server";
import Footer from "./components/Footer";
import { CurrentTrackProvider } from "./context/CurrentTrackContext";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { supabaseClient } = createSupabaseServerClient(request);
  const {
    data: { user },
  } = await supabaseClient.auth.getUser();
  if (!user) {
    return json(null);
  }
  return json({
    email: user.email,
  });
};

export function Layout({ children }: { children: React.ReactNode }) {
  const user = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="flex flex-col h-screen">
        <CurrentTrackProvider>
          <Header user={user} />
          <div className="flex-1 p-4 overflow-auto">{children}</div>
          <Footer />
        </CurrentTrackProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
