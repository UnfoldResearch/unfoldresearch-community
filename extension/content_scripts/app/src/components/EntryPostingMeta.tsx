import { Entry, LicenseOptionsMeta } from 'unfold-core';
import { formatTime, formatTimeDiff } from 'unfold-utils';
import { Icon, EntryAuthor } from 'unfold-ui';
import { Popover2 } from '@blueprintjs/popover2';
import cx from 'classnames';
import { useNavigation } from '../utils/useNavigation';

type EntryAuthorMetaProps = {
  entry: Entry;
  className?: string;
  type: 'short' | 'posted';
};

export const EntryPostingMeta = ({
  className,
  entry: { createdAt: _createdAt, createdBy, license, licenseDescription },
  type,
}: EntryAuthorMetaProps): JSX.Element => {
  const { goToUser } = useNavigation();

  const goToAuthor = () => {
    goToUser(createdBy.id);
  };

  const createdAt = new Date(_createdAt);

  const licenseDetails = (
    <div className="flex flex-col gap-1 p-1 text-xxs text-gray-600">
      <div className="text-xs font-bold">License:</div>
      <div className="text-xs">{LicenseOptionsMeta[license].label}</div>
      {license === 'custom' && <div>{licenseDescription}</div>}
    </div>
  );
  const licenseInfo = (
    <Popover2
      content={licenseDetails}
      minimal
      position="top-left"
      interactionKind="hover"
      className="overflow-hidden rounded"
    >
      <Icon icon="new-release" size={12} />
    </Popover2>
  );

  const timeDiff = formatTimeDiff(
    new Date(createdAt).getTime(),
    (
      {
        short: {
          format: 's',
          space: false,
        },
        posted: {
          format: 'l',
          space: true,
        },
      } as const
    )[type],
  );

  const classes = cx('flex items-center justify-between text-xxs text-gray-400', className);

  switch (type) {
    case 'short':
      return (
        <div className={classes}>
          <div>
            {timeDiff} by <EntryAuthor user={createdBy} onClick={goToAuthor} />
          </div>
        </div>
      );
    case 'posted':
      return (
        <div className={classes}>
          <div>
            posted <span title={formatTime(createdAt, 'M D, Y h:m')}>{timeDiff}</span> by{' '}
            <EntryAuthor user={createdBy} onClick={goToAuthor} />
          </div>
          {licenseInfo}
        </div>
      );
  }
};
