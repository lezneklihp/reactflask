import React from 'react';
import './App.css';

// Import third party components.
import { Button } from '@material-ui/core';

// Import custom components.
import { Body } from './components/Body';
import { Header } from './components/Header';

function App() {
    return (
      <div className="App">
        <Header
            title='Some dummy car data'
        />
        <Body
            data_source='/endpoint'
            csv_file_name='cars.csv'
            price_attribute_name='Price'
            brand_attribute_name='Brand'
        />
     </div>
    );
}

export default App;
