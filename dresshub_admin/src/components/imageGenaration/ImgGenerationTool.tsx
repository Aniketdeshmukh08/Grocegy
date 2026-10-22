import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import { HexColorPicker } from "react-colorful";
import { FaImage, FaTextWidth } from "react-icons/fa";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange }) => (
  <div>
    <HexColorPicker color={color} onChange={onChange} className="rounded shadow-sm" />
    <div className="mt-2"><span className="badge bg-secondary p-2">{color}</span></div>
  </div>
);

const ImgGenerationTool: React.FC = () => {
  const [bgColor, setBgColor] = useState("#ffffff");
  const [image, setImage] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [textColor, setTextColor] = useState("#000000");
  const [fontSize, setFontSize] = useState<number>(16);
  const [fontFamily, setFontFamily] = useState("Arial");
  const [isBold, setIsBold] = useState(false);
  const [isBlurred, setIsBlurred] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const canvasWidth = 500;
  const canvasHeight = 500;

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImage(null);
    }
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const fontWeight = isBold ? "bold" : "normal";
    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    ctx.fillStyle = textColor;

    const drawText = () => {
      const maxWidth = canvas.width - 40;
      const x = canvas.width / 2;
      let y = 100;

      ctx.textAlign = "center";
      ctx.textBaseline = "top";

      const lines = text.split("/n");

      lines.forEach((rawLine) => {
        const words = rawLine.split(" ");
        let line = "";

        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + " ";
          const metrics = ctx.measureText(testLine);
          const testWidth = metrics.width;

          if (testWidth > maxWidth && n > 0) {
            ctx.fillText(line.trim(), x, y);
            line = words[n] + " ";
            y += fontSize * 1.4;
          } else {
            line = testLine;
          }
        }

        if (line) {
          ctx.fillText(line.trim(), x, y);
          y += fontSize * 1.4;
        }
      });
    };



    if (image) {
      const img = new Image();
      img.src = image;
      img.onload = () => {
        if (isBlurred) {
          ctx.filter = "blur(1px)";
        } else {
          ctx.filter = "none";
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        ctx.filter = "none";
        drawText();
      };
    } else if (text) {
      drawText();
    }
    

  };

  const saveImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.href = canvas.toDataURL();
    link.download = "generated_image.png";
    link.click();
  };

  useEffect(() => {
    if (submitted) drawCanvas();
  }, [bgColor, image, text, textColor, fontSize, fontFamily, isBold, isBlurred, submitted]);

  return (
    <div className="">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-lg border-0 rounded-4 p-4 bg-light">
            <h2 className="text-center text-primary mb-4 fw-bold">🎨 Design Your Custom Image</h2>

            <div className="row justify-content-center">
              <div className="col-lg-6">
                <div className="mb-4">
                  <h5>1. Choose Background Color</h5>
                  <ColorPicker color={bgColor} onChange={setBgColor} />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="mb-4">
                  <h5>2. Upload Image <FaImage className="text-secondary ms-2" /></h5>
                  <input type="file" accept="image/*" className="form-control" onChange={handleImageUpload} />
                  {image && (
                    <div className="form-check mt-2">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="blurCheck"
                        checked={isBlurred}
                        onChange={(e) => setIsBlurred(e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="blurCheck">
                        Blur Image
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>





            <div className="mb-4">
              <h5>3. Enter Text <FaTextWidth className="text-secondary ms-2" /></h5>
              <textarea
                className="form-control"
                rows={3}
                placeholder="Use /n for line breaks"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>

            {text && (<div className="row justify-content-center">
              <div className="col-lg-6">
                <div className="mb-4">
                  <h5>4. Text Color</h5>
                  <ColorPicker color={textColor} onChange={setTextColor} />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="row mb-4">
                  <div className="col-md-6">
                    <h5>5. Font Size</h5>
                    <select className="form-select" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))}>
                      <option value="16">16px</option>
                      <option value="20">20px</option>
                      <option value="24">24px</option>
                      <option value="30">30px</option>
                      <option value="40">40px</option>
                      <option value="50">50px</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <h5>6. Font Family</h5>
                    <select className="form-select" value={fontFamily} onChange={(e) => setFontFamily(e.target.value)}>
                      
                      <option value="Courier New">Courier New</option>
                      <option value="Cambria">Cambria</option>
                      <option value="Candara">Candara</option>
                      <option value="Copperplate Gothic">Copperplate Gothic</option>
                      <option value="Georgia">Georgia</option>
                      <option value="Verdana">Verdana</option>
                      <option value="Comic Sans MS">Comic Sans MS</option>
                      <option value="Tahoma">Tahoma</option>
                      <option value="Impact">Impact</option>
                      <option value="Arial">Arial</option>
                      <option value="Times New Roman">Times New Roman</option>
                    </select>
                  </div>
                </div>

                <div className="form-check mb-4">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="boldCheck"
                    checked={isBold}
                    onChange={(e) => setIsBold(e.target.checked)}
                  />
                  <label htmlFor="boldCheck" className="form-check-label">Bold Text</label>
                </div>
              </div>
            </div>
            )}

            <div className="d-grid gap-2">
              <button className="btn btn-primary btn-lg" onClick={() => setSubmitted(true)}>Generate Image</button>
              <button className="btn btn-success btn-lg" onClick={saveImage}>Save Image</button>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card shadow-lg border-0 rounded-4 p-4 bg-light">
            {/* {submitted && ( */}
            <h2 className="text-center text-primary mb-4 fw-bold">Preview</h2>
            <div className="text-center mt-5">
              {/* <h4 className="mb-3">Preview</h4> */}
              <canvas
                ref={canvasRef}
                width={canvasWidth}
                height={canvasHeight}
                style={{ border: "2px dashed #ccc", borderRadius: "12px" }}
              />
            </div>
          </div>
          {/* )} */}
        </div>
      </div>


    </div>
  );
};

export default ImgGenerationTool;
