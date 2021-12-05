import { Children, cloneElement, isValidElement } from 'react';
import {
  Tab as ReachTab,
  TabPanel as ReachTabPanel,
  TabPanels as ReachTabPanels,
  useTabsContext,
} from '@reach/tabs';
import cx from 'classnames';

type TabProps = React.ComponentProps<typeof ReachTab>;

type AdminTabProps = TabProps & {
  isSelected: boolean;
};

export function Tab(props: TabProps) {
  const isSelected = (props as AdminTabProps).isSelected;

  return (
    <ReachTab
      {...props}
      className={cx(
        'px-4 py-2',
        isSelected && 'border-b-4 border-sky-200',
        props.className,
      )}
    />
  );
}

type TabPanelProps = React.ComponentProps<typeof ReachTabPanel>;

type AdminTabPanelProps = TabPanelProps & {
  index: number;
};

export function TabPanel({ children, ...props }: TabPanelProps) {
  const { index, ...restProps } = props as AdminTabPanelProps;
  const { selectedIndex } = useTabsContext();

  return (
    <ReachTabPanel {...restProps}>
      {index === selectedIndex ? children : null}
    </ReachTabPanel>
  );
}

type TabPanelsProps = React.ComponentProps<typeof ReachTabPanels>;

export function TabPanels({ children, ...props }: TabPanelsProps) {
  return (
    <ReachTabPanels {...props}>
      {Children.map(children, (child, index) => {
        if (isValidElement(child)) {
          return cloneElement(child, {
            index,
          });
        }
        return child;
      })}
    </ReachTabPanels>
  );
}
