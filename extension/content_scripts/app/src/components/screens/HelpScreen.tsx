import { useEffect } from 'react';
import { CONTACT } from 'unfold-core';
import { Button } from 'unfold-ui';

import analytics from '../../utils/analytics';
import { useAuth } from '../../utils/useAuth';
import { useNavigation } from '../../utils/useNavigation';
import { ScreenTitle } from '../ScreenTitle';

export const HelpScreen = (): JSX.Element => {
  const { user } = useAuth();
  const { goToUser, goToFeedback } = useNavigation();

  useEffect(() => {
    analytics.events.track('ext.navigation.help');
  }, []);

  return (
    <div className="flex flex-col gap-2 p-3 text-gray-700">
      <ScreenTitle icon="lifebuoy" className="mb-3">
        Help
      </ScreenTitle>

      <div className="my-3">
        <div className="flex flex-col gap-1">
          {/* <div>
            Slack:{' '}
            <a href={CONTACT.slack} target="_blank" rel="noreferrer">
              unfoldresearch.slack.com
            </a>
          </div> */}
          <div>
            Twitter:{' '}
            <a href={CONTACT.twitter} target="_blank" rel="noreferrer">
              @UnfoldResearch
            </a>
          </div>
          <div>
            Email:{' '}
            <a href={CONTACT.mail} target="_blank" rel="noreferrer">
              info@unfoldresearch.com
            </a>
          </div>
          <div>
            Website:{' '}
            <a href={CONTACT.web} target="_blank" rel="noreferrer">
              unfoldresearch.com
            </a>
          </div>
        </div>
        <div className="mt-3">
          <Button
            outline
            onClick={() => {
              goToFeedback();
            }}
            icon="comment-2-text"
          >
            Send us feedback
          </Button>
        </div>
      </div>

      <div className="my-3">
        <p>
          This is a tool for scholars and science enthusiast to easily discover and share relevant work and resources,
          in order to speed up scientific advancements.
        </p>
        <p>It lets you link specific types of content directly to publication's URL that anyone can then browse.</p>
        <p>
          You can leave reviews and notes, link other papers, useful data, and projects,... Use it to promote your own
          work, improve discoverability of research in general or gather opinion of the entire community in a single
          place, right on the papers themselves where they can always be found.
        </p>
        <p>Links can be voted on. Links with a lot of upvotes are considered useful, and they rise to the top.</p>
      </div>

      {/* <SectionToggle header={<span className="font-semibold">Settings</span>}> */}
      <div className="my-3">
        <p>
          You're logged in as:{' '}
          <span
            className="cursor-pointer font-semibold"
            onClick={() => {
              goToUser(user!.id);
            }}
          >
            {user?.displayName}
          </span>
        </p>
      </div>
    </div>
  );
};
