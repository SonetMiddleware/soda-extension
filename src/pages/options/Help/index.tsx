import React from 'react';
import './index.less';
export default () => {
  return (
    <div className="common-container">
      <h2 className="page-title">Help</h2>
      <p>
        Soda extension (Soda) is a personal asset portal for the World Wide Web.
        The extension serves as a gateway for users to autonomously manage
        identity and data privacy at their entry points across metaverses. App
        developers can tap into our entry points and build on top of the usage
        middleware through our SDK, where end user experience will be enhanced
        and supported by the top web infrastructure protocols in a seamless way.
      </p>
      <br />
      <p>
        For more detail, please view our
        <a
          href="https://docs.sonet.one/soda-extension/soda-extension"
          target="_blank"
        >
          {' '}
          wiki page.
        </a>
      </p>
    </div>
  );
};
