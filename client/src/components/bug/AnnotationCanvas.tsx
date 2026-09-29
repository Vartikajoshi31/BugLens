import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Square,
  Circle as CircleIcon,
  MoveRight,
  Type,
  EyeOff,
  Highlighter,
  Undo2,
  Redo2,
  Trash2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  MousePointer,
  Check,
  Sparkles,
} from 'lucide-react';
import { Button } from '../ui/Button';

export type ToolType = 'select' | 'rectangle' | 'circle' | 'arrow' | 'text' | 'blur' | 'highlight';

export interface Annotation {
  id: string;
  tool: ToolType;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  text?: string;
  points?: { x: number; y: number }[];
}

interface AnnotationCanvasProps {
  imageSrc: string;
  onExport: (annotatedDataUrl: string) => void;
}

export const AnnotationCanvas: React.FC<AnnotationCanvasProps> = ({ imageSrc, onExport }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [activeTool, setActiveTool] = useState<ToolType>('rectangle');
  const [activeColor, setActiveColor] = useState<string>('#ef4444'); // Default red indicator
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [history, setHistory] = useState<Annotation[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const [zoom, setZoom] = useState<number>(1);
  const [textInput, setTextInput] = useState<{ x: number; y: number; text: string } | null>(null);

  const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null);

  // Colors available for annotations
  const colors = ['#ef4444', '#f97316', '#eab308', '#10b981', '#3b82f6', '#8b5cf6', '#ffffff'];

  // Load image
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;
    img.onload = () => {
      setImageObj(img);
    };
  }, [imageSrc]);

  // History Push Helper
  const pushHistory = useCallback((newAnnotations: Annotation[]) => {
    const newHist = history.slice(0, historyIndex + 1);
    newHist.push(newAnnotations);
    setHistory(newHist);
    setHistoryIndex(newHist.length - 1);
    setAnnotations(newAnnotations);
  }, [history, historyIndex]);

  const undo = () => {
    if (historyIndex > 0) {
      const prevIdx = historyIndex - 1;
      setHistoryIndex(prevIdx);
      setAnnotations(history[prevIdx]);
      setSelectedId(null);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextIdx = historyIndex + 1;
      setHistoryIndex(nextIdx);
      setAnnotations(history[nextIdx]);
      setSelectedId(null);
    }
  };

  const deleteSelected = () => {
    if (selectedId) {
      const updated = annotations.filter((a) => a.id !== selectedId);
      pushHistory(updated);
      setSelectedId(null);
    }
  };

  const resetCanvas = () => {
    pushHistory([]);
    setSelectedId(null);
    setZoom(1);
  };

  // Render canvas elements
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageObj) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = imageObj.width;
    canvas.height = imageObj.height;

    // Draw background screenshot
    ctx.drawImage(imageObj, 0, 0);

    // Render annotations
    annotations.forEach((ann) => {
      const isSelected = ann.id === selectedId;

      ctx.save();

      if (ann.tool === 'blur') {
        // Pixelate / Blur region
        const x = Math.min(ann.x, ann.x + ann.width);
        const y = Math.min(ann.y, ann.y + ann.height);
        const w = Math.abs(ann.width);
        const h = Math.abs(ann.height);

        if (w > 5 && h > 5) {
          const sampleSize = 10;
          for (let py = y; py < y + h; py += sampleSize) {
            for (let px = x; px < x + w; px += sampleSize) {
              const pixelData = ctx.getImageData(px, py, 1, 1).data;
              ctx.fillStyle = `rgb(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]})`;
              ctx.fillRect(px, py, sampleSize, sampleSize);
            }
          }
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 1;
          ctx.setLineDash([4, 4]);
          ctx.strokeRect(x, y, w, h);
        }
      } else if (ann.tool === 'highlight') {
        // Semi-transparent highlight backdrop
        const x = Math.min(ann.x, ann.x + ann.width);
        const y = Math.min(ann.y, ann.y + ann.height);
        const w = Math.abs(ann.width);
        const h = Math.abs(ann.height);

        ctx.fillStyle = 'rgba(250, 204, 21, 0.35)'; // Vibrant yellow transparent
        ctx.fillRect(x, y, w, h);
        ctx.strokeStyle = '#eab308';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, w, h);
      } else if (ann.tool === 'rectangle') {
        ctx.strokeStyle = ann.color;
        ctx.lineWidth = 4;
        ctx.strokeRect(ann.x, ann.y, ann.width, ann.height);
      } else if (ann.tool === 'circle') {
        ctx.strokeStyle = ann.color;
        ctx.lineWidth = 4;
        const radius = Math.sqrt(ann.width * ann.width + ann.height * ann.height) / 2;
        const centerX = ann.x + ann.width / 2;
        const centerY = ann.y + ann.height / 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, Math.max(radius, 5), 0, Math.PI * 2);
        ctx.stroke();
      } else if (ann.tool === 'arrow') {
        ctx.strokeStyle = ann.color;
        ctx.fillStyle = ann.color;
        ctx.lineWidth = 4;

        const fromX = ann.x;
        const fromY = ann.y;
        const toX = ann.x + ann.width;
        const toY = ann.y + ann.height;

        const headLength = 16;
        const dx = toX - fromX;
        const dy = toY - fromY;
        const angle = Math.atan2(dy, dx);

        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(toX, toY);
        ctx.lineTo(toX - headLength * Math.cos(angle - Math.PI / 6), toY - headLength * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(toX - headLength * Math.cos(angle + Math.PI / 6), toY - headLength * Math.sin(angle + Math.PI / 6));
        ctx.closePath();
        ctx.fill();
      } else if (ann.tool === 'text') {
        ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = ann.color;
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 4;
        ctx.fillText(ann.text || '', ann.x, ann.y);
      }

      // If selected, draw outline bounding box
      if (isSelected) {
        ctx.strokeStyle = '#6366f1';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 6]);
        const padding = 8;
        ctx.strokeRect(
          Math.min(ann.x, ann.x + ann.width) - padding,
          Math.min(ann.y, ann.y + ann.height) - padding,
          Math.abs(ann.width) + padding * 2,
          Math.abs(ann.height) + padding * 2
        );
      }

      ctx.restore();
    });

    // Draw active drawing shape preview
    if (isDrawing && activeTool !== 'select' && activeTool !== 'text') {
      ctx.save();
      const w = currentPos.x - startPos.x;
      const h = currentPos.y - startPos.y;

      if (activeTool === 'blur') {
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(startPos.x, startPos.y, w, h);
      } else if (activeTool === 'highlight') {
        ctx.fillStyle = 'rgba(250, 204, 21, 0.25)';
        ctx.fillRect(startPos.x, startPos.y, w, h);
      } else if (activeTool === 'rectangle') {
        ctx.strokeStyle = activeColor;
        ctx.lineWidth = 4;
        ctx.strokeRect(startPos.x, startPos.y, w, h);
      } else if (activeTool === 'circle') {
        ctx.strokeStyle = activeColor;
        ctx.lineWidth = 4;
        const radius = Math.sqrt(w * w + h * h) / 2;
        ctx.beginPath();
        ctx.arc(startPos.x + w / 2, startPos.y + h / 2, Math.max(radius, 5), 0, Math.PI * 2);
        ctx.stroke();
      } else if (activeTool === 'arrow') {
        ctx.strokeStyle = activeColor;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(startPos.x, startPos.y);
        ctx.lineTo(currentPos.x, currentPos.y);
        ctx.stroke();
      }
      ctx.restore();
    }
  }, [imageObj, annotations, selectedId, isDrawing, activeTool, startPos, currentPos, activeColor]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Handle Mouse / Touch position mapping relative to canvas resolution
  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoords(e);
    setStartPos(coords);
    setCurrentPos(coords);
    setIsDrawing(true);

    if (activeTool === 'text') {
      setTextInput({ x: coords.x, y: coords.y, text: '' });
      setIsDrawing(false);
      return;
    }

    if (activeTool === 'select') {
      // Find clicked annotation
      const clicked = annotations.find(
        (ann) =>
          coords.x >= Math.min(ann.x, ann.x + ann.width) &&
          coords.x <= Math.max(ann.x, ann.x + ann.width) &&
          coords.y >= Math.min(ann.y, ann.y + ann.height) &&
          coords.y <= Math.max(ann.y, ann.y + ann.height)
      );
      setSelectedId(clicked ? clicked.id : null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const coords = getCanvasCoords(e);
    setCurrentPos(coords);
  };

  const handleMouseUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if (activeTool === 'select' || activeTool === 'text') return;

    const w = currentPos.x - startPos.x;
    const h = currentPos.y - startPos.y;

    if (Math.abs(w) < 4 && Math.abs(h) < 4) return;

    const newAnn: Annotation = {
      id: Math.random().toString(36).substring(2, 9),
      tool: activeTool,
      x: startPos.x,
      y: startPos.y,
      width: w,
      height: h,
      color: activeColor,
    };

    pushHistory([...annotations, newAnn]);
  };

  const commitText = () => {
    if (textInput && textInput.text.trim() !== '') {
      const newAnn: Annotation = {
        id: Math.random().toString(36).substring(2, 9),
        tool: 'text',
        x: textInput.x,
        y: textInput.y,
        width: 150,
        height: 30,
        color: activeColor,
        text: textInput.text.trim(),
      };
      pushHistory([...annotations, newAnn]);
    }
    setTextInput(null);
  };

  const exportAnnotatedImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    onExport(dataUrl);
  };

  const tools: { type: ToolType; label: string; icon: React.ReactNode }[] = [
    { type: 'select', label: 'Select', icon: <MousePointer className="w-4 h-4" /> },
    { type: 'rectangle', label: 'Rectangle', icon: <Square className="w-4 h-4" /> },
    { type: 'circle', label: 'Circle', icon: <CircleIcon className="w-4 h-4" /> },
    { type: 'arrow', label: 'Arrow', icon: <MoveRight className="w-4 h-4" /> },
    { type: 'text', label: 'Text', icon: <Type className="w-4 h-4" /> },
    { type: 'blur', label: 'Blur Region', icon: <EyeOff className="w-4 h-4" /> },
    { type: 'highlight', label: 'Highlight', icon: <Highlighter className="w-4 h-4" /> },
  ];

  return (
    <div className="flex flex-col gap-4 w-full" ref={containerRef}>
      {/* Visual Editor Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm">
        {/* Left: Tool Selectors */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {tools.map((t) => (
            <button
              key={t.type}
              onClick={() => {
                setActiveTool(t.type);
                setSelectedId(null);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTool === t.type
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Center: Color Palette */}
        {activeTool !== 'blur' && activeTool !== 'select' && (
          <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-200/60 dark:border-gray-700/60">
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => setActiveColor(c)}
                className={`w-5 h-5 rounded-full transition-transform ${
                  activeColor === c ? 'scale-125 ring-2 ring-brand-500 ring-offset-2 dark:ring-offset-gray-900' : 'hover:scale-110'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        )}

        {/* Right: Actions (Undo, Redo, Delete, Zoom, Export) */}
        <div className="flex items-center gap-1">
          <button
            onClick={undo}
            disabled={historyIndex <= 0}
            className="p-2 rounded-xl text-gray-500 hover:text-gray-900 dark:hover:text-white disabled:opacity-40 transition-colors"
            title="Undo"
          >
            <Undo2 className="w-4 h-4" />
          </button>

          <button
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            className="p-2 rounded-xl text-gray-500 hover:text-gray-900 dark:hover:text-white disabled:opacity-40 transition-colors"
            title="Redo"
          >
            <Redo2 className="w-4 h-4" />
          </button>

          {selectedId && (
            <button
              onClick={deleteSelected}
              className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              title="Delete Selected"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          <div className="h-4 w-px bg-gray-200 dark:bg-gray-800 mx-1" />

          <button
            onClick={() => setZoom((z) => Math.min(z + 0.2, 2.5))}
            className="p-2 rounded-xl text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <button
            onClick={() => setZoom((z) => Math.max(z - 0.2, 0.5))}
            className="p-2 rounded-xl text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <button
            onClick={resetCanvas}
            className="p-2 rounded-xl text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
            title="Reset Canvas"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <Button
            size="sm"
            onClick={exportAnnotatedImage}
            leftIcon={<Sparkles className="w-3.5 h-3.5" />}
            className="ml-2"
          >
            Attach Screenshot
          </Button>
        </div>
      </div>

      {/* Canvas viewport stage */}
      <div className="relative w-full overflow-auto rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-900/90 min-h-[400px] flex items-center justify-center p-4">
        <div style={{ transform: `scale(${zoom})`, transformOrigin: 'center center', transition: 'transform 0.15s ease-out' }}>
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            className="cursor-crosshair shadow-2xl rounded-lg max-w-full"
          />

          {/* Inline Text Input Overlay */}
          {textInput && (
            <div
              className="absolute z-20 flex items-center gap-1"
              style={{
                left: `${(textInput.x / (canvasRef.current?.width || 1)) * 100}%`,
                top: `${(textInput.y / (canvasRef.current?.height || 1)) * 100}%`,
              }}
            >
              <input
                type="text"
                value={textInput.text}
                onChange={(e) => setTextInput({ ...textInput, text: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') commitText();
                  if (e.key === 'Escape') setTextInput(null);
                }}
                placeholder="Type annotation..."
                className="bg-gray-900/90 text-white font-bold text-sm px-3 py-1.5 rounded-lg border-2 border-brand-500 focus:outline-none shadow-xl"
                autoFocus
              />
              <button
                onClick={commitText}
                className="p-1.5 bg-brand-600 text-white rounded-lg hover:bg-brand-500"
              >
                <Check className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
