import {ComponentType, Key} from 'react';
import { LucideProps } from 'lucide-react';


export interface MenuItem{
    id: Key | null | undefined;
    href: string;
    icon: ComponentType<LucideProps>;
    label: string;
    children: boolean;
}