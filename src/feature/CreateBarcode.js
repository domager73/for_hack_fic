import React, {useState, useRef, useEffect} from "react";
import JsBarcode from "jsbarcode";
import {useLocation} from "react-router-dom";
import {DownloadOutlined} from "@ant-design/icons";
import {Button} from "antd";
import jsPDF from "jspdf";

const CreateBarcode = () => {
    const location = useLocation();
    const {product} = location.state || {};
    console.log(product);

    const [fields, setFields] = useState([
        {x: 50, y: 400, width: 200, height: 50, text: ""},
    ]);
    const [backgroundImage, setBackgroundImage] = useState('./assets/default_image.jpg');
    const canvasRef = useRef(null);
    const barcode13CanvasRef = useRef(null);
    const barcode128CanvasRef = useRef(null);

    const drawBarcode13 = () => {
        const barcodeCanvas = barcode13CanvasRef.current;
        const context = barcodeCanvas.getContext("2d");
        context.clearRect(0, 0, barcodeCanvas.width, barcodeCanvas.height);

        JsBarcode(barcodeCanvas, '2990312312312', {
            format: "EAN13",
            width: 4,
            height: 160,
            textMargin: 0,
            fontSize: 35
        });
    };

    const drawBarcode128 = () => {
        const barcodeCanvas = barcode128CanvasRef.current;
        const context = barcodeCanvas.getContext("2d");
        context.clearRect(0, 0, barcodeCanvas.width, barcodeCanvas.height);

        JsBarcode(barcodeCanvas, product['barcodeEan128'], {
            format: "CODE128",
            width: 4,
            height: 90,
            displayValue: false,
        });

        context.restore();
    };

    const loadImage = (src) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = src;
            img.onload = () => resolve(img);
            img.onerror = reject;
        });
    };

    const handleCanvasDraw = async () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);

        try {
            const backimg = await loadImage(backgroundImage);
            context.drawImage(backimg, 0, 0, canvas.width, canvas.height);

            const barcode13Canvas = barcode13CanvasRef.current;
            const barcode13Image = barcode13Canvas.toDataURL();

            const barcode128Canvas = barcode128CanvasRef.current;
            const barcode128Image = barcode128Canvas.toDataURL();

            const img13 = new Image();
            const img128 = new Image();
            img13.src = barcode13Image;
            img128.src = barcode128Image;
            img128.onload = () => {
                const img128Width = 100;
                const img128Height = 180;

                context.save();

                context.translate(390 + img128Width / 2, 10 + img128Height / 2);

                context.rotate(Math.PI / 2);

                context.drawImage(
                    img128,
                    -img128Width / 2,
                    -img128Height / 2
                );

                context.restore();
                context.drawImage(img13, 30, 1060);
                drawFieldsAndMiniImage(context);

                drawConstantText(context, product['supplyNumber'], 30, 65, 20, 'black', 'Arial Narrow', 400);
                drawConstantText(context, 'LL6LL6', 160, 110, 30, 'black', 'Arial Narrow', 300);
                drawConstantText(context, product['nameRu'], 30, 150, 25, 'black', 'Arial Bold', 400);
                drawConstantText(context, product['retailPrice'], 30, 420, 100, 'black', 'Arial Narrow', 300);
                drawConstantText(context, 'Состав: ' + product['compositionRu'] +
                    ' Изготовленно: ' + product['manufactureDate']
                    + '    Изготовитель: ' + product['producerAddress']
                    ,
                    30, 500, 25, 'black', 'Arial Narrow', 400);
                drawConstantText(context, 'Производитель: ' + product['producerName'], 30, 855, 30, 'black', 'Arial Narrow', 400);
                drawConstantText(context, product['domesticSize'], 50, 1038, 30, 'white', 'Arial Narrow Bold', 300);
                drawConstantText(context, product['manufacturerSize'], 200, 1038, 30, 'black', 'Arial Narrow Bold', 300);
            };
        } catch (error) {
            console.error("Error loading images:", error);
        }
    };

    const drawConstantText = (context, text, x, y, textSize, color, style, maxWidth) => {
        context.font = `${textSize}px ${style}`;
        context.fillStyle = color;

        if (maxWidth && text.toString().split(' ').length > 1) {
            const words = text.split(' ');
            let line = '';
            let lineHeight = textSize * 1.5;

            for (let i = 0; i < words.length; i++) {
                const testLine = line + words[i] + ' ';
                const testWidth = context.measureText(testLine).width;

                if (testWidth > maxWidth) {
                    if (line === '') {
                        context.fillText(words[i].slice(0, words[i].length - 1) + '...', x, y);
                        break;
                    } else {
                        context.fillText(line, x, y);
                        line = words[i] + ' ';
                        y += lineHeight;
                    }
                } else {
                    line = testLine;
                }
            }

            if (line) {
                context.fillText(line, x, y);
            }
        } else {
            context.fillText(text, x, y);
        }
    };


    const drawFieldsAndMiniImage = (context) => {
        fields.forEach((field) => {
            context.fillStyle = "black";
            context.font = "16px Arial";
            context.fillText(field.text, field.x, field.y + 20);
        });
    };

    const handleDownload = () => {
        const canvas = canvasRef.current;
        const imageUrl = canvas.toDataURL();

        const link = document.createElement("a");
        link.href = imageUrl;
        link.download = "custom_image.png";
        link.click();

        const canvas_for_pdf = canvasRef.current;
        const imageUrl_for_pdf = canvas_for_pdf.toDataURL();

        const pdf = jsPDF();

        pdf.addImage(imageUrl_for_pdf, 'PNG', 0, 0, 210, 297);

        pdf.save("custom_image.pdf");
    };

    useEffect(() => {
        drawBarcode13();
        drawBarcode128();
        handleCanvasDraw();
    }, [fields]);

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Button
                type="primary"
                icon={<DownloadOutlined/>}
                size="large"
                style={{
                    marginBottom: "20px",
                    borderRadius: "8px",
                }}
                onClick={handleDownload}
            >
                Скачать изображение
            </Button>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    margin: "20px 0",
                }}
            >
                <canvas
                    ref={canvasRef}
                    width={542}
                    height={1280}
                    style={{
                        backgroundColor: "white",
                        border: "1px solid black",
                    }}
                ></canvas>
            </div>

            <canvas
                ref={barcode13CanvasRef}
                style={{display: "none"}}
            ></canvas>

            <canvas
                ref={barcode128CanvasRef}
                style={{display: "none"}}
            ></canvas>
        </div>
    );
};

export default CreateBarcode;
