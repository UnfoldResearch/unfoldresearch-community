import React from 'react';
import { Tag } from 'unfold-core';
import cx from 'classnames';

export const Tags = ({ className, tags }: { tags: Tag[]; className?: string }): JSX.Element | null => {
  if (!tags || tags.length === 0) {
    return null;
  }
  return (
    <div className={cx('flex flex-wrap gap-1 text-xxs text-gray-500', className)}>
      {tags.map((tag) => (
        <span key={tag.id} className="cursor-pointer rounded border bg-gray-100 px-1 py-0.5 hover:bg-gray-200">
          {tag.slug}
        </span>
      ))}
    </div>
  );
};
