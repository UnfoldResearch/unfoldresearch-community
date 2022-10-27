import cx from 'classnames';
import { Entry } from 'unfold-core';
import { useNavigation } from '../utils/useNavigation';
import { EntryTitle } from './EntryTitle';

export const EntryLinkedTo = ({
  className,
  entry: { parent },
}: {
  entry: Entry;
  className?: string;
}): JSX.Element | null => {
  const { goToBrowse } = useNavigation();

  if (!parent || !parent.id) {
    return null;
  }

  return (
    <span
      className={cx('grid grid-cols-3 items-center text-gray-500', className)}
      style={{
        gridTemplateColumns: 'max-content minmax(auto, max-content) max-content',
      }}
    >
      — at "
      <span
        className="cursor-pointer hover:text-gray-700"
        onClick={() => {
          goToBrowse(parent);
        }}
      >
        <EntryTitle title={parent.title} className="faded" clamp={1} />
      </span>
      "
    </span>
  );
};
