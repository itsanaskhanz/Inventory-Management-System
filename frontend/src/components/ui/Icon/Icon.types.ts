import { Icons } from "@/lib/icons";

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: keyof typeof Icons;
  size?: keyof Sizes;
  color?: string;
  className?: string;
}

export interface Sizes {
  sm: number;
  md: number;
  lg: number;
  xl: number;
  "2xl": number;
}
