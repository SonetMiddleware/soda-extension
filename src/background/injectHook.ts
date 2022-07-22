/* @license
Copyright (C) 2022  DimensionDev Team
Copyright (C) 2022  platwin (Plato Twins) Team

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import { browser } from 'webextension-polyfill-ts';

type Args =
  browser.webNavigation.TransitionNavListener extends browser.webNavigation.NavListener<
    infer U
  >
    ? U
    : never;

const is_iOSApp =
  process.env.engine === 'safari' && process.env.architecture === 'app';

export default function () {
  const injectedScriptURL = '/inject-hook.umd.min.js';
  const injectedScript = fetchUserScript(injectedScriptURL);
  async function onCommittedListener(arg: Args): Promise<void> {
    if (arg.url === 'about:blank') return;
    if (!arg.url.startsWith('http')) return;
    const contains = await browser.permissions.contains({ origins: [arg.url] });
    if (!contains) return;

    console.debug(
      '[soda-event-hook] webNavigation.onCommitted: ',
      arg,
      process.env,
    );
    if (!is_iOSApp) {
      const detail: browser.extensionTypes.InjectDetails = {
        runAt: 'document_start',
        frameId: arg.frameId,
      };

      // #region Injected script
      if (process.env.engine === 'firefox') {
        browser.tabs.executeScript(arg.tabId, {
          ...detail,
          file: injectedScriptURL,
        });
      } else {
        // Refresh the injected script every time in the development mode.
        const code =
          process.env.NODE_ENV === 'development'
            ? await fetchUserScript(injectedScriptURL)
            : await injectedScript;
        console.debug('[soda-event-hook] inject code generated');
        browser.tabs
          .executeScript(arg.tabId, { ...detail, code })
          .catch(HandleError(arg));
      }
      // #endregion
    }
  }
  browser.webNavigation.onCommitted.addListener(onCommittedListener);
  // browser.webNavigation.onCommitted.removeListener(onCommittedListener),
}

async function fetchUserScript(url: string) {
  try {
    return `{
    const script = document.createElement('script')
    script.innerHTML = ${await fetch(url)
      .then((x) => x.text())
      .then((x) =>
        x.replace('process.env.NODE_ENV', JSON.stringify(process.env.NODE_ENV)),
      )
      .then(JSON.stringify)}
    document.documentElement.appendChild(script)
}`;
  } catch (error) {
    console.error(error);
    return `console.log('User script ${url} failed to load.')`;
  }
}

function HandleError(arg: unknown): (reason: Error) => void {
  return (error) => {
    const ignoredErrorMessages = [
      'non-structured-clonable data',
      'No tab with id',
    ];
    if (ignoredErrorMessages.some((x) => error.message.includes(x))) {
      // It's okay we don't need the result, happened on Firefox
    } else {
      console.error(
        '[soda-inject-hook] Inject error',
        error.message,
        arg,
        ...Object.entries(error),
      );
    }
  };
}
