import React, { useMemo, useState, useEffect } from 'react';
import styles from './index.less';
import {
  Button,
  Modal,
  Radio,
  Space,
  message,
  Tooltip,
  Checkbox,
  Input,
} from 'antd';
import IconClose from '@/theme/images/icon-close.png';
import ProposalStatus from '../ProposalItemStatus';
import ProposalResults from '../ProposalResults';
import type { Proposal } from '@soda/soda-core';
import {
  formatDateTime,
  ProposalStatusEnum,
  vote as voteProposal,
  getUserVoteInfo,
  sign,
  sha3,
  getProposalPermission,
  getVotePermission,
} from '@soda/soda-core';
import { useDaoModel, useWalletModel } from '@/models';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { flowSign } from '@/utils/eventBus';
import SignConfirmModal from '@/pages/components/SignConfirmModal';
import ProposalCommentsDialog from '../ProposalCommentsDialog';
const TextArea = Input.TextArea;
interface IProps {
  show: boolean;
  detail: Proposal;
  onClose: (updatedProposalId?: string) => void;
  inDao?: boolean;
}
const MaxCommentLength = 400;
export default (props: IProps) => {
  const { show, detail, onClose, inDao } = props;
  const [vote, setVote] = useState<string>();
  const [submitting, setSubmitting] = useState(false);
  const { address, chainId } = useWalletModel();
  const { currentDao } = useDaoModel();
  const [voted, setVoted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [canVote, setCanVote] = useState(false);
  const [signConfirmContent, setSignConfirmContent] = useState(null);
  const [submitComment, setSubmitComment] = useState(false);
  const [comment, setComment] = useState('');
  const [commentError, setCommentError] = useState('');
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const totalSupporters = useMemo(() => {
    const totalVotersNum = detail.results.reduce((a, b) => a + b);
    if (totalVotersNum >= detail.ballotThreshold) {
      return totalVotersNum;
    } else {
      return `${totalVotersNum}/${detail.ballotThreshold}`;
    }
  }, [detail]);

  const handleVoteChange = (e: any) => {
    setVote(e.target.value);
  };

  const handleCommentChange = (e: any) => {
    const value = e.target.value;
    setComment(value);
    if (value && value.length > MaxCommentLength) {
      setCommentError(`No more than ${MaxCommentLength} characters`);
    } else {
      setCommentError('');
    }
  };

  const handleVoteSubmit = async () => {
    if (!vote) {
      message.warn('Please set one option to vote.');
      return;
    }
    if (!address) {
      message.warn('No metamask installed.');
      return;
    }
    try {
      setSubmitting(true);
      //@ts-ignore
      const str = sha3(detail.id, vote);
      // const res = await sign({ message: str || '', address });
      let sig;
      setSignConfirmContent({
        content: [detail.id, vote].join(', '),
        hash: str,
        left: typeof chainId === 'number' ? false : true,
      });
      if (typeof chainId === 'number') {
        const sigRes = await sign({
          message: str || '',
          address,
        });
        sig = sigRes.result;
      } else {
        const sigRes: any = await flowSign(str || '', true);
        console.log('sigRes: ', sigRes);
        sig = JSON.stringify(sigRes);
      }
      setSignConfirmContent(null);
      const result = await voteProposal({
        voter: address,
        collectionId: currentDao!.id,
        proposalId: detail.id,
        item: vote,
        sig: sig,
        comment: comment,
      });
      if (result) {
        message.success('Vote successful.');
        setSubmitting(false);
        onClose();
      } else {
        message.error('Vote failed');
        setSubmitting(false);
      }
    } catch (e) {
      setSubmitting(false);
      console.error(e);
      message.warn('Vote failed.');
      setSignConfirmContent(null);
    }
  };

  useEffect(() => {
    (async () => {
      if (show && address && currentDao && detail) {
        const res = await getUserVoteInfo({
          proposalId: detail.id,
          daoId: currentDao.id,
          address,
        });
        if (res) {
          setVoted(true);
          setVote(res.item);
        }
        if (detail.status === ProposalStatusEnum.OPEN) {
          setIsOpen(true);
        } else {
          setIsOpen(false);
        }
        if (currentDao?.centralized === 1) {
          // public dao
          setCanVote(true);
        } else {
          const result = await getVotePermission({
            collection_id: currentDao?.id,
            voter_type: detail.voteType,
            voter: address,
            proposal_id: detail.id,
          });
          setCanVote(result);
        }
      }
    })();
  }, [show]);

  return (
    <Modal
      footer={null}
      className="common-modal"
      visible={show}
      closable={false}
      width={720}
    >
      <div className={styles['container']}>
        <div className={styles['header']}>
          <div className={styles['header-left']}>
            <p className={styles['end-time']}>
              End at {formatDateTime(detail.endTime)}
            </p>
            <p className={styles['title']}>{detail.title}</p>
            <p className={styles['total-supporter']}>
              Votes - {totalSupporters}
            </p>
          </div>
          <div className={styles['header-right']}>
            <img src={IconClose} alt="" onClick={() => onClose()} />
            <ProposalStatus status={detail.status} />
          </div>
        </div>

        <div className={styles['divide-line']}></div>
        <div
          className={styles['desc']}
          dangerouslySetInnerHTML={{ __html: detail.description }}
        >
          {/* <p>{detail.description}</p> */}
        </div>

        <div className={styles['vote-submit-results-container']}>
          {isOpen && canVote && (
            <div className={styles['vote-container']}>
              <p className={styles['vote-title']}>Cast your vote</p>
              <Radio.Group
                onChange={handleVoteChange}
                value={vote}
                className="custom-radio"
              >
                <Space direction="vertical">
                  {detail.items.map((option, index) => (
                    <Radio
                      value={option}
                      key={index}
                      disabled={voted && vote !== option}
                      className="custom-radio-item"
                    >
                      {option}
                    </Radio>
                  ))}
                </Space>
              </Radio.Group>
              {canVote && !voted && (
                <div className="comment">
                  <Checkbox
                    checked={submitComment}
                    onChange={(e) => {
                      setSubmitComment(e.target.checked);
                    }}
                    className="proposal-start-now"
                  >
                    Submit Comment
                  </Checkbox>
                  {submitComment && (
                    <TextArea
                      value={comment}
                      onChange={handleCommentChange}
                      placeholder="Comment"
                    />
                  )}
                  {commentError && (
                    <p className="comment-error">{commentError}</p>
                  )}
                </div>
              )}
              {!voted && (
                <div>
                  <Button
                    type="primary"
                    onClick={handleVoteSubmit}
                    className={styles['vote-btn']}
                    loading={submitting}
                  >
                    Vote now
                  </Button>
                  <Tooltip title="Your vote can not be changed.">
                    <ExclamationCircleOutlined />
                  </Tooltip>
                </div>
              )}
            </div>
          )}
          <div>
            <ProposalResults items={detail.items} results={detail.results} />
            <div style={{ marginTop: '14px' }}>
              <Button type="link" onClick={() => setCommentModalOpen(true)}>
                Comments
              </Button>
            </div>
          </div>
          <SignConfirmModal
            visible={signConfirmContent !== null}
            onClose={() => setSignConfirmContent(null)}
            hint="MetaMask or Flow wallet will be opened and ask you to sign on a hash of your vote content."
            content={signConfirmContent?.content}
            hash={signConfirmContent?.hash}
            left={signConfirmContent?.left}
          />
        </div>
      </div>
      <ProposalCommentsDialog
        open={commentModalOpen}
        onClose={() => setCommentModalOpen(false)}
        collection_id={currentDao!.id}
        proposal_id={detail.id}
      />
    </Modal>
  );
};
