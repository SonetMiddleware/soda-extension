import React, { useState, useEffect, useCallback } from 'react';
import './index.less';
import { Tabs, message, Input, Upload, Spin, Button } from 'antd';
import CommonButton from '@/pages/components/Button';
import { addToFav, ipfsAdd, MessageTypes, sendMessage } from '@soda/soda-core';
import FavNFTList from './Components/FavNFTList';
import OwnedNFTList from './Components/OwnedNFTList';

const { TabPane } = Tabs;

export default () => {
  const [account, setAccount] = useState('');
  const [loading, setLoading] = useState(false);
  const [localImg, setLocalImg] = useState<any>([]);

  // 获取钱包地址
  useEffect(() => {
    (async () => {
      const req = {
        type: MessageTypes.Connect_Metamask,
      };
      const resp: any = await sendMessage(req);
      console.log('get account: ', resp);
      const { account: _account } = resp.result;
      setAccount(_account);
    })();
  }, []);

  const handleFinish = async () => {
    try {
      if (localImg && localImg[0]) {
        setLoading(true);
        // 1. upload to ipfs
        message.info('Uploading your resource to IPFS...', 5);
        const hash = await ipfsAdd(localImg[0]);
        console.log('hash: ', hash);
        // 3. mint NFT
        const req = {
          type: MessageTypes.Mint_Token,
          request: {
            hash,
          },
        };
        message.info('Minting your NFT...');
        const resp: any = await sendMessage(req);
        console.log('mint resp:', resp);
        const { tokenId } = resp.result;
        if (!tokenId) {
          console.log(resp.result.error);
          setLoading(false);
          return;
        }
        message.success('Your NFT has successfully minted.', 5);
        //add to fav
        const params = {
          addr: account,
          contract: '0x0daB724e3deC31e5EB0a000Aa8FfC42F1EC917C5',
          token_id: tokenId,
          fav: 1,
          uri: hash,
        };
        await addToFav(params);
        setLoading(false);
      } else {
        message.warning('Please select local image to mint your NFT');
        return;
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
      message.error('Wallet issue/Balance issue');
    }

    // handle local img
  };

  const onRemove = () => {
    setLocalImg([]);
  };
  const beforeUpload = (file: any) => {
    setLocalImg([file]);
    return false;
  };

  return (
    <div>
      <p className="resource-page-title">NFT Resources</p>
      <Spin spinning={loading}>
        <div className="resources-container">
          <CommonButton
            type="primary"
            onClick={() => window.open('https://nash.market/', '_blank')}
            className="btn-market"
          >
            To NFT Market
          </CommonButton>

          <Tabs
            style={{ height: '100%' }}
            animated={false}
            defaultActiveKey="3"
          >
            <TabPane tab="My Favorite" key="1" className="fav-list">
              <FavNFTList account={account} />
            </TabPane>
            <TabPane tab="Mint" key="2">
              <div className="mint-container">
                <img
                  src={chrome.extension.getURL('images/upload.png')}
                  alt=""
                />
                <p>Select local images to mint NFT</p>
                <Upload
                  accept=".jpg,.jpeg,.png"
                  onRemove={onRemove}
                  fileList={localImg}
                  beforeUpload={beforeUpload}
                >
                  <CommonButton type="primary" className="btn-upload">
                    Select local image
                  </CommonButton>
                </Upload>
                <CommonButton
                  type="secondary"
                  onClick={handleFinish}
                  className="btn-finish"
                  loading={loading}
                >
                  Finish
                </CommonButton>
                {/* <img id="preview" src={previewLocalImg} alt="" className="preview-local" /> */}
              </div>
            </TabPane>
            <TabPane tab="NFT Portfolio" key="3" className="fav-list">
              <OwnedNFTList account={account} />
            </TabPane>
          </Tabs>
        </div>
      </Spin>
    </div>
  );
};
