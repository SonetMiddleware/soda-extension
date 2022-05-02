import { createModel } from 'hox';
import { useState } from 'react';
import { IDaoItem } from '@/utils/apis';

function createDaoStore() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [collections, setCollections] = useState<string[]>([]);
  const [currentDao, setCurrentDao] = useState<IDaoItem>();
  return {
    collections,
    setCollections,
    currentDao,
    setCurrentDao,
  };
}
export default createModel(createDaoStore);
