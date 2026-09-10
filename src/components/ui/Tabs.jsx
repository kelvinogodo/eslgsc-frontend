import { Tab } from '@headlessui/react';
import clsx from 'clsx';

const Tabs = ({ tabs, children, className }) => {
  return (
    <Tab.Group>
      <div className="">
        <Tab.List
          className={clsx(
            'flex gap-8 overflow-x-auto border-b border-gov-gray-200 text-sm scrollbar-gov',
            'whitespace-nowrap [scrollbar-color:var(--color-gov-blue-300)_transparent]',
            className
          )}
        >
          {tabs.map((tab) => (
            <Tab
              key={tab.value}
              className={({ selected }) =>
                clsx(
                  'flex-none px-1 py-4 font-bold uppercase tracking-wider leading-5 transition-all border-b-2 outline-none',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-gov-focus',
                  selected
                    ? 'border-gov-navy-600 text-gov-navy-900'
                    : 'border-transparent text-gov-gray-500 hover:text-gov-navy-600 hover:border-gov-gray-300'
                )
              }
            >
              {tab.label}
            </Tab>
          ))}
        </Tab.List>
      </div>
      <Tab.Panels className="mt-4">
        {children}
      </Tab.Panels>
    </Tab.Group>
  );
};

const TabPanel = ({ children }) => {
  return (
    <Tab.Panel
      className={clsx(
        'rounded-lg bg-white p-6',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-gov-focus'
      )}
    >
      {children}
    </Tab.Panel>
  );
};

Tabs.Panel = TabPanel;

export default Tabs;
