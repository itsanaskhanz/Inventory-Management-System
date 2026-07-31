"use client";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { activeStyles, baseStyles } from "./NavLink.styles";
import { NavLinkProps } from "./NavLink.types";
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
