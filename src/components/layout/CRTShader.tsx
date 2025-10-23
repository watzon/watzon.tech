'use client';

import { useEffect, useRef } from 'react';
import { usePhosphorColor } from '@/contexts/PhosphorContext';

interface CRTShaderProps {
  enabled: boolean;
}

export default function CRTShader({ enabled }: CRTShaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const { colorConfig } = usePhosphorColor();

  // Helper function to convert hex to RGB
  const hexToRgb = (hex: string): [number, number, number] => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? [
          parseInt(result[1], 16) / 255,
          parseInt(result[2], 16) / 255,
          parseInt(result[3], 16) / 255,
        ]
      : [0, 1, 0]; // Default to green if parsing fails
  };

  // Simplified and optimized CRT shader
  const vertexShaderSource = `
    attribute vec2 a_position;
    varying vec2 v_uv;

    void main() {
      v_uv = a_position * 0.5 + 0.5;
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;

  const fragmentShaderSource = `
    precision mediump float;
    varying vec2 v_uv;
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform vec3 u_phosphor_color;

    // Advanced noise function
    float noise(vec2 p) {
      return fract(sin(dot(p.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    }

    // Screen wiggle effect
    float onOff(float a, float b, float c) {
      return step(c, sin(u_time + a*cos(u_time*b)));
    }

    // Smooth ramp function
    float ramp(float y, float start, float end) {
      float inside = step(start,y) - step(end,y);
      float fact = (y-start)/(end-start)*inside;
      return (1.-fact) * inside;
    }

    // Animated scanlines
    float stripes(vec2 uv) {
      float noi = noise(uv*vec2(0.5,1.) + vec2(1.,3.));
      return ramp(mod(uv.y*4. + u_time/2.+sin(u_time + sin(u_time*0.63)),1.),0.5,0.6)*noi;
    }

    // Screen distortion effect
    vec2 screenDistort(vec2 uv) {
      uv -= vec2(.5,.5);
      float distortAmount = 0.15;
      uv = uv*(1.0 + distortAmount*(uv.x*uv.x*uv.y*uv.y));
      uv += vec2(.5,.5);
      return uv;
    }

    void main() {
      vec2 uv = v_uv;

      // Apply screen distortion
      uv = screenDistort(uv);

      // Advanced scanlines with temporal animation
      float scanline1 = sin(uv.y * 1200.0 + u_time * 15.0);
      float scanline2 = sin(uv.y * 2400.0 + u_time * 20.0);
      float scanline = scanline1 * 0.03 + scanline2 * 0.02 + 0.95;

      // Dynamic phosphor color with scanlines
      vec3 col = u_phosphor_color * scanline;

      // Add moving horizontal stripes (more intense)
      col += stripes(uv) * 0.25;

      // Screen curvature vignette (stronger)
      vec2 centered = uv - 0.5;
      float dist = length(centered);
      float vignette = pow(1.0 - dist * 2.0, 2.0);
      col *= vignette;

      // Enhanced noise with temporal component (more visible)
      float noise1 = noise(vec2(u_time * 0.8, uv.y * 150.0));
      float noise2 = noise(uv * 3.0 + u_time * 0.5);
      float noise3 = noise(uv * 8.0 + u_time * 1.2);
      float totalNoise = (noise1 * 0.08 + noise2 * 0.04 + noise3 * 0.02);
      col += totalNoise;

      // Stronger flicker with complexity
      float flicker1 = sin(u_time * 12.0) * 0.015;
      float flicker2 = sin(u_time * 8.0) * 0.01;
      float flicker3 = sin(u_time * 5.0) * 0.008;
      float flicker = 1.0 + flicker1 + flicker2 + flicker3;
      col *= flicker;

      // Phosphor glow effect
      col = pow(col, vec3(0.8));

      // Dynamic color chromatic aberration
      vec2 aberration = vec2(0.002, 0.0);
      float r = col.r * 0.6;
      float g = col.g;
      float b = col.b * 0.6;
      col = vec3(r, g, b);

      // Apply to alpha channel for overlay effect (much more visible)
      float alpha = 0.35; // Much more prominent overlay

      gl_FragColor = vec4(col, alpha);
    }
  `;

  useEffect(() => {
    if (!enabled) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', {
      alpha: true,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false
    });

    if (!gl) {
      console.warn('WebGL not supported, CRT shader disabled');
      return;
    }

    glRef.current = gl;

    // Create and compile shaders
    const createShader = (source: string, type: number) => {
      const shader = gl!.createShader(type);
      if (!shader) return null;

      gl!.shaderSource(shader, source);
      gl!.compileShader(shader);

      if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl!.getShaderInfoLog(shader));
        gl!.deleteShader(shader);
        return null;
      }

      return shader;
    };

    const vertexShader = createShader(vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = createShader(fragmentShaderSource, gl.FRAGMENT_SHADER);

    if (!vertexShader || !fragmentShader) return;

    // Create program
    const program = gl.createProgram();
    if (!program) return;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }

    programRef.current = program;
    gl.useProgram(program);

    // Set up geometry (full screen quad)
    const vertices = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
       1,  1,
    ]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Get uniform locations
    const timeLocation = gl.getUniformLocation(program, 'u_time');
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    const phosphorColorLocation = gl.getUniformLocation(program, 'u_phosphor_color');

    // Resize canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Animation loop
    const startTime = Date.now();

    const render = () => {
      if (!gl || !program) return;

      const currentTime = (Date.now() - startTime) / 1000;

      // Update uniforms
      gl.uniform1f(timeLocation, currentTime);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

      // Update phosphor color uniform
      const phosphorRgb = hexToRgb(colorConfig.primary);
      gl.uniform3f(phosphorColorLocation, phosphorRgb[0], phosphorRgb[1], phosphorRgb[2]);

      // Clear and draw
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      // Enable blending for overlay effect
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (gl) {
        gl.deleteProgram(program);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
        gl.deleteBuffer(buffer);
      }
    };
  }, [enabled, colorConfig.primary, fragmentShaderSource, vertexShaderSource]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-40"
      style={{
        width: '100%',
        height: '100%',
        mixBlendMode: 'screen'
      }}
    />
  );
}