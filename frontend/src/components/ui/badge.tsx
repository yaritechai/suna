import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-primary focus-visible:ring-primary/50 focus-visible:ring-[3px] aria-invalid:ring-error/20 aria-invalid:border-error transition-[color,box-shadow] overflow-hidden',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-content [a&]:hover:bg-primary/90',
        secondary:
          'border-transparent bg-secondary text-secondary-content [a&]:hover:bg-secondary/90',
        destructive:
          'border-transparent bg-error text-error-content [a&]:hover:bg-error/90 focus-visible:ring-error/20',
        outline:
          'text-base-content [a&]:hover:bg-base-200 [a&]:hover:text-base-content',
        new:
          'text-secondary-content bg-secondary/80 border-secondary',
        beta:
          'text-info-content bg-info/80 border-info',
        highlight:
          'text-success-content bg-success/80 border-success',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'span';

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
