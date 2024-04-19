import React from 'react';
import { useParams } from 'react-router-dom';
import RidesTemplate from '../components/RidesTemplate';

function RidesPage() {
  console.log('Test');
  const { parkID } = useParams();
  console.log('parkID:', parkID);

  return <RidesTemplate parkID={parkID} />;
}

export default RidesPage;