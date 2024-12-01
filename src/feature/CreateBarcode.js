import React, {useState, useRef, useEffect} from "react";
import JsBarcode from "jsbarcode";

const AddMiniImage = () => {
    const [fields, setFields] = useState([
        {x: 50, y: 400, width: 200, height: 50, text: ""},
    ]);
    const [miniImage, setMiniImage] = useState(null); // Мини-картинка
    const [miniImagePosition, setMiniImagePosition] = useState({x: 100, y: 100});
    const [barcode, setBarcode] = useState("123456789012"); // Значение штрихкода
    const [barcodeWidth, setBarcodeWidth] = useState(2); // Ширина штрихкода
    const [barcodeHeight, setBarcodeHeight] = useState(100); // Высота штрихкода
    const [backgroundImage, setBackgroundImage] = useState('./assets/default_image.jpg'); // Фоновое изображение
    const canvasRef = useRef(null);
    const barcodeCanvasRef = useRef(null); // Для скрытого canvas для штрихкода

    const handleTextChange = (index, newText) => {
        const updatedFields = fields.map((field, i) =>
            i === index ? {...field, text: newText} : field
        );
        setFields(updatedFields);
    };

    const handleMiniImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setMiniImage(e.target.result); // Сохраняем изображение как Data URL
            };
            reader.readAsDataURL(file);
        }
    };

    // Функция для рисования штрихкода на скрытом canvas
    const drawBarcode = () => {
        const barcodeCanvas = barcodeCanvasRef.current;
        const context = barcodeCanvas.getContext("2d");
        context.clearRect(0, 0, barcodeCanvas.width, barcodeCanvas.height); // Очищаем холст перед рисованием

        JsBarcode(barcodeCanvas, barcode, {
            format: "UPC",
            width: barcodeWidth, // Ширина штрихкода
            height: barcodeHeight, // Высота штрихкода
            textMargin: 0,
            fontOptions: "bold",
        });
    };

    // Рисуем основной канвас
    const handleCanvasDraw = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height); // Очищаем холст перед рисованием

        const backimg = new Image();
        backimg.src = backgroundImage;
        backimg.onload = () => {
            context.drawImage(backimg, 0, 0, canvas.width, canvas.height); // Рисуем фон
        };

        const barcodeCanvas = barcodeCanvasRef.current;
        const barcodeImage = barcodeCanvas.toDataURL(); // Получаем изображение штрихкода

        const img = new Image();
        img.src = barcodeImage;
        img.onload = () => {
            context.drawImage(img, 20, 400); // Рисуем штрихкод на основном канвасе
        };

        drawFieldsAndMiniImage(context); // Рисуем текстовые поля и мини-картинку
    };

    // Функция для рисования текста и мини-картинки
    const drawFieldsAndMiniImage = (context) => {
        // Добавляем текстовые поля
        fields.forEach((field) => {
            context.fillStyle = "black";
            context.font = "16px Arial";
            context.fillText(field.text, field.x, field.y + 20); // Текстовое поле
        });

        // Рисуем мини-картинку
        if (miniImage) {
            const img = new Image();
            img.src = miniImage;
            img.onload = () => {
                context.drawImage(img, miniImagePosition.x, miniImagePosition.y, 100, 100);
            };
        }
    };

    // Функция для скачивания изображения
    const handleDownload = () => {
        const canvas = canvasRef.current;
        const imageUrl = canvas.toDataURL(); // Получаем изображение с канваса в формате Data URL

        // Создаем ссылку для скачивания
        const link = document.createElement("a");
        link.href = imageUrl;
        link.download = "custom_image.png"; // Имя файла для скачивания
        link.click(); // Программный клик по ссылке для скачивания
    };

    useEffect(() => {
        // Загрузить изображение фона (default_image.jpg)
        const defaultImage = "./assets/default_image.jpg"; // Укажите правильный путь к изображению фона
        setBackgroundImage(defaultImage);

        drawBarcode();
        handleCanvasDraw();
    }, [barcode, fields, miniImage, miniImagePosition, barcodeWidth, barcodeHeight]);

    return (
        <div>
            <button onClick={handleDownload}>Скачать изображение</button>

            <div style={{margin: "10px 0"}}>
                <label>
                    Загрузить мини-картинку:
                    <input type="file" accept="image/*" onChange={handleMiniImageUpload}/>
                </label>
            </div>

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
                    width={290}
                    height={680}
                    style={{
                        backgroundColor: "white",
                        border: "1px solid black",
                    }}
                ></canvas>
            </div>


            {/* Скрытый канвас для штрихкода */}
            <canvas
                ref={barcodeCanvasRef}
                width={230}
                height={150}
                style={{display: "none"}}
            ></canvas>

            {/* Панель ввода текста */}
            <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
                {fields.map((field, index) => (
                    <div key={index}>
                        <label>
                            Поле {index + 1}:
                            <input
                                type="text"
                                value={field.text}
                                onChange={(e) => handleTextChange(index, e.target.value)}
                                style={{
                                    marginLeft: "10px",
                                    padding: "5px",
                                    width: "300px",
                                }}
                            />
                        </label>
                    </div>
                ))}
            </div>

            {/* Панель управления мини-картинкой */}
            {miniImage && (
                <div style={{marginTop: "20px"}}>
                    <label>
                        Позиция мини-картинки по X:
                        <input
                            type="number"
                            value={miniImagePosition.x}
                            onChange={(e) =>
                                setMiniImagePosition({...miniImagePosition, x: parseInt(e.target.value, 10)})
                            }
                            style={{marginLeft: "10px", width: "80px"}}
                        />
                    </label>
                    <label style={{marginLeft: "20px"}}>
                        Позиция мини-картинки по Y:
                        <input
                            type="number"
                            value={miniImagePosition.y}
                            onChange={(e) =>
                                setMiniImagePosition({...miniImagePosition, y: parseInt(e.target.value, 10)})
                            }
                            style={{marginLeft: "10px", width: "80px"}}
                        />
                    </label>
                </div>
            )}

            {/* Панель управления штрихкодом */}
            <div style={{marginTop: "20px"}}>
                <label>
                    Ширина штрихкода:
                    <input
                        type="number"
                        value={barcodeWidth}
                        onChange={(e) => setBarcodeWidth(parseFloat(e.target.value))}
                        style={{marginLeft: "10px", width: "80px"}}
                    />
                </label>
                <label style={{marginLeft: "20px"}}>
                    Высота штрихкода:
                    <input
                        type="number"
                        value={barcodeHeight}
                        onChange={(e) => setBarcodeHeight(parseInt(e.target.value, 10))}
                        style={{marginLeft: "10px", width: "80px"}}
                    />
                </label>
            </div>
        </div>
    );
};

export default AddMiniImage;
