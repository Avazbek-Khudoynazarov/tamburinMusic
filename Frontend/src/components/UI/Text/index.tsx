import React, { FC, ReactNode } from 'react';
import PropTypes from 'prop-types';
import './index.module.css';

interface TextProps {
  className?: string;
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'success' | 'info' | 'black';
  children?: any;
}

const Text: FC<TextProps> = ({
  className = '',
  color = 'secondary',
  children,
  ...rest
}) => {
  return (
    <span className={`text-${color} ${className}`} {...rest}>
      {children}
    </span>
  );
};

Text.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  color: PropTypes.oneOf([
    'primary',
    'secondary',
    'error',
    'warning',
    'success',
    'info',
    'black',
  ]),
};

export default Text;
