import { useAuth } from '../utils/useAuth';
import { Navigation, useNavigation } from '../utils/useNavigation';
import { AuthScreen } from './screens/AuthScreen';
import { BrowseScreen } from './screens/BrowseScreen';
import { HelpScreen } from './screens/HelpScreen';
import { LibraryScreen } from './screens/LibraryScreen';
import { SubmitScreen } from './screens/SubmitScreen';
import { ReportScreen } from './screens/ReportScreen';
import { UserScreen } from './screens/UserScreen';
import { NotificationsScreen } from './screens/NotificationsScreen';
import { AlertsScreen } from './screens/AlertsScreen';
import { FeedbackScreen } from './screens/FeedbackScreen';

const SCREEN: Record<Navigation['current']['screen'], () => JSX.Element> = {
  auth: AuthScreen,
  browse: BrowseScreen,
  help: HelpScreen,
  // library: LibraryScreen,
  // report: ReportScreen,
  submit: SubmitScreen,
  // user: UserScreen,
  notifications: NotificationsScreen,
  alerts: AlertsScreen,
  // feedback: FeedbackScreen,
};

export const Sidebar = (): JSX.Element => {
  const { current } = useNavigation();

  const Screen = SCREEN[current.screen];

  return (
    <div className="overflow-hidden border-l border-gray-200 bg-bp-gray-1 text-xs shadow-md" data-comp="sidebar">
      <Screen />
    </div>
  );
};
