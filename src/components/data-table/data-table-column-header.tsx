import {
  ArrowDownIcon,
  ArrowUpIcon,
  CaretSortIcon,
  EyeNoneIcon,
} from '@radix-ui/react-icons';
import { type Column } from '@tanstack/react-table';
import React from 'react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (column.getCanSort() || !column.getCanSort()) {
    return (<div className='flex'> <div className={`text-xs bg-primary rounded-md flex text-background px-3 py-2 ${cn(className)}`}> <p className='bg-primary'>{title}</p> </div></div>);
  }

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label={
              column.getIsSorted() === 'desc'
                ? `Classé par ordre décroissant. Cliquez pour trier par ordre croissant.`
                : column.getIsSorted() === 'asc'
                  ? `Tri croissant. Cliquez pour trier par ordre décroissant.`
                  : `Non trié. Cliquez pour trier par ordre croissant.`
            }
            variant="default"
            size="sm"
            className="-ml-3 h-8 data-[state=open]:bg-primary/80"
          >
            <span>{title}</span>
            {column.getIsSorted() === 'desc' ? (
              <ArrowDownIcon className="ml-2 size-4" aria-hidden="true" />
            ) : column.getIsSorted() === 'asc' ? (
              <ArrowUpIcon className="ml-2 size-4" aria-hidden="true" />
            ) : (
              <CaretSortIcon className="ml-2 size-4" aria-hidden="true" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem
            aria-label="Tri croissant"
            onClick={() => column.toggleSorting(false)}
          >
            <ArrowUpIcon
              className="mr-2 size-3.5 text-muted-foreground/70"
              aria-hidden="true"
            />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem
            aria-label="Trier par ordre décroissant"
            onClick={() => column.toggleSorting(true)}
          >
            <ArrowDownIcon
              className="mr-2 size-3.5 text-muted-foreground/70"
              aria-hidden="true"
            />
            Desc
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            aria-label="Cacher la colonne"
            onClick={() => column.toggleVisibility(false)}
          >
            <EyeNoneIcon
              className="mr-2 size-3.5 text-muted-foreground/70"
              aria-hidden="true"
            />
            Cacher
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
