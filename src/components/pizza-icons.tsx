
import type { SVGProps } from "react";

export const PizzaBaseIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" strokeDasharray="2 2" />
  </svg>
);

export const PizzaSauceIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M5.5 14.5c4.66-4.63 12.33-1.63 13 0" />
    <path d="M5.5 11.5c4.66-4.63 12.33-1.63 13 0" />
    <path d="M5.5 17.5c4.66-4.63 12.33-1.63 13 0" />
    <path d="M4 19h16" />
  </svg>
);

export const CheeseIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M20.2 7.8c-1.3-2.4-3.5-4-6.2-4.4-2.7-.4-5.4.6-7.3 2.5-1.9 1.9-2.9 4.6-2.5 7.3.4 2.7 2 4.9 4.4 6.2 2.4 1.3 5.2 1.6 7.8.8l3.6-1.6" />
    <circle cx="16.5" cy="14.5" r="1" fill="currentColor" />
    <circle cx="13" cy="11" r="1" fill="currentColor" />
    <circle cx="10" cy="15" r="1" fill="currentColor" />
  </svg>
);

export const VeggieIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12.6 3.2c.9-1.2 2.4-1.2 3.3 0L20 8l-6 10-6-10 4.6-4.8Z"/><path d="M12 8v13"/></svg>
);

export const MeatIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M11.5 6.236a2.93 2.93 0 0 1 4.256.163 2.903 2.903 0 0 1 .644 2.197 3.01 3.01 0 0 1-1.33 2.053 3.078 3.078 0 0 1-2.23.111l-3.23.36c-1.333.149-2.625.768-3.696 1.748a5.13 5.13 0 0 0-1.465 3.655 5.064 5.064 0 0 0 4.966 5.228 5.12 5.12 0 0 0 4.934-3.832 5.151 5.151 0 0 0-1.558-5.322l.06-.053a2.922 2.922 0 0 1 2.92-4.14Z"/></svg>
);

export const PizzaSummaryIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M15 11h.01"/><path d="M11 15h.01"/><path d="M16 16h.01"/><path d="M21.34 12.42a23.1 23.1 0 0 1-8.32 8.32A23.1 23.1 0 0 1 2.66 12.42a23.1 23.1 0 0 1 8.32-8.32A23.1 23.1 0 0 1 21.34 12.42Z"/><path d="m21.34 12.42-8.32 8.32"/><path d="m2.66 12.42 8.32-8.32"/></svg>
);

export const SliceCrafterLogo = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M12 2L2 22h20L12 2z" />
        <path d="M12 12c-3 3-6 5-8 5" />
        <path d="M12 12c3 3 6 5 8 5" />
        <circle cx="12" cy="7" r="1" fill="currentColor" />
        <circle cx="16" cy="14" r="1" fill="currentColor" />
        <circle cx="8" cy="14" r="1" fill="currentColor" />
    </svg>
)
