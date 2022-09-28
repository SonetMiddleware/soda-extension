import './index.less';
import IconListViewActive from '@/theme/images/icon-list-view-active.svg';
import IconGridViewActive from '@/theme/images/icon-grid-view-active.svg';
import IconListViewInactive from '@/theme/images/icon-list-view-inactive.svg';
import IconGridViewInactive from '@/theme/images/icon-grid-view-inactive.svg';
import React from 'react';
export enum View_Type {
  List = 'List',
  Grid = 'Grid',
}

interface IProps {
  value: View_Type;
  onChange: (value: View_Type) => void;
}

export default (props: IProps) => {
  const { value, onChange } = props;

  return (
    <div className="view-type-switch">
      <img
        src={
          value === View_Type.List ? IconListViewActive : IconListViewInactive
        }
        onClick={() => onChange(View_Type.List)}
      />
      <img
        src={
          value === View_Type.Grid ? IconGridViewActive : IconGridViewInactive
        }
        onClick={() => onChange(View_Type.Grid)}
      />
    </div>
  );
};
