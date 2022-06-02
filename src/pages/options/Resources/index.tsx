import React, { useState, useEffect, useCallback } from 'react';
import './index.less';
import { Tabs, message, Input, Upload, Spin, Button } from 'antd';
import CommonButton from '@/pages/components/Button';
import {
  addTokenToFav,
  getCapableServiceNames,
  getInlineMarketplace,
} from '@soda/soda-core';
import { mint } from '@soda/soda-core-ui';
import FavTokenList from './Components/FavTokenList';
import OwnedTokenList from './Components/OwnedTokenList';
import { useWalletModel } from '@/models';

const { TabPane } = Tabs;

export default () => {
  const [loading, setLoading] = useState(false);
  const [localImg, setLocalImg] = useState<any>([]);
  const [activeKey, setActiveKey] = useState('1');
  const [mpUrl, setMpUrl] = useState('');
  const { address, chainId } = useWalletModel();
  const [isMintable, setMintable] = useState(false);

  useEffect(() => {
    (async () => {
      const { assetServices } = await getCapableServiceNames('mint');
      setMintable(assetServices.length > 0);
      const res: any = await getInlineMarketplace();
      setMpUrl(res.url);
    })();
  }, []);

  const handleFinish = async () => {
    try {
      if (localImg && localImg[0]) {
        setLoading(true);
        const res = await mint(localImg[0]);
        if (!res.error) {
          console.log(res.error);
          setLoading(false);
          return;
        }
        message.success('Your NFT has been minted successfully.', 5);
        //add to fav
        await addTokenToFav({ address, token: res.token });
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
  useEffect(() => {
    onRemove();
  }, [activeKey]);

  const beforeUpload = (file: any) => {
    setLocalImg([file]);
    return false;
  };

  return (
    <div>
      <p className="resource-page-title">NFT Resources</p>
      <Spin spinning={loading}>
        <div className="resources-container">
          {mpUrl && (
            <CommonButton
              type="primary"
              onClick={() => window.open(mpUrl, '_blank')}
              className="btn-market"
            >
              To NFT Market
            </CommonButton>
          )}
          <Tabs
            style={{ height: '100%' }}
            animated={false}
            defaultActiveKey="1"
            onChange={(v) => setActiveKey(v)}
          >
            <TabPane tab="My Favorite" key="1" className="fav-list">
              <FavTokenList address={address} refresh={activeKey === '1'} />
            </TabPane>
            {isMintable && (
              <TabPane tab="Mint" key="2">
                <div className="mint-container">
                  <img
                    src={chrome.extension.getURL('images/upload.png')}
                    alt=""
                  />
                  <p>Select local images to mint NFT</p>
                  <Upload
                    capture=""
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
            )}
            <TabPane tab="NFT Portfolio" key="3" className="fav-list">
              <OwnedTokenList address={address} refresh={activeKey === '3'} />
            </TabPane>
          </Tabs>
        </div>
      </Spin>
    </div>
  );
};
