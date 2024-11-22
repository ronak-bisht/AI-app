
import React, { useState } from 'react';
import ImageEditor from '../component/main';
import SidebarLayout from '../component/sidebar';
import { authenticate } from '@/shopify.server';
import { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { json } from "@remix-run/react";
export const loader = async ({ request }: LoaderFunctionArgs) => {
 const {session}= await authenticate.admin(request);


  return {session:session.id,url:process.env.IMAGE_URL};
};
const Page = () => {
const {session:userId,url}=useLoaderData<typeof loader>()
console.log(url)


  const [selectedTheme, setSelectedTheme] = useState('Studio');

  const handleThemeChange = (theme:any) => {
    setSelectedTheme(theme);
  };

  return (
    <div className="flex">
      <div className="w-[20%]">
        <SidebarLayout url={url} onThemeChange={handleThemeChange} selectedTheme={selectedTheme} userId={userId} />
      </div>
      <div className="w-[80%]">
        <ImageEditor url={url} theme={selectedTheme} userId={userId}/>
      </div>
    </div>
  );
};

export default Page;