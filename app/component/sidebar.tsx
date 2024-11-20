import React, { useEffect, useState } from 'react';
import { cn } from "@/lib/utils";
import { ImagePlus, FolderOpen, BarChart3 } from "lucide-react";
import ResoucePicker from "./resoucePicker"
import axios from 'axios';
import { Console } from 'console';

const ThemeCard = ({ 
  title, 
  bgClass, 
  onSelect, 
  isSelected 
}: { 
  title: string; 
  bgClass: string;
  onSelect: () => void;
  isSelected: boolean;
}) => (
  <div 
    onClick={onSelect}
    className={cn(
      "relative rounded-lg overflow-hidden w-full aspect-square mb-4 group cursor-pointer",
      bgClass,
      isSelected ? "ring-2 ring-primary" : "hover:ring-2 hover:ring-primary"
    )}
  >
    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
    <h3 className="absolute bottom-2 left-2 text-white font-semibold text-md">{title}</h3>
  </div>
);

const SidebarLayout = ({ 
  onThemeChange, 
  selectedTheme,
  userId
}: { 
  onThemeChange: (theme: string) => void;
  selectedTheme: string;
  userId:any;
}) => {
  const [activeSection, setActiveSection] = useState<'create' | 'assets' | 'results'>('create');
  const [assets, setAssets] = useState([]);
  const [result, setResults] = useState([]);

  useEffect(() => {
    async function getAssets() {
      const { data } = await axios.get(`/api/getAssets?userId=${userId}`);
      setAssets(data.assets);
      setResults(data.results);
    }
    getAssets();
  }, []);

  const sidebarItems = [
    { id: 'create', label: 'Create', icon: ImagePlus },
    { id: 'assets', label: 'Assets', icon: FolderOpen },
    { id: 'results', label: 'Results', icon: BarChart3 },
  ] as const;

  const themes = [
    { title: 'Studio', bgClass: 'bg-amber-100' },
    { title: 'Marble', bgClass: 'bg-gray-100' },
    { title: 'Tabletop', bgClass: 'bg-neutral-200' },
    { title: 'Cafe', bgClass: 'bg-slate-200' },
    { title: 'Kitchen', bgClass: 'bg-green-100' },
  ];
  console.log(result)
  const renderContent = () => {
    switch (activeSection) {
      case 'create':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Themes</h2>
          
            <div className="grid grid-cols-2 gap-4">
              {themes.map((theme) => (
                <ThemeCard 
                  key={theme.title} 
                  {...theme} 
                  onSelect={() => onThemeChange(theme.title)}
                  isSelected={selectedTheme === theme.title}
                />
              ))}
            </div>
          </div>
        );
      case 'assets':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Your Assets</h2>
            <div className="grid grid-cols-2 gap-4">
              {assets && assets.length > 0 && assets.map((asset, i) => (
                <img
                  key={i} 
                  src={`https://pub-0ae2a8f797e84fae8911ca82cf00112d.r2.dev/${asset}`} 
                  alt='photo' 
                  width={300} 
                  height={300}
                  draggable={false}
                />
              ))}
            </div>
          </div>
        );
      case 'results':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Generated Results</h2>
            <div className="grid grid-cols-2 gap-4">
              {result && result.length > 0 && result.map((resultItem, i) => (
                <img
                  key={i} 
                  src={`https://pub-0ae2a8f797e84fae8911ca82cf00112d.r2.dev/${resultItem}`} 
                  alt='photo' 
                  width={300} 
                  height={300}
                  draggable={false}
                />
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-white">
      <div className="w-20 bg-gray-100 border-r flex flex-col items-center py-4">

        {sidebarItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveSection(id)}
            className={cn(
              "w-14 h-14 mb-2 flex flex-col items-center justify-center rounded-lg transition-colors",
              activeSection === id 
                ? "bg-primary text-primary-foreground" 
                : "text-gray-600 hover:bg-gray-200"
            )}
          >
            <Icon className="h-6 w-6" />
            <span className="text-xs mt-1">{label}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default SidebarLayout;