import React from "react";
import Navbar from "./Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div>
      <Navbar />
      <div style={{ paddingTop: '64px' }}>
        <main>{children}</main>
      </div>
    </div>
  );
};

export default Layout;
