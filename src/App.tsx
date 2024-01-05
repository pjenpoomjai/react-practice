import React, { useEffect, useState } from 'react';
import axios from 'axios';
import JsBarcode from 'jsbarcode';
import QRCode from 'react-qr-code';
import GraphQLButton from './GraphQLButton';

interface Data {
  data: AvailablePassportAudiences;
}

interface AvailablePassportAudiences {
  token: string
}

function App() {
  const [data, setData] = useState<Data | null>(null);
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Assuming your backend is running on http://localhost:5000
        const response = await axios.get<Data>('http://localhost:5001/api/graphql')
        setData(response.data);
      } catch (error: any) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData();

    // Generate barcode with JsBarcode
    JsBarcode("#barcode", "CRP415907", {
      format: "CODE128",
      displayValue: true,
    });

  }, []); // Empty dependency array ensures useEffect runs only once

  return (
    <div>
      <h1>React App</h1>
      <p>Data from Backend: {data ? data.data.token : 'Loading...'}</p>
      <svg id="barcode"></svg>
      <QRCode value={"CRP415907"} size={128} />
      <GraphQLButton/>
      <img src="https://golden-image.master-assets-b-ts-stable-300-g001.primo-dev.com/campaignimage/image/1db8b580-90ba-4e43-aeb6-236d1439f1ed.jpg"/>
    </div>
  );
}

export default App;
