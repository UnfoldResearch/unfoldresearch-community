import { ReactNode } from 'react';

const Button = ({ children }: { children?: ReactNode }) => {
  return <button className="block w-full px-3 py-1 text-left hover:bg-bp-gray-1">{children}</button>;
};

// blue/gray badge

const Popup = (): JSX.Element => {
  return (
    <div
      className="text-xs text-gray-700"
      style={{
        width: '180px',
      }}
    >
      <div className="bg-gray-100 px-3 py-1">
        unfold <span className="font-semibold">research</span>
      </div>
      <div>
        <Button>Don't show for this page</Button>
        <Button>Don't show for this domain</Button>
        <hr />
        <Button>All Settings</Button>
      </div>
    </div>
  );
};

export default Popup;
