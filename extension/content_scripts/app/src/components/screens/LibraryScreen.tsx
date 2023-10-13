import { useEffect, useState } from 'react';
import { Collection } from 'unfold-core';
import { Button } from 'unfold-ui';
import analytics from '../../utils/analytics';
import api from '../../utils/api';
import { useAuth } from '../../utils/useAuth';
import { useNavigation } from '../../utils/useNavigation';
import { LibraryTree } from '../LibraryTree';
import { ScreenTitle } from '../ScreenTitle';

export const LibraryScreen = (): JSX.Element => {
  return <div></div>;
  // const { current, goToBrowse, goToUser } = useNavigation<'library'>();
  // const { user } = useAuth();

  // const [collections, setCollections] = useState<Collection[] | null>(null);
  // const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  // const [newTitle, setNewTitle] = useState<string | null>(null);

  // // current.item being null means that we're just viewing, either our or
  // // somebody else's library
  // // current.item not being null signals that we're in the process of adding
  // // that item to our library
  // const isPending = !!current.pendingItem;

  // const isUserOwner = current.ownerId === user?.id;

  // useEffect(() => {
  //   const fetchCollections = async () => {
  //     const res = await api.collection.get({
  //       userId: current.ownerId,
  //     });

  //     if (res) {
  //       setCollections(res.collections);
  //     }
  //   };

  //   fetchCollections();

  //   analytics.events.track('navigation.collections', {
  //     isSelf: true,
  //   });
  // }, []);

  // const onCreateNew = async () => {
  //   if (!collections) {
  //     return;
  //   }

  //   const res = await api.collection.create({
  //     parentId: selectedCollection ? selectedCollection.id : null,
  //     type: 'new',
  //     title: 'New Collection',
  //   });

  //   if (res) {
  //     setCollections([...collections, res.collection]);
  //   }
  // };

  // const onDelete = async () => {
  //   if (!selectedCollection || !collections) {
  //     return;
  //   }

  //   await api.collection.delete({
  //     id: selectedCollection.id,
  //   });

  //   analytics.events.track('collection.removed', {
  //     collectionId: selectedCollection.id,
  //     title: selectedCollection.title,
  //   });

  //   setCollections(collections.filter((c) => c.id !== selectedCollection.id));
  // };

  // const onRename = async () => {
  //   if (!isUserOwner || !selectedCollection || !newTitle || !collections) {
  //     return;
  //   }

  //   await api.collection.rename({
  //     id: selectedCollection.id,
  //     title: newTitle,
  //   });

  //   const c = collections.find((c) => c.id === selectedCollection.id);

  //   if (c) {
  //     c.title = newTitle;
  //   }

  //   setCollections([...collections]);
  //   setNewTitle(null);
  // };

  // return (
  //   <div className="h-full p-3 text-xs text-gray-700">
  //     <ScreenTitle icon="star" className="mb-3">
  //       Library
  //     </ScreenTitle>

  //     <div className="flex flex-col gap-2 text-gray-500">
  //       <div>You can save different items in your library so you can easily find them again later.</div>
  //       <div className="flex items-center">
  //         Use
  //         <Button outline icon="star" className="gray pointer-events-none mx-0.5 scale-[0.9]">
  //           Save
  //         </Button>
  //         button to add items to your library.
  //       </div>
  //     </div>

  //     <div className="my-3 rounded border border-gray-300">
  //       <div className="space-justify flex min-h-[25px] flex-row items-center justify-between gap-2 border-b border-gray-300">
  //         <div className="flex flex-row items-center">
  //           {/* {isUserOwner && (
  //             <Button minimal icon="folder" onClick={() => onCreateNew()}>
  //               Create new
  //             </Button>
  //           )}
  //           {isPending && (
  //             <Button disabled={!selectedCollection} icon="checkbox-circle">
  //               Add
  //             </Button>
  //           )} */}
  //           {!!selectedCollection && (
  //             <Button
  //               minimal
  //               icon="arrow-top-rec"
  //               onClick={() => {
  //                 if (selectedCollection.refType === 'entry') {
  //                   goToBrowse({
  //                     id: selectedCollection.entryId,
  //                     title: selectedCollection.title,
  //                   });
  //                 } else if (selectedCollection.refType === 'user') {
  //                   goToUser(selectedCollection.userId);
  //                 }
  //               }}
  //             >
  //               Open
  //             </Button>
  //           )}
  //         </div>
  //         {isUserOwner && !!selectedCollection ? (
  //           <Button minimal icon="trash" onClick={() => onDelete()} />
  //         ) : (
  //           <div></div>
  //         )}
  //       </div>

  //       <div className="bg-white">
  //         <LibraryTree collections={collections} onSelect={setSelectedCollection} interactive={isUserOwner} />
  //       </div>
  //     </div>
  //   </div>
  // );
};
