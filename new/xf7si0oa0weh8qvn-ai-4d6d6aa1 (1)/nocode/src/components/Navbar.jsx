import { Link } from 'react-router-dom';
import { ImageIcon, HomeIcon, MicIcon, LampIcon, BookOpenIcon, GraduationCapIcon } from 'lucide-react';

const Navbar = () => {
  const navItems = [
    { title: "主页", to: "/", icon: <HomeIcon className="h-5 w-5" /> },
    { title: "识别猫叫意图", to: "/cat-audio", icon: <MicIcon className="h-5 w-5" /> },
    { title: "猫咪图片分析", to: "/cat-image", icon: <ImageIcon className="h-5 w-5" /> },
    { title: "猫狗沟通", to: "/pet-communication", icon: <LampIcon className="h-5 w-5" /> },
    { title: "学习猫语", to: "/cat-language", icon: <BookOpenIcon className="h-5 w-5" /> },
    { title: "猫咪学人语", to: "/human-language-learning", icon: <GraduationCapIcon className="h-5 w-5" /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-transparent shadow-none">
      {/* 两边半圆的装饰元素 */}
      <div className="absolute bottom-0 left-0 w-8 h-8 bg-transparent rounded-t-full translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-8 h-8 bg-transparent rounded-t-full translate-y-1/2"></div>
      
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-center">
          <div className="flex space-x-1 bg-sky-100 rounded-full px-2 py-2 shadow-lg">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex flex-col items-center justify-center px-4 py-2 rounded-full hover:bg-sky-200 transition-colors duration-200 text-sky-800"
              >
                <div className="mb-1">{item.icon}</div>
                <span className="text-xs font-medium md:inline hidden">{item.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
