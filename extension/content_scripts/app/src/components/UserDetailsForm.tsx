import { Button, TextArea } from 'unfold-ui';
import { useState } from 'react';
import { useAuth } from '../utils/useAuth';
import { useNavigation } from '../utils/useNavigation';

export const UserDetailsForm = (): JSX.Element => {
  const { logout, user } = useAuth();
  const { goToAuth } = useNavigation();

  const [bio, setBio] = useState('');

  return (
    <div>
      <p>
        Username: <span className="font-semibold">{user?.displayName}</span>
      </p>

      {/* <p>Registered at: {user?.createdAt.toDateString()}</p> */}

      <TextArea
        rows={10}
        className="min-h-[100px] w-full"
        placeholder="Write your bio..."
        value={bio}
        onChange={(e) => setBio(e.target.value)}
      />
      <Button
        outline
        icon="log-out-2"
        onClick={() => {
          logout();
          goToAuth();
        }}
      >
        Log out
      </Button>
    </div>
  );
};
