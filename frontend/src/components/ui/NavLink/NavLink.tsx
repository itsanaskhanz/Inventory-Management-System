import React from "react";
import { NavLinkProps } from "./NavLink.types";
import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { activeStyles, baseStyles } from "./NavLink.styles";
const NavLink = ({ children, className, href, ...props }: NavLinkProps) => {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      className={clsx(className, baseStyles, pathname === href && activeStyles)}
      {...props}
    >
      {children}
    </Link>
  );
};

export default NavLink;
