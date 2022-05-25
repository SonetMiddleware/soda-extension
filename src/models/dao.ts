/* eslint-disable react-hooks/rules-of-hooks */
import { createModel } from 'hox';
import { useState } from 'react';
import { IDaoItem, ICollectionItem } from '@soda/soda-core';

function createDaoStore() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [collectionForDaoCreation, setCollectionForDaoCreation] =
    useState<ICollectionItem>();
  const [currentDao, setCurrentDao] = useState<IDaoItem>();
  return {
    collectionForDaoCreation,
    setCollectionForDaoCreation,
    currentDao,
    setCurrentDao,
  };
}
export default createModel(createDaoStore);
