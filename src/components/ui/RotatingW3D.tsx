'use client';

import { useEffect, useRef, useState } from 'react';
import { usePhosphorColor } from '@/contexts/PhosphorContext';

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface Point2D {
  x: number;
  y: number;
}

interface RotatingW3DProps {
  size?: number;
  className?: string;
}

export default function RotatingW3D({ size = 80, className = '' }: RotatingW3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const { colorConfig } = usePhosphorColor();
  const [isVisible, setIsVisible] = useState(true);

  // Define the 3D shape of "W" as a grid of points
  const createWPoints = (): Point3D[][] => {
    const points: Point3D[][] = [];
    const scale = 1.0; // Reduced scale for smaller W

    // W shape pattern in 3D space (corrected - flipped horizontally)
    const wPattern = [
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [1, 0, 1, 0, 1],
      [1, 1, 0, 1, 1],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
    ];

    for (let row = 0; row < wPattern.length; row++) {
      points[row] = [];
      for (let col = 0; col < wPattern[row].length; col++) {
        if (wPattern[row][col] === 1) {
          points[row][col] = {
            x: (col - 2) * scale,
            y: (row - 3.5) * scale,
            z: Math.random() * 0.2, // Add slight depth variation
          };
        } else {
          points[row][col] = null as unknown as Point3D;
        }
      }
    }

    return points;
  };

  // 3D to 2D projection
  const project3D = (point: Point3D, rotation: number, canvasSize: number): Point2D => {
    // Apply rotation around Y axis - make sure ALL points rotate together
    const cos = Math.cos(rotation);
    const sin = Math.sin(rotation);
    const rotatedX = point.x * cos - point.z * sin;
    const rotatedZ = point.x * sin + point.z * cos;

    // Perspective projection with less dramatic scaling
    const perspective = 8; // Increased for less distortion
    const scale = perspective / (perspective + rotatedZ);

    return {
      x: rotatedX * scale * 6 + canvasSize / 2, // Reduced multiplier for smaller overall size
      y: point.y * 6 + canvasSize / 2,
    };
  };

  // ASCII characters for different depths - brighter and more consistent
  const getAsciiChar = (depth: number): string => {
    // Use only the brightest characters to avoid dimming too much
    const chars = ['█', '▓', '▒', '█']; // Repeating █ for brightness
    const index = Math.min(Math.floor(Math.abs(depth) * 3), 3);
    return chars[index];
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = size;
    canvas.height = size;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    const wPoints = createWPoints();
    let rotation = 0;

    const animate = () => {
      if (!ctx || !canvas) return;

      // Clear canvas
      ctx.fillStyle = 'transparent';
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update rotation
      rotation += 0.02;

      // Set font for ASCII characters
      ctx.font = '8px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Create depth-sorted points for rendering
      const renderPoints: Array<{
        point: Point3D;
        projected: Point2D;
        row: number;
        col: number;
        depth: number;
      }> = [];

      // Calculate projected points and depths
      for (let row = 0; row < wPoints.length; row++) {
        for (let col = 0; col < wPoints[row].length; col++) {
          if (wPoints[row][col]) {
            const projected = project3D(wPoints[row][col], rotation, size);
            // Calculate depth for sorting (inverse of Z for proper back-to-front)
            const cos = Math.cos(rotation);
            const sin = Math.sin(rotation);
            const depth = wPoints[row][col].x * sin + wPoints[row][col].z * cos;

            renderPoints.push({
              point: wPoints[row][col],
              projected,
              row,
              col,
              depth
            });
          }
        }
      }

      // Sort by depth (back to front)
      renderPoints.sort((a, b) => b.depth - a.depth);

      // Render all points
      renderPoints.forEach(({ projected, depth }) => {
        const char = getAsciiChar(depth);
        // Keep opacity much higher to avoid dimming
        const opacity = Math.max(0.7, 1 - Math.abs(depth) * 0.2);

        // Use phosphor color with varying opacity
        const rgb = colorConfig.primary.replace('#', '');
        const r = parseInt(rgb.substr(0, 2), 16);
        const g = parseInt(rgb.substr(2, 2), 16);
        const b = parseInt(rgb.substr(4, 2), 16);

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
        ctx.fillText(char, projected.x, projected.y);
      });

      // Add glow effect for the whole W
      ctx.shadowBlur = 4;
      ctx.shadowColor = colorConfig.primary;

      animationRef.current = requestAnimationFrame(animate);
    };

    if (isVisible) {
      animate();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [size, colorConfig, isVisible]);

  // Handle visibility for performance
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return (
    <div className={`relative inline-block ${className}`}>
      <canvas
        ref={canvasRef}
        className="block"
        style={{
          imageRendering: 'pixelated',
          filter: `drop-shadow(0 0 6px ${colorConfig.primary}40)`,
        }}
      />
      {/* Subtle terminal-style border */}
      <div
        className="absolute inset-0 border border-phosphor-primary/20 rounded-sm pointer-events-none"
        style={{
          boxShadow: `inset 0 0 8px ${colorConfig.primary}10`,
        }}
      />
    </div>
  );
}