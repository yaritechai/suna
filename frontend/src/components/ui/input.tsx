import * as React from 'react';

import { cn } from '@/lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'file:text-base-content placeholder:text-base-content/60 selection:bg-primary selection:text-primary-content bg-base-100 border-base-300 flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base shadow-sm transition-[color,box-shadow,border-color] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm text-base-content',
        'focus-visible:border-primary focus-visible:ring-primary/20 focus-visible:ring-2',
        'hover:border-base-content/40',
        'aria-invalid:ring-error/20 aria-invalid:border-error',
        className,
      )}
      {...props}
    />
  );
}

export { Input };
