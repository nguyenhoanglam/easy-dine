"use client";

import QRCode from "qrcode";
import { useEffect, useRef } from "react";

import { getTableLink } from "@/lib/utils";

interface Props {
  token: string;
  tableNumber: number;
  width?: number;
}

export const TableQRCode = ({ token, tableNumber, width = 250 }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = width;
      canvas.height = width + 60;

      const canvasContext = canvas.getContext("2d")!;
      canvasContext.fillStyle = "#fff";
      canvasContext.fillRect(0, 0, canvas.width, canvas.height);
      canvasContext.font = "bold 16px Roboto, sans-serif";
      canvasContext.textAlign = "center";
      canvasContext.fillStyle = "#000";
      canvasContext.fillText(`Bàn số ${tableNumber}`, width / 2, width + 20);
      canvasContext.fillText("Quét mã QR để gọi món", width / 2, width + 40);

      const qrCanvas = document.createElement("canvas");
      QRCode.toCanvas(
        qrCanvas,
        getTableLink({ token, tableNumber }),
        { width, margin: 4 },
        function (error) {
          if (error) {
            console.error(error);
          }

          canvasContext.drawImage(qrCanvas, 0, 0, width, width);
        },
      );
    }
  }, [token, tableNumber, width]);

  return <canvas ref={canvasRef} />;
};
