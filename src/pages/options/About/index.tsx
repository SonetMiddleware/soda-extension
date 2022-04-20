import React from 'react';
import './index.less';
import packageJson from '../../../../package.json';

export default () => {
  return (
    <div className="common-container">
      <h2 className="page-title">About</h2>
      <p>Soda extension v{packageJson.version}.</p>
      <p>©Sonet Team. All rights Reserved.</p>
    </div>
  );
};
