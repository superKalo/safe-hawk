import React from 'react';
import styles from './Feature.module.scss';

type Props = {
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    title: string;
    content: string;
};

const Feature = ({ icon: Icon, title, content }: Props) => {
    return (
        <div className={styles.feature}>
            <Icon className={styles.icon} />
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.content}>{content}</p>
        </div>
    );
};

export default Feature;
