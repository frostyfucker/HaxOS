import React, { useRef, useEffect } from 'react';

const VirusEffect: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const message = "CONNECTION TERMINATED";
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.font = `bold ${canvas.width / 15}px VT323, monospace`;
        ctx.fillStyle = 'red';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(message, canvas.width / 2, canvas.height / 2);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const { data, width, height } = imageData;
        const pixels = new Uint32Array(data.buffer);

        const meltSpeed = Array(width).fill(0);
        
        let animationFrameId: number;

        const melt = () => {
            for (let i = 0; i < 200; i++) {
                const x = Math.floor(Math.random() * width);
                meltSpeed[x] += 0.05;

                for (let y = height - 1; y > 0; y--) {
                    const meltDist = Math.floor(meltSpeed[x]);
                    if (y - meltDist < 0) continue;
                    
                    const srcIndex = y * width + x;
                    const destIndex = (y - meltDist) * width + x;
                    
                    if (pixels[destIndex] !== 0) { // Don't melt black pixels
                         pixels[srcIndex] = pixels[destIndex];
                    }
                }
            }
            ctx.putImageData(imageData, 0, 0);
            animationFrameId = requestAnimationFrame(melt);
        };
        
        setTimeout(melt, 500);

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-[9999]" />;
};

export default VirusEffect;
