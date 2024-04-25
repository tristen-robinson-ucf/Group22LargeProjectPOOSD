import React from 'react';
import { useParams } from 'react-router-dom';
import RidesTemplate from '../components/RidesTemplate';

function RidesPage() {
  const { parkID } = useParams();
  console.log('park id within rides page:', parkID);

  return (
    <div>
      <RidesTemplate parkID={parkID} />
    </div>
  );
}

export default RidesPage;