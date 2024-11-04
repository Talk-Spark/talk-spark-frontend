import React from "react";
import Link from "next/link";

const Header = () => {
  return (
    <header>
      <nav>
        <Link href={"/"}>Home</Link>|<Link href={"/dashboard"}>DashBoard</Link>|<Link href={"/settings"}>Settings</Link>
      </nav>
    </header>
  );
};

export default Header;
