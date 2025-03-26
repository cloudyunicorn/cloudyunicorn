import Image from 'next/image';
import React from 'react';
import logo from '@/assets/logo.png';

const Logo = () => {
  return <Image src={logo} alt="Cloudy Unicorn" height={40} />;
};

export default Logo;
