import React, { useEffect, useState } from "react";
import { Table, Input, Button, Form, Row, Col, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import ApiService from "../api/ProductApi";
import { setProducts } from "../store/Product";
import { useNavigate } from "react-router-dom";

const App = () => {
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const products = useSelector((state) => state.products);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true); // Устанавливаем в true при начале загрузки
        ApiService.getAllProducts()
            .then((response) => {
                dispatch(setProducts(response));
                setLoading(false); // Останавливаем крутящийся индикатор, когда данные загружены
            })
            .catch((error) => {
                console.error("Ошибка при загрузке данных:", error);
                setLoading(false); // Останавливаем крутящийся индикатор даже в случае ошибки
            });
    }, [dispatch]);

    const handleFilterSubmit = (values) => {
        setLoading(true); // Включаем индикатор загрузки при фильтрации
        ApiService.getFilteredProducts(values)
            .then((filteredProducts) => {
                dispatch(setProducts(filteredProducts));
                setLoading(false); // Останавливаем крутящийся индикатор после фильтрации
            })
            .catch((error) => {
                console.error("Ошибка при загрузке фильтрованных данных:", error);
                setLoading(false); // Останавливаем крутящийся индикатор в случае ошибки
            });
    };

    const handleNavigate = (product) => {
        // Переход на экран create_qr_code с передачей данных продукта
        navigate("/create_qr_code", { state: { product } });
    };

    const columns = [
        {
            key: "1",
            title: "Actions",
            render: (text, record) => (
                <Button onClick={() => handleNavigate(record)}>Create QR</Button>
            ),
        },
        { key: "2", title: "EAN-128 Barcode", dataIndex: "barcodeEan128" },
        { key: "3", title: "Type Sign", dataIndex: "typeSign" },
        { key: "4", title: "Model", dataIndex: "model" },
        { key: "5", title: "Retail Price", dataIndex: "retailPrice", render: (price) => `₽${price}` },
        { key: "6", title: "Supply Number", dataIndex: "supplyNumber" },
        { key: "7", title: "Name (RU)", dataIndex: "nameRu" },
        { key: "8", title: "Domestic Size", dataIndex: "domesticSize" },
        { key: "9", title: "Manufacturer Size", dataIndex: "manufacturerSize" },
        { key: "10", title: "Composition (RU)", dataIndex: "compositionRu" },
        { key: "11", title: "Country of Origin", dataIndex: "countryOfOrigin" },
        { key: "12", title: "Manufacture Date", dataIndex: "manufactureDate" },
        { key: "13", title: "Importer (RF)", dataIndex: "importerRf" },
        { key: "14", title: "Manufacturer Name", dataIndex: "manufacturerName" },
        { key: "15", title: "Producer Name", dataIndex: "producerName" },
        { key: "16", title: "Producer Address", dataIndex: "producerAddress" },
        { key: "17", title: "EAN-13 Barcode", dataIndex: "barcodeEan13" },
    ];

    return (
        <div style={{ padding: "20px" }}>
            {/* Компонент Spin отображает крутящийся индикатор, пока loading = true */}
            {loading ? (
                <Spin size="large" style={{ display: "block", margin: "auto" }} />
            ) : (
                <>
                    <Form layout="vertical" onFinish={handleFilterSubmit} style={{ marginBottom: "20px" }}>
                        <Row gutter={16}>
                            {/* Фильтрационные поля */}
                            <Col span={6}>
                                <Form.Item name="barcodeEan128" label="EAN-128 Barcode">
                                    <Input placeholder="EAN-128 Barcode" />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item name="typeSign" label="Type Sign">
                                    <Input placeholder="Type Sign" />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item name="model" label="Model">
                                    <Input placeholder="Model" />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item name="retailPrice" label="Retail Price">
                                    <Input placeholder="Retail Price" type="number" />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item name="supplyNumber" label="Supply Number">
                                    <Input placeholder="Supply Number" />
                                </Form.Item>
                            </Col>

                            {/* Другие фильтрационные поля */}
                            <Col span={6}>
                                <Form.Item name="nameRu" label="Name (RU)">
                                    <Input placeholder="Name (RU)" />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item name="domesticSize" label="Domestic Size">
                                    <Input placeholder="Domestic Size" />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item name="manufacturerSize" label="Manufacturer Size">
                                    <Input placeholder="Manufacturer Size" />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item name="compositionRu" label="Composition (RU)">
                                    <Input placeholder="Composition (RU)" />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item name="countryOfOrigin" label="Country of Origin">
                                    <Input placeholder="Country of Origin" />
                                </Form.Item>
                            </Col>

                            {/* Остальные фильтрационные поля */}
                            <Col span={6}>
                                <Form.Item name="manufactureDate" label="Manufacture Date">
                                    <Input placeholder="Manufacture Date (01.2024)" />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item name="importerRf" label="Importer (RF)">
                                    <Input placeholder="Importer (RF)" />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item name="manufacturerName" label="Manufacturer Name">
                                    <Input placeholder="Manufacturer Name" />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item name="producerName" label="Producer Name">
                                    <Input placeholder="Producer Name" />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item name="producerAddress" label="Producer Address">
                                    <Input placeholder="Producer Address" />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item name="barcodeEan13" label="EAN-13 Barcode">
                                    <Input placeholder="EAN-13 Barcode" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row>
                            <Col span={12}>
                                <Button type="primary" htmlType="submit" style={{ marginRight: "10px" }}>
                                    Apply Filters
                                </Button>
                            </Col>
                            <Col span={12}>
                                <Button
                                    onClick={() => {
                                        setLoading(true);
                                        ApiService.getAllProducts().then((response) =>
                                            dispatch(setProducts(response))
                                        ).finally(() => setLoading(false));
                                    }}
                                >
                                    Reset Filters
                                </Button>
                            </Col>
                        </Row>
                    </Form>

                    <Table
                        dataSource={products.products}
                        columns={columns}
                        rowKey="id"
                        pagination={{ pageSize: 10 }}
                    />
                </>
            )}
        </div>
    );
};

export default App;
