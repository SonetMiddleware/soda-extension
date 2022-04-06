import request from 'umi-request';

export interface IMarketListItem {
  chain_id: number;
  collect_name: string;
  contract: string;
  erc_type: string;
  maker: string;
  name: string;
  order_id: number;
  price: string;
  resource: string;
  resource_type: string;
  side: number;
  taker: string;
  token_id: string;
  token_uri: string;
}
export interface IMarketListResp {
  dataCount: number;
  list: IMarketListItem[];
}
export const getMarketList = async (
  pageNo: number = 1,
  chainId: number = 56,
): Promise<IMarketListResp> => {
  const url = `https://api.treasureland.market/v2/v1/nft/items_recommend?chain_id=${chainId}&page_no=${pageNo}&page_size=20&sort_type=1`;
  const res = await request.get(url);
  return res.data;
};
