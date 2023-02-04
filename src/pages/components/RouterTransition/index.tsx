import React from 'react';
import type { ReactNode, FC } from 'react';
import { Routes, useLocation } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import './index.less';

type Props = {
  children: ReactNode;
};
const RouterTransition: FC<Props> = ({ children }) => {
  const location = useLocation();
  return (
    <TransitionGroup className="router-transition">
      <CSSTransition timeout={300} key={location.pathname} classNames="fade">
        {children}
      </CSSTransition>
    </TransitionGroup>
  );
};

export default RouterTransition;
