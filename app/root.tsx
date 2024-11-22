import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { json } from "@remix-run/react";


export function links() {
  return [{ rel: "stylesheet", href: "/app/styles/tailwind.css" }]
}
// export async function loader() {
//   return json({
//     ENV: {
//       IMAGE_URL: process.env.IMAGE_URL,
    
//     },
//   });
// }
export default function App() {
  // const data = useLoaderData<typeof loader>();
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="preconnect" href="https://cdn.shopify.com/" />
        <link
          rel="stylesheet"
          href="https://cdn.shopify.com/static/fonts/inter/v4/styles.css"
        />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        {/* <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(
              data.ENV
            )}`,
          }}
        /> */}
        <Scripts />
      </body>
    </html>
  );
}
