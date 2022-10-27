import { printDateContent } from 'unfold-utils';
import { Icon, Checkbox, DateInput, Input, TextArea, GFML, SectionToggle } from 'unfold-ui';
import { ContentDescriptor } from '.';

const JobContentComp: ContentDescriptor<'job'>['component'] = ({ data, setData, isPreview }) => {
  if (isPreview) {
    return (
      <div className="flex flex-col gap-2">
        <div className=" flex items-center gap-1">
          <Icon icon="pin" size={12} />
          <span className="font-bold">Location:</span> {data.location} (
          {data.locationHasRemote ? 'remote allowed' : 'no remote'})
        </div>
        {data.dueDate && (
          <div className="flex items-center gap-1">
            <Icon icon="clock" size={12} />
            <span className="font-bold">Due date:</span>{' '}
            {data.noDueDate ? 'permanently open' : printDateContent(data.dueDate)}
          </div>
        )}
        <GFML text={data.text} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <SectionToggle inert header={<span className="mb-0.5 font-semibold text-gray-700">Location</span>}>
        <div className="grid grid-cols-1m gap-2">
          <Input
            value={data.location}
            placeholder="Location"
            className="w-full"
            onChange={(e) =>
              setData({
                ...data,
                location: e.target.value,
              })
            }
          />
          <Checkbox
            label="Remote allowed"
            value={data.locationHasRemote}
            onChange={(value) =>
              setData({
                ...data,
                locationHasRemote: value,
              })
            }
          />
        </div>
      </SectionToggle>

      <SectionToggle inert header={<span className="mb-0.5 font-semibold text-gray-700">Due date</span>}>
        <div className="flex items-center gap-2">
          <DateInput
            value={data.noDueDate ? { day: null, month: null, year: null } : data.dueDate}
            onChange={(date) =>
              setData({
                ...data,
                dueDate: JSON.stringify(date),
              })
            }
            disabled={data.noDueDate}
          />
          <Checkbox
            label="Permanently open"
            value={data.noDueDate}
            onChange={(value) =>
              setData({
                ...data,
                noDueDate: value,
              })
            }
          />
        </div>
      </SectionToggle>

      <SectionToggle inert header={<span className="mb-0.5 font-semibold text-gray-700">Job details</span>}>
        <TextArea
          rows={10}
          placeholder="More details about this openning..."
          className="min-h-[100px] w-full"
          value={data.text}
          onChange={(e) => {
            setData({
              ...data,
              text: e.target.value,
            });
          }}
        />
      </SectionToggle>
    </div>
  );
};

const DESCRIPTOR: ContentDescriptor<'job'> = {
  nextStepFn: (data) => {
    if (!data.location) {
      return 'Location is empty';
    } else if (!data.dueDate) {
      return 'Due date is not set';
    }
    return null;
  },
  matchFn: () => true,
  component: JobContentComp,
  default: {
    text: '',
    dueDate: '',
    noDueDate: false,
    location: '',
    locationHasRemote: false,
  },
};

export default DESCRIPTOR;
