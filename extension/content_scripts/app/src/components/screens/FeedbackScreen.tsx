import { useState } from 'react';
import { FeedbackType, FeedbackTypeMeta, FeedbackTypeOptions } from 'unfold-core';
import { Button, Radio, TextArea } from 'unfold-ui';
import analytics from '../../utils/analytics';
import api from '../../utils/api';
import { useNavigation } from '../../utils/useNavigation';
import { ScreenTitle } from '../ScreenTitle';

export const FeedbackScreen = (): JSX.Element => {
  const { goToHelp } = useNavigation<'browse'>();
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle');
  const [type, setType] = useState<FeedbackType | null>(null);
  const [desc, setDesc] = useState('');
  const btnDisabled = status === 'submitting' || type === null;

  const handleSubmit = async () => {
    if (btnDisabled || type === null) {
      return;
    }
    try {
      setStatus('submitting');
      const res = await api.feedback.feedback({
        type: type,
        text: desc,
      });
      if (!res) {
        return;
      }

      goToHelp();
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div className="h-full p-3 text-xs text-gray-700">
      <ScreenTitle icon="comment-2-text" className="mb-3">
        Feedback
      </ScreenTitle>

      <p>Share with us whatever is on your mind, we'd love to hear you out and learn how we can improve!</p>

      {FeedbackTypeOptions.map((ft) => (
        <div key={ft}>
          <Radio checked={ft === type} onChange={(e) => e.target.checked && setType(ft)}>
            {FeedbackTypeMeta[ft].label}
          </Radio>
          <p className="mt-1 text-xs text-gray-500">{FeedbackTypeMeta[ft].desc}</p>
        </div>
      ))}

      <TextArea
        className="mb-1 w-full"
        placeholder="Additional details..."
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        rows={3}
        spellCheck={false}
        maxLength={1024}
      />

      <div className="mb-1 flex flex-col gap-1">
        <Button disabled={btnDisabled} onClick={handleSubmit} className="w-full justify-center">
          {status === 'submitting' ? 'Sending...' : 'Send a feedback'}
        </Button>
        <Button
          minimal
          onClick={() => {
            goToHelp();
            analytics.events.track('feedback.cancel');
          }}
          className="w-full justify-center"
        >
          Cancel
        </Button>
      </div>

      {status === 'error' && <p>Something went wrong. Please try again.</p>}
    </div>
  );
};
