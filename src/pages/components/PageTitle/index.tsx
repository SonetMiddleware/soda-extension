import React from 'react';
import { ArrowBack } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import './index.less';

interface IProps {
    title: string;
}
export default (props: IProps) => {
    const { title } = props;
    const history = useHistory();
    return (
        <div className="page-title">
            <ArrowBack
                onClick={() => {
                    if (history.location.pathname === '/verify') {
                        history.push('/backup')
                        return;
                    }
                    history.goBack();
                }}
                className="icon-back"
            />
            <span>{title}</span>
        </div>
    );
};
