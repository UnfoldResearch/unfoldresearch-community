import { printDateContent } from 'unfold-utils';
import { Icon, Checkbox, DateInput, Input, TextArea, GFML, SectionToggle } from 'unfold-ui';
import { ContentDescriptor } from '.';

const FundingContentComp: ContentDescriptor<'funding'>['component'] = ({ data, setData, isPreview }) => {
  if (isPreview) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1">
          <Icon icon="wallet" size={12} />
          <span className="font-bold">Funding amount:</span> {data.fundingAmount}
        </div>
        <div className="flex items-center gap-1">
          <Icon icon="calendar-dates" size={12} />
          <span className="font-bold">Duration:</span> {data.fundingDuration}
        </div>
        {data.dueDate && (
          <div className="flex items-center gap-1">
            <Icon icon="clock" size={12} />
            <span className="font-bold">Due date:</span>{' '}
            {data.noDueDate ? 'permanently open' : printDateContent(data.dueDate)}
          </div>
        )}
        <div className=" flex items-center gap-1">
          <Icon icon="pin" size={12} />
          <span className="font-bold">Location:</span> {data.location}
        </div>

        <GFML text={data.text} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-flow-col gap-2">
        <SectionToggle inert header={<span className="mb-0.5 font-semibold text-gray-700">Funding amount</span>}>
          <Input
            value={data.fundingAmount}
            onChange={(e) => setData({ ...data, fundingAmount: e.target.value })}
            placeholder="Amount"
            className="w-full"
          />
        </SectionToggle>

        <SectionToggle inert header={<span className="mb-0.5 font-semibold text-gray-700">Duration of funding</span>}>
          <Input
            value={data.fundingDuration}
            onChange={(e) => setData({ ...data, fundingDuration: e.target.value })}
            placeholder="Duration"
            className="w-full"
          />
        </SectionToggle>
      </div>

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

      <SectionToggle inert header={<span className="mb-0.5 font-semibold text-gray-700">Location</span>}>
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
      </SectionToggle>

      <SectionToggle inert header={<span className="mb-0.5 font-semibold text-gray-700">Funding details</span>}>
        <TextArea
          rows={10}
          placeholder="More details about this funding opportunity..."
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

const DESCRIPTOR: ContentDescriptor<'funding'> = {
  nextStepFn: (data) => {
    if (!data.fundingAmount) {
      return 'Funding amount not set';
    }
    if (!data.fundingDuration) {
      return 'Duration of funding not set';
    }
    if (!data.text) {
      return 'Details are empty';
    }
    return null;
  },
  matchFn: () => true,
  component: FundingContentComp,
  default: {
    text: '',
    dueDate: '',
    fundingAmount: '',
    fundingDuration: '',
    location: '',
    noDueDate: false,
  },
};

export default DESCRIPTOR;
