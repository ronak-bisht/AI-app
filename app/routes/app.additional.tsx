
import React, { useState } from 'react';
import ImageEditor from '../component/main';
import SidebarLayout from '../component/sidebar';
import { authenticate } from '@/shopify.server';
import { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
export const loader = async ({ request }: LoaderFunctionArgs) => {
 const {session}= await authenticate.admin(request);


  return session.id;
};
const Page = () => {
const userId=useLoaderData()


  const [selectedTheme, setSelectedTheme] = useState('Studio');

  const handleThemeChange = (theme:any) => {
    setSelectedTheme(theme);
  };

  return (
    <div className="flex">
      <div className="w-[20%]">
        <SidebarLayout onThemeChange={handleThemeChange} selectedTheme={selectedTheme} userId={userId} />
      </div>
      <div className="w-[80%]">
        <ImageEditor theme={selectedTheme} userId={userId}/>
      </div>
    </div>
  );
};

export default Page;