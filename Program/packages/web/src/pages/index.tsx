import { NextPage } from 'next';
import { Button, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import { MarketingLayout } from '../components/Layout';

const Home: NextPage = () => {
  return <meta httpEquiv="refresh" content="0; url = app" />;
};

export default Home;
export { getServerSideProps } from '../components/Chakra';
