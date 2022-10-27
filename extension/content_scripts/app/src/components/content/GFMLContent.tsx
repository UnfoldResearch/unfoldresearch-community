import { TextArea, GFML } from 'unfold-ui';
import { ContentDescriptor } from '.';

const GFMLContentComp: ContentDescriptor<'gfml'>['component'] = ({ data, setData, isPreview }) => {
  if (isPreview) {
    return <GFML text={data.text} />;
  }

  return (
    <div>
      <TextArea
        rows={10}
        placeholder="Write here using Markdown and KaTeX..."
        className="min-h-[100px] w-full"
        value={data.text}
        onChange={(e) => {
          setData({
            text: e.target.value,
          });
        }}
      />
    </div>
  );
};

const DESCRIPTOR: ContentDescriptor<'gfml'> = {
  nextStepFn: (data) => {
    if (!data.text) {
      return 'Text is empty';
    }
    return null;
  },
  matchFn: () => true,
  component: GFMLContentComp,
  default: {
    text: '',
  },
};

export default DESCRIPTOR;
