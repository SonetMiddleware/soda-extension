import { useState, useEffect } from 'react'
import { createModel } from 'hox'
import { getLocal, StorageKeys } from '@soda/soda-core-ui'
function useStore() {
  const test = [
    'butter',
    'broccoli',
    'human',
    'medal',
    'sweet',
    'front',
    'fault',
    'famous',
    'lyrics',
    'cluster',
    'draw',
    'rough'
  ]
  const [mnemonics, setMnemonics] = useState<string[]>(test)
  const [encrypedMnemonics, setEncryptedMnemonics] = useState<string>('')
  useEffect(() => {
    ;(async () => {
      console.log('get mnemonics_creating for storage.....')
      const res = await getLocal(StorageKeys.MNEMONICS_CREATING)
      if (res) {
        const obj = JSON.parse(res)
        setMnemonics(obj.mnemonics)
        setEncryptedMnemonics(obj.encryptedMnemonics)
      }
    })()
  }, [])
  return {
    mnemonics,
    setMnemonics,
    encrypedMnemonics,
    setEncryptedMnemonics
  }
}

export default createModel(useStore)
