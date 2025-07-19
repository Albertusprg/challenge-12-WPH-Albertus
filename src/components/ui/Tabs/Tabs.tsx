import { cn } from '@/lib/utils';
import * as RadixTabs from '@radix-ui/react-tabs';
import { ReactNode } from 'react';

type TabsProps = {
  label: string;
  trigger1: string;
  trigger2: string;
  children1: ReactNode;
  children2: ReactNode;
  className?: string;
  closeOnOverlayClick?: boolean;
};

const Tabs: React.FC<TabsProps> = ({
  label,
  trigger1,
  trigger2,
  children1,
  children2,
}) => {
  return (
    <RadixTabs.Root className='flex flex-col w-300 ' defaultValue='tab1'>
      <RadixTabs.List
        className={cn('flex shrink-0 border-b-neutral-300')}
        aria-label={label}
      >
        <RadixTabs.Trigger
          className='flex justify-center items-center text-sm font-semibold'
          value='tab1'
        >
          {trigger1}
        </RadixTabs.Trigger>
        <RadixTabs.Trigger
          className='flex justify-center items-center text-sm font-semibold'
          value='tab2'
        >
          {trigger2}
        </RadixTabs.Trigger>
      </RadixTabs.List>
      <RadixTabs.Content
        className='flex flex-col justify-center items-center'
        value='tab1'
      >
        {children1}
      </RadixTabs.Content>
      <RadixTabs.Content
        className='flex flex-col justify-center items-center'
        value='tab2'
      >
        {children2}
      </RadixTabs.Content>
    </RadixTabs.Root>
  );
};

export default Tabs;
