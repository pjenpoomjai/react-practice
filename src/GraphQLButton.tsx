import React, { useState } from 'react';
import axios from 'axios';

const GraphQLButton = () => {
  const [apiResponse, setApiResponse] = useState(null);
  const [images, setImages] = useState<string[]>([]);

  const callGraphQL2 = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/graphql2');
      console.log(response.data)
      setApiResponse(response.data);

    } catch (error: any) {
      console.error('Error calling /api/graphql2:', error.message);
    //   setApiResponse({ error: 'Failed to fetch data from /api/graphql2' });
    }
  };

  return (
    <div>
      <button onClick={callGraphQL2}>Call /api/graphql2 for getListAvailableCampaigns</button>
      <div>
        <strong>API Response:</strong>
        <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
      </div>
    </div>
  );
};

export default GraphQLButton;
