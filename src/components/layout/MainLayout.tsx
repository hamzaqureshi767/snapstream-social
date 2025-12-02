import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";
import Header from "./Header";

interface MainLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
}

const MainLayout = ({ children, showHeader = true }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      {showHeader && <Header />}
      <main className="md:ml-[72px] xl:ml-[244px] pt-14 md:pt-0 pb-16 md:pb-0">
        {children}
      </main>
      <BottomNav />
    </div>
  );
};

export default MainLayout;
