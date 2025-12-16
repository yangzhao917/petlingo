import { HomeIcon, MicIcon, ImageIcon, LampIcon as SwapIcon, BookOpenIcon, GraduationCapIcon } from 'lucide-react'
import Index from "./pages/Index.jsx";
import CatAudio from "./pages/CatAudio.jsx";
import CatImage from "./pages/CatImage.jsx";
import PetCommunication from "./pages/PetCommunication.jsx";
import CatLanguage from "./pages/CatLanguage.jsx";
import CatLanguageLevel from "./pages/CatLanguageLevel.jsx";
import HumanLanguageLearning from "./pages/HumanLanguageLearning.jsx";
import PetExpert from "./pages/PetExpert.jsx";

/**
* Central place for defining the navigation items. Used for navigation components and routing.
*/
export const navItems = [
{
    title: "主页",
    to: "/",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <Index />,
},
{
    title: "识别猫叫意图",
    to: "/cat-audio",
    icon: <MicIcon className="h-4 w-4" />,
    page: <CatAudio />,
},
{
    title: "猫咪图片分析",
    to: "/cat-image",
    icon: <ImageIcon className="h-4 w-4" />,
    page: <CatImage />,
},
{
    title: "猫狗沟通",
    to: "/pet-communication",
    icon: <SwapIcon className="h-4 w-4" />,
    page: <PetCommunication />,
},
{
    title: "学习猫语",
    to: "/cat-language",
    icon: <BookOpenIcon className="h-4 w-4" />,
    page: <CatLanguage />,
},
{
    title: "学习猫语关卡",
    to: "/cat-language/:id",
    icon: <BookOpenIcon className="h-4 w-4" />,
    page: <CatLanguageLevel />,
},
{
    title: "宠物学人话",
    to: "/human-language-learning",
    icon: <GraduationCapIcon className="h-4 w-4" />,
    page: <HumanLanguageLearning />,
},
{
    title: "宠物专家询问",
    to: "/pet-expert",
    icon: <BookOpenIcon className="h-4 w-4" />,
    page: <PetExpert />,
},
];
