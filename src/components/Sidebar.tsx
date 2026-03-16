"use client"
import { Film, Tv } from 'lucide-react';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export function Sidebar() {
  const location = usePathname();
  const [focusedIndex, setFocusedIndex] = useState(0);

  const menuItems = [
    { icon: Film, label: 'Películas', path: '/movies' },
  ];

  const isActive = (path: string) => {
    if (path === '/browse') {
      return location === '/browse';
    }
    return location.startsWith(path);
  };

  return (
    <div className="fixed left-0 top-0 h-full w-20 bg-black/95 flex flex-col items-center py-8 z-50">
      {/* Netflix Logo */}
      <div className="mb-12">
        <Image src="/logo.png" alt="Miteve" width={40} height={40} />
      </div>

      {/* Menu Items */}
      <nav className="flex-1 flex flex-col gap-8">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex flex-col items-center gap-1 transition-all duration-200 relative group ${
                active ? 'text-white' : 'text-gray-400 hover:text-white'
              }`}
              onFocus={() => setFocusedIndex(index)}
              tabIndex={0}
            >
              {active && (
                <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#e50914] rounded-r" />
              )}
              <Icon className={`w-6 h-6 transition-transform group-hover:scale-110 ${active ? 'scale-110' : ''}`} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}