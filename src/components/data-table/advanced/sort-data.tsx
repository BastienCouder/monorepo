import { Container, Text } from '@/components/container';
import { DropdownMenuItem } from '@/components/ui';
import { ArrowRight } from 'lucide-react';
import React from 'react';

interface SortProps {
    sortOrder: 'alpha' | 'reverse-alpha' | 'date-asc' | 'date-desc';
    setSortOrder: (order: 'alpha' | 'reverse-alpha' | 'date-asc' | 'date-desc') => void;
}

const Sort = ({ sortOrder, setSortOrder }: SortProps) => {
    return (
        <>
            <DropdownMenuItem asChild>
                <Container.Div onClick={() => setSortOrder('alpha')} className='flex justify-between'>
                    <Text.Span>Alphabétique</Text.Span>
                    <Text.Small className='flex gap-1 items-center text-foreground/70'>A <ArrowRight size={10} /> Z</Text.Small>
                </Container.Div>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
                <Container.Div onClick={() => setSortOrder('reverse-alpha')} className='flex justify-between'>
                    <Text.Span >Désalphabétique</Text.Span>
                    <Text.Small className='text-foreground/70 flex gap-1 items-center text-foreground/70'>Z <ArrowRight size={10} /> A</Text.Small>
                </Container.Div>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
                <Container.Div onClick={() => setSortOrder('date-asc')} className='flex justify-between'>
                    <Text.Span >Anciénnement</Text.Span>
                    <Text.Small className='text-foreground/70 flex gap-1 items-center text-foreground/70'>Ancien <ArrowRight size={10} /> Récent </Text.Small>
                </Container.Div>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
                <Container.Div onClick={() => setSortOrder('date-desc')} className='flex justify-between'>
                    <Text.Span >Réçamment</Text.Span>
                    <Text.Small className='text-foreground/70 flex gap-1 items-center text-foreground/70'>Récent <ArrowRight size={10} /> Ancien </Text.Small>
                </Container.Div>
            </DropdownMenuItem>

            {/* 
            <Button
                onClick={() => setSortOrder('alpha')}
                className={sortOrder === 'alpha' ? 'active' : ''}
            >
                Trier A-Z
            </Button>
            <Button
                onClick={() => setSortOrder('reverse-alpha')}
                className={sortOrder === 'reverse-alpha' ? 'active' : ''}
            >
                Trier Z-A
            </Button>
            <Button
                onClick={() => setSortOrder('date-asc')}
                className={sortOrder === 'date-asc' ? 'active' : ''}
            >
                Date: Plus ancien au plus récent
            </Button>
            <Button
                onClick={() => setSortOrder('date-desc')}
                className={sortOrder === 'date-desc' ? 'active' : ''}
            >
                Date: Plus récent au plus ancien
            </Button> */}
        </>
    );
};

export default Sort;
