import { ReviewTag, ReviewTagMeta, ReviewTagOptions } from 'unfold-core';
import { TextArea, GFML } from 'unfold-ui';
import cx from 'classnames';
import { ContentDescriptor } from '.';

const TAG_STYLES: Record<typeof ReviewTagMeta[ReviewTag]['type'], string> = {
  positive: 'text-green-700',
  neutral: '',
  negative: 'text-red-600',
} as const;

const ReviewContentComp: ContentDescriptor<'review'>['component'] = ({ data, setData, isPreview }) => {
  if (isPreview) {
    return (
      <div>
        <div className="mb-3 flex flex-wrap items-center gap-1 text-xxs text-gray-500">
          {ReviewTagOptions.map((tag) => {
            const isSelected = data.review_tags.includes(tag);
            if (!isSelected) {
              return null;
            }

            return (
              <span
                key={tag}
                className={cx(
                  'pointer-events-none rounded border border-gray-300 bg-bp-gray-1 px-1 py-0.5',
                  TAG_STYLES[ReviewTagMeta[tag].type],
                )}
              >
                {ReviewTagMeta[tag].label}
              </span>
            );
          })}
        </div>

        <GFML text={data.text} />
      </div>
    );
  }

  return (
    <div>
      <TextArea
        rows={10}
        className="min-h-[100px] w-full"
        placeholder="Write your review using Markdown and KaTeX..."
        value={data.text}
        onChange={(e) => {
          setData({
            ...data,
            text: e.target.value,
          });
        }}
      />

      <div className="my-2 flex flex-wrap justify-center gap-1 text-xxs text-gray-500">
        {ReviewTagOptions.map((tag) => {
          const isSelected = data.review_tags.includes(tag);
          return (
            <span
              key={tag}
              className={cx(
                'cursor-pointer rounded border px-1 py-0.5 hover:bg-gray-200',
                TAG_STYLES[ReviewTagMeta[tag].type],
                {
                  'border-gray-300 bg-gray-100': isSelected,
                  'border-transparent': !isSelected,
                },
              )}
              onClick={() => {
                setData({
                  ...data,
                  review_tags: isSelected ? data.review_tags.filter((t) => t !== tag) : [...data.review_tags, tag],
                });
              }}
            >
              {ReviewTagMeta[tag].label}
            </span>
          );
        })}
      </div>
    </div>
  );
};

const DESCRIPTOR: ContentDescriptor<'review'> = {
  matchFn: () => true,
  nextStepFn: (data) => {
    if (data.text.length < 10) {
      return 'Review too short';
    }
    if (data.review_tags.length < 1) {
      return 'No review tags selected';
    }
    return null;
  },
  component: ReviewContentComp,
  default: {
    text: '',
    review_tags: [],
  },
};

export default DESCRIPTOR;
