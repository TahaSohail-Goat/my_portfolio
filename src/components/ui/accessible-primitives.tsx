import * as React from "react";

import { cn } from "@/lib/utils";

export const FluidContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("responsive-container", className)} {...props} />
));
FluidContainer.displayName = "FluidContainer";

export const ResponsiveGrid = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("responsive-grid", className)} {...props} />
));
ResponsiveGrid.displayName = "ResponsiveGrid";

export const AccessibleButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, type = "button", ...props }, ref) => (
  <button ref={ref} type={type} className={cn("interaction-target focus-ring", className)} {...props} />
));
AccessibleButton.displayName = "AccessibleButton";

export type AccessibleLinkProps = Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "href"
> & { href: string };

export const AccessibleLink = React.forwardRef<HTMLAnchorElement, AccessibleLinkProps>(
  ({ className, ...props }, ref) => (
    <a ref={ref} className={cn("interaction-target focus-ring", className)} {...props} />
  ),
);
AccessibleLink.displayName = "AccessibleLink";

export type DecorativeProps = Omit<React.HTMLAttributes<HTMLElement>, "aria-hidden" | "role" | "tabIndex"> & {
  as?: "div" | "span";
};

export function Decorative({ as: Element = "span", className, ...props }: DecorativeProps) {
  return <Element aria-hidden="true" role="presentation" data-decorative="true" className={className} {...props} />;
}
