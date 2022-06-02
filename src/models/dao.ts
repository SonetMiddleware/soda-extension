/* eslint-disable react-hooks/rules-of-hooks */
import { createModel } from 'hox';
import { useState } from 'react';
import { DaoItem, CollectionDao } from '@soda/soda-core';

function createDaoStore() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [collectionForDaoCreation, setCollectionForDaoCreation] =
    useState<CollectionDao>();
  const [currentDao, setCurrentDao] = useState<DaoItem>();
  return {
    collectionForDaoCreation,
    setCollectionForDaoCreation,
    currentDao,
    setCurrentDao,
  };
}
export default createModel(createDaoStore);
