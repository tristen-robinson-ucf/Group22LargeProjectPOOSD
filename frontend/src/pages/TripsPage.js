import React from 'react';
import { useParams } from 'react-router-dom';
import TripsTemplate from '../components/TripsTemplate';

function TripsPage() {
  const { tripID } = useParams();
  console.log('park id within trips page:', tripID);

  return (
    <div>
      <TripsTemplate tripID={tripID} />
    </div>
  );
}

export default TripsPage;