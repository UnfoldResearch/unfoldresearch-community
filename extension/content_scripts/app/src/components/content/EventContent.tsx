import { printDateContent } from 'unfold-utils';
import { Icon, Checkbox, DateInput, Input, TextArea, GFML, SectionToggle } from 'unfold-ui';
import { ContentDescriptor } from '.';

const EventContentComp: ContentDescriptor<'event'>['component'] = ({ data, setData, isPreview }) => {
  if (isPreview) {
    return (
      <div className="flex flex-col gap-2">
        <div className=" flex items-center gap-1">
          <Icon icon="pin" size={12} />
          <span className="font-bold">Location:</span> {data.location} (
          {data.locationHasRemote ? 'has online' : 'has no online'})
        </div>
        <div className="flex items-center gap-1">
          <Icon icon="calendar-dates" size={12} />
          <span className="font-bold">Date:</span> {printDateContent(data.dueDate)}
        </div>
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
            label="Has online"
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

      <SectionToggle inert header={<span className="mb-0.5 font-semibold text-gray-700">Date</span>}>
        <DateInput
          value={data.dueDate}
          onChange={(date) =>
            setData({
              ...data,
              dueDate: JSON.stringify(date),
            })
          }
        />
      </SectionToggle>

      <SectionToggle inert header={<span className="mb-0.5 font-semibold text-gray-700">Event details</span>}>
        <TextArea
          rows={10}
          placeholder="More details about this event..."
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

const DESCRIPTOR: ContentDescriptor<'event'> = {
  nextStepFn: (data) => {
    if (!data.location) {
      return 'Location is empty';
    } else if (!data.dueDate) {
      return 'Due date is not set';
    }
    return null;
  },
  matchFn: () => true,
  component: EventContentComp,
  default: {
    text: '',
    dueDate: '',
    location: '',
    locationHasRemote: false,
  },
};

export default DESCRIPTOR;
