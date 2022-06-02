import * as ReactDOM from 'react-dom';
import {
  MutationObserverWatcher,
  LiveSelector,
} from '@dimensiondev/holoflows-kit';
import { startWatch, InlineTokenToolbar } from '@soda/soda-core-ui';
import { renderTokenFromCacheMedia } from '@soda/soda-core';

type E = HTMLElement;

const querySelector = <T extends E, SingleMode extends boolean = true>(
  selector: string,
  singleMode: boolean = true,
) => {
  const ls = new LiveSelector<T, SingleMode>().querySelector<T>(selector);
  return (singleMode ? ls.enableSingleMode() : ls) as LiveSelector<
    T,
    SingleMode
  >;
};
export const imageFullscreenSelector: () => LiveSelector<E, true> = () =>
  querySelector<E>('body');

const fullScreenImgWatcher = new MutationObserverWatcher(
  imageFullscreenSelector(),
);

const spanStyles =
  'position:absolute;padding:5px;right:0;top:0;text-align:center;background:#fff;z-index:2';
const className = 'plat-meta-span';

const handleImgEle = async (imgEle: HTMLImageElement) => {
  const imgSrc = imgEle.src;
  // if (imgEle.getBoundingClientRect().width < 300) {
  //   return;
  // }
  if (imgSrc.includes('ipfs')) {
    return;
  }
  const res = await renderTokenFromCacheMedia(imgSrc, {
    dom: imgEle,
    config: { replace: true },
  });
  if (res && res.result) {
    const dom: any = document.createElement('div');
    dom.style.cssText = spanStyles;
    dom.className = className;
    ReactDOM.render(
      <InlineTokenToolbar token={res.token} originMediaSrc={imgSrc} />,
      dom,
    );
    return dom;
  }
  return null;
};

const handleImgs = async () => {
  const imgEle =
    fullScreenImgWatcher.firstDOMProxy.realCurrent?.querySelector('img');
  const divParent = imgEle?.parentElement;
  if (imgEle && divParent) {
    if (divParent.querySelector(`.${className}`)) {
      return;
    }

    const dom = await handleImgEle(imgEle);
    if (dom) {
      divParent.click();
      divParent.appendChild(dom);
    }
  }
};
//@ts-ignore
fullScreenImgWatcher.on('onAdd', async () => {
  handleImgs();
});
//@ts-ignore
fullScreenImgWatcher.on('onChange', async () => {
  handleImgs();
});

function main() {
  //   startWatch(fullScreenImgWatcher);
}

main();
