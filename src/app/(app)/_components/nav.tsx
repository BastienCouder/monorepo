'use client';
import Link from 'next/link';
import React from 'react';
import { appLinks } from '@/config/links';
import { cn } from '@/lib/utils'; // Assurez-vous que ces fonctions sont correctement importées
import { buttonVariants } from '@/components/ui/button';
import { usePathname } from 'next/navigation';

export default function Nav() {
  const pathname = usePathname(); // Utilisé pour vérifier si le lien est actif

  return (
    <nav>
      {appLinks.map((link, index) => (
        // Ajoutez un `return` ici pour retourner l'élément Link
        <Link
          key={index}
          href={link.route}
          // Ajoutez `passHref` si votre composant Link personnalisé ou stylé nécessite un attribut href
          passHref
          className={cn(
            buttonVariants({
              variant: 'ghost',
              size: 'default',
            }),
            pathname === link.route &&
              'dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white border-r-4 text-primary border-primary rounded-r-none',
            'justify-start hover:text-primary'
          )}
        >
          {/* Assurez-vous que l'icône est correctement rendue. Si link.icon est un composant, cela devrait fonctionner comme prévu. */}
          {React.createElement(link.icon, { className: 'mr-2 h-4 w-4' })}
          {link.title}
          {link.label && (
            <span
              className={cn(
                'ml-auto',
                pathname === link.route && 'text-background dark:text-white'
              )}
            >
              {link.label}
            </span>
          )}
        </Link>
      ))}
    </nav>
  );
}
