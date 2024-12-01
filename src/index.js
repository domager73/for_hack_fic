import React from 'react';
import ReactDOM from 'react-dom/client';
import ImageWithText from "./feature/CreateBarcode";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Products from "./feature/Products";
import {store} from "./store/Store";
import {Provider} from "react-redux";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        <BrowserRouter>
            <Routes>
                <Route path="*" element={<Products/>}/>
                <Route path="create_qr_code" element={<ImageWithText/>}/>
            </Routes>
        </BrowserRouter>
    </Provider>
);
