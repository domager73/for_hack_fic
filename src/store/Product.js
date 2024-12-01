import {createSlice} from "@reduxjs/toolkit";

export const productSlice = createSlice({
    name: "productSlice",
    initialState: {
        products: [
            {
                id: 1,
                barcodeEan128: "1234567890123",
                typeSign: "Sample Type",
                model: "Sample Model",
                retailPrice: 1000,
                supplyNumber: "SN123456",
                nameRu: "Продукт 1",
                domesticSize: "L",
                manufacturerSize: "XL",
                compositionRu: "Состав: 100% cotton",
                countryOfOrigin: "Россия",
                manufactureDate: "2024-01-01",
                importerRf: "Importer Name",
                manufacturerName: "Manufacturer Name",
                producerName: "Producer Name",
                producerAddress: "Producer Address",
                barcodeEan13: "1234567890123",
            }
        ],
    },
    reducers: {
        setProducts: (state, action) => {
            state.products = action.payload;
        },
    },
});

export const {setProducts} = productSlice.actions;
export default productSlice.reducer;
