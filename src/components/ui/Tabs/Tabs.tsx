import * as RadixTabs from '@radix-ui/react-tabs';
import { ReactNode } from 'react';

type TabsProps = {
  label: string;
  trigger1: ReactNode;
  trigger2: ReactNode;
  children1: ReactNode;
  children2: ReactNode;
  className?: string;
  closeOnOverlayClick?: boolean;
  activeTab?: string;
};

const Tabs: React.FC<TabsProps> = ({
  label,
  trigger1,
  trigger2,
  children1,
  children2,
  activeTab,
}) => {
  return (
    <RadixTabs.Root className='flex flex-col w-full ' defaultValue='tab1'>
      <RadixTabs.List className={'flex shrink-0'} aria-label={label}>
        <RadixTabs.Trigger
          className={`flex justify-center w-full items-center text-sm font-semibold border-b py-10 ${
            activeTab === 'tab1'
              ? 'border-b-3 border-primary-300'
              : 'border-neutral-300 '
          }`}
          value='tab1'
        >
          {trigger1}
        </RadixTabs.Trigger>
        <RadixTabs.Trigger
          className={`flex justify-center w-full items-center text-sm font-semibold border-b border-neutral-300 py-10 ${
            activeTab === 'tab2'
              ? 'border-b-3 border-primary-300'
              : 'border-neutral-300 '
          }`}
          value='tab2'
        >
          {trigger2}
        </RadixTabs.Trigger>
      </RadixTabs.List>
      <RadixTabs.Content
        className='flex flex-col justify-center items-start w-full'
        value='tab1'
      >
        {children1}
      </RadixTabs.Content>
      <RadixTabs.Content
        className='flex flex-col justify-center items-start w-full'
        value='tab2'
      >
        {children2}
      </RadixTabs.Content>
    </RadixTabs.Root>
  );
};

export default Tabs;
