import { useCallback, useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import * as poseDetection from '@tensorflow-models/pose-detection';
import { KEYPOINTS, getTrackingMidpoint } from '../utils/scoring';

// Pairs of keypoint indices to draw skeleton bones
const SKELETON_CONNECTIONS = [
  [KEYPOINTS.NOSE, KEYPOINTS.LEFT_EYE],
  [KEYPOINTS.NOSE, KEYPOINTS.RIGHT_EYE],
  [KEYPOINTS.LEFT_EYE, KEYPOINTS.LEFT_EAR],
  [KEYPOINTS.RIGHT_EYE, KEYPOINTS.RIGHT_EAR],
  [KEYPOINTS.LEFT_SHOULDER, KEYPOINTS.RIGHT_SHOULDER],
  [KEYPOINTS.LEFT_SHOULDER, KEYPOINTS.LEFT_ELBOW],
  [KEYPOINTS.LEFT_ELBOW, KEYPOINTS.LEFT_WRIST],
  [KEYPOINTS.RIGHT_SHOULDER, KEYPOINTS.RIGHT_ELBOW],
  [KEYPOINTS.RIGHT_ELBOW, KEYPOINTS.RIGHT_WRIST],
  [KEYPOINTS.LEFT_SHOULDER, KEYPOINTS.LEFT_HIP],
  [KEYPOINTS.RIGHT_SHOULDER, KEYPOINTS.RIGHT_HIP],
  [KEYPOINTS.LEFT_HIP, KEYPOINTS.RIGHT_HIP],
  [KEYPOINTS.LEFT_HIP, KEYPOINTS.LEFT_KNEE],
  [KEYPOINTS.LEFT_KNEE, KEYPOINTS.LEFT_ANKLE],
  [KEYPOINTS.RIGHT_HIP, KEYPOINTS.RIGHT_KNEE],
  [KEYPOINTS.RIGHT_KNEE, KEYPOINTS.RIGHT_ANKLE],
];

export function usePoseDetection({ onFrameMetric, isTestingActive = false, isSimulation = false }) {
  const [detector, setDetector] = useState(null);
  const [isLoadingModel, setIsLoadingModel] = useState(true);
  const [cameraActive, setCameraActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [poseDetected, setPoseDetected] = useState(false);
  const [currentVelocity, setCurrentVelocity] = useState(0);
  const [totalDisplacement, setTotalDisplacement] = useState(0);
  const [repsCount, setRepsCount] = useState(0);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const animFrameIdRef = useRef(null);
  const prevMidpointRef = useRef(null);
  const lastDirectionRef = useRef(0); // -1 for left, 1 for right
  const simulationTimeRef = useRef(0);

  // 1. Initialize TensorFlow Backend & MoveNet Model
  useEffect(() => {
    let isMounted = true;

    async function loadModel() {
      try {
        setIsLoadingModel(true);
        setErrorMessage(null);
        await tf.ready();
        await tf.setBackend('webgl');

        const detectorConfig = {
          modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
          enableSmoothing: true,
        };
        const loadedDetector = await poseDetection.createDetector(
          poseDetection.SupportedModels.MoveNet,
          detectorConfig
        );

        if (isMounted) {
          setDetector(loadedDetector);
          setIsLoadingModel(false);
        }
      } catch (err) {
        console.warn('Failed to load MoveNet WebGL backend, attempting CPU:', err);
        try {
          await tf.setBackend('cpu');
          const loadedDetector = await poseDetection.createDetector(
            poseDetection.SupportedModels.MoveNet,
            { modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING }
          );
          if (isMounted) {
            setDetector(loadedDetector);
            setIsLoadingModel(false);
          }
        } catch (cpuErr) {
          console.error('Pose detector initialization failed:', cpuErr);
          if (isMounted) {
            setErrorMessage('Could not load camera AI model. Switching to Simulation Mode.');
            setIsLoadingModel(false);
          }
        }
      }
    }

    loadModel();

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Start Camera Stream
  const startCamera = useCallback(async () => {
    try {
      setErrorMessage(null);
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: 'user',
          },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play();
            setCameraActive(true);
          };
        }
      } else {
        setErrorMessage('Webcam not supported in this browser. Running Simulation Mode.');
      }
    } catch (err) {
      console.warn('Camera permission denied or device not found:', err);
      setErrorMessage('Camera access was denied or is unavailable. Switch to Simulation Mode.');
      setCameraActive(false);
    }
  }, []);

  // Stop Camera
  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  }, []);

  // Reset tracking state
  const resetMetrics = useCallback(() => {
    prevMidpointRef.current = null;
    lastDirectionRef.current = 0;
    setTotalDisplacement(0);
    setRepsCount(0);
    setCurrentVelocity(0);
  }, []);

  // 3. Render Skeleton onto Canvas
  const drawPose = useCallback((keypoints, ctx, width, height, isSim = false) => {
    ctx.clearRect(0, 0, width, height);

    if (!keypoints || keypoints.length === 0) return;

    // Scale keypoints to pixel dimensions if MoveNet returns normalized [0, 1] range
    const pixelKeypoints = keypoints.map((kp) => {
      if (!kp) return kp;
      const isNorm = kp.x <= 1.05 && kp.y <= 1.05 && width > 1;
      return {
        ...kp,
        x: isNorm ? kp.x * width : kp.x,
        y: isNorm ? kp.y * height : kp.y,
      };
    });

    // Draw Skeleton Lines
    ctx.lineWidth = 3;
    ctx.strokeStyle = isSim ? '#06b6d4' : '#10b981'; // Cyan for sim, emerald for live
    ctx.shadowColor = isSim ? 'rgba(6, 182, 212, 0.8)' : 'rgba(16, 185, 129, 0.8)';
    ctx.shadowBlur = 10;

    SKELETON_CONNECTIONS.forEach(([i, j]) => {
      const kp1 = pixelKeypoints[i];
      const kp2 = pixelKeypoints[j];
      if (kp1 && kp2 && (kp1.score || 1) > 0.3 && (kp2.score || 1) > 0.3) {
        ctx.beginPath();
        // Mirror x if it's camera feed
        const x1 = isSim ? kp1.x : width - kp1.x;
        const x2 = isSim ? kp2.x : width - kp2.x;
        ctx.moveTo(x1, kp1.y);
        ctx.lineTo(x2, kp2.y);
        ctx.stroke();
      }
    });

    // Draw Keypoint Nodes
    pixelKeypoints.forEach((kp, idx) => {
      if (!kp || (kp.score || 1) < 0.3) return;
      const x = isSim ? kp.x : width - kp.x;
      const y = kp.y;

      const isAnkleOrHip = [
        KEYPOINTS.LEFT_ANKLE,
        KEYPOINTS.RIGHT_ANKLE,
        KEYPOINTS.LEFT_HIP,
        KEYPOINTS.RIGHT_HIP,
      ].includes(idx);

      ctx.beginPath();
      ctx.arc(x, y, isAnkleOrHip ? 6 : 4, 0, 2 * Math.PI);
      ctx.fillStyle = isAnkleOrHip ? '#f97316' : '#ffffff';
      ctx.shadowColor = isAnkleOrHip ? '#f97316' : '#10b981';
      ctx.shadowBlur = 12;
      ctx.fill();

      // Outer ring for ankles (our primary agility keypoints)
      if (idx === KEYPOINTS.LEFT_ANKLE || idx === KEYPOINTS.RIGHT_ANKLE) {
        ctx.beginPath();
        ctx.arc(x, y, 11, 0, 2 * Math.PI);
        ctx.strokeStyle = '#f97316';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });

    // Draw Tracking Midpoint (Center of Lateral Mass)
    const mid = getTrackingMidpoint(keypoints, 0.3, width, height);
    if (mid) {
      const midX = isSim ? mid.x : width - mid.x;
      ctx.beginPath();
      ctx.arc(midX, mid.y, 8, 0, 2 * Math.PI);
      ctx.fillStyle = '#10b981';
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 16;
      ctx.fill();

      // Horizontal tracking guide line
      ctx.beginPath();
      ctx.moveTo(midX - 25, mid.y);
      ctx.lineTo(midX + 25, mid.y);
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.8)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }, []);

  // 4. Main Detection Loop (Webcam or Simulation)
  useEffect(() => {
    let isLooping = true;

    async function detect() {
      if (!isLooping) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (isSimulation) {
        // --- SIMULATION MODE: Kinematic Athlete Model ---
        if (canvas) {
          const width = canvas.width || 640;
          const height = canvas.height || 480;
          const ctx = canvas.getContext('2d');

          simulationTimeRef.current += 0.05;
          const t = simulationTimeRef.current;

          // Lateral oscillation (shuffling side to side)
          const amplitude = width * 0.28;
          const centerX = width / 2 + Math.sin(t * 2.2) * amplitude;
          const bounceY = Math.abs(Math.sin(t * 4.4)) * 14;

          const headY = 110 + bounceY;
          const shoulderY = 160 + bounceY;
          const hipY = 270 + bounceY;
          const kneeY = 360 + bounceY * 0.5;
          const ankleY = 440;

          const simKeypoints = [
            { x: centerX, y: headY, score: 0.95 }, // nose
            { x: centerX - 8, y: headY - 5, score: 0.95 },
            { x: centerX + 8, y: headY - 5, score: 0.95 },
            { x: centerX - 18, y: headY, score: 0.9 },
            { x: centerX + 18, y: headY, score: 0.9 },
            { x: centerX - 45, y: shoulderY, score: 0.95 }, // l shoulder
            { x: centerX + 45, y: shoulderY, score: 0.95 }, // r shoulder
            { x: centerX - 65, y: shoulderY + 50, score: 0.9 }, // l elbow
            { x: centerX + 65, y: shoulderY + 50, score: 0.9 }, // r elbow
            { x: centerX - 50, y: shoulderY + 90, score: 0.9 }, // l wrist
            { x: centerX + 50, y: shoulderY + 90, score: 0.9 }, // r wrist
            { x: centerX - 30, y: hipY, score: 0.95 }, // l hip
            { x: centerX + 30, y: hipY, score: 0.95 }, // r hip
            { x: centerX - 35, y: kneeY, score: 0.95 }, // l knee
            { x: centerX + 35, y: kneeY, score: 0.95 }, // r knee
            { x: centerX - 40 + Math.sin(t * 4.4) * 15, y: ankleY, score: 0.95 }, // l ankle
            { x: centerX + 40 - Math.sin(t * 4.4) * 15, y: ankleY, score: 0.95 }, // r ankle
          ];

          setPoseDetected(true);
          drawPose(simKeypoints, ctx, width, height, true);

          // Process Metrics if active
          if (isTestingActive) {
            const mid = getTrackingMidpoint(simKeypoints, 0.3, width, height);
            if (mid && prevMidpointRef.current) {
              const deltaX = Math.abs(mid.x - prevMidpointRef.current.x);
              const dir = mid.x - prevMidpointRef.current.x > 0 ? 1 : -1;

              // Check direction reversal (shuffle rep)
              if (lastDirectionRef.current !== 0 && dir !== lastDirectionRef.current && deltaX > 1.5) {
                setRepsCount((r) => r + 1);
              }
              lastDirectionRef.current = dir;

              setTotalDisplacement((prev) => {
                const next = prev + deltaX;
                if (onFrameMetric) {
                  onFrameMetric({ deltaX, totalDisplacement: next, currentX: mid.x });
                }
                return next;
              });

              setCurrentVelocity(Math.round(deltaX * 30));
            }
            prevMidpointRef.current = mid;
          }
        }
      } else if (detector && video && video.readyState >= 2 && canvas) {
        // --- REAL WEBCAM MOVENET INFERENCE ---
        const width = video.videoWidth || 640;
        const height = video.videoHeight || 480;

        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
        }

        const ctx = canvas.getContext('2d');

        try {
          const poses = await detector.estimatePoses(video, {
            maxPoses: 1,
            flipHorizontal: false,
          });

          if (poses && poses.length > 0) {
            const keypoints = poses[0].keypoints;
            setPoseDetected(true);
            drawPose(keypoints, ctx, width, height, false);

            if (isTestingActive) {
              // Pass width and height to scale normalized [0, 1] MoveNet coordinates to canvas pixels
              const mid = getTrackingMidpoint(keypoints, 0.28, width, height);

              if (mid) {
                // Log raw and scaled mid.x for verification
                console.log(
                  `[KhelAI Pose] raw mid.x: ${mid.rawX !== null ? mid.rawX.toFixed(4) : 'null'} | scaled mid.x: ${mid.x.toFixed(2)}px (canvas width: ${width}px, isNorm: ${mid.isNormalized}) | tracked: ${mid.type}`
                );
              }

              if (mid && prevMidpointRef.current) {
                const deltaX = Math.abs(mid.x - prevMidpointRef.current.x);

                console.log(
                  `[KhelAI Motion] deltaX: ${deltaX.toFixed(2)}px (prev: ${prevMidpointRef.current.x.toFixed(2)} -> curr: ${mid.x.toFixed(2)})`
                );

                // Filter out small jitter (< 1.2px) and massive frame teleportation skips (> 80px)
                if (deltaX > 1.2 && deltaX < 80) {
                  const dir = mid.x - prevMidpointRef.current.x > 0 ? 1 : -1;

                  // Direction change detection (shuffle rep)
                  if (lastDirectionRef.current !== 0 && dir !== lastDirectionRef.current && deltaX > 2.0) {
                    setRepsCount((r) => r + 1);
                  }
                  lastDirectionRef.current = dir;

                  setTotalDisplacement((prev) => {
                    const next = prev + deltaX;
                    if (onFrameMetric) {
                      onFrameMetric({ deltaX, totalDisplacement: next, currentX: mid.x });
                    }
                    return next;
                  });

                  setCurrentVelocity(Math.round(deltaX * 30));
                }
              }
              prevMidpointRef.current = mid;
            }
          } else {
            ctx.clearRect(0, 0, width, height);
            setPoseDetected(false);
          }
        } catch (err) {
          console.warn('Pose estimation frame error:', err);
        }
      }

      animFrameIdRef.current = requestAnimationFrame(detect);
    }

    detect();

    return () => {
      isLooping = false;
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [detector, cameraActive, isSimulation, isTestingActive, drawPose, onFrameMetric]);

  return {
    videoRef,
    canvasRef,
    isLoadingModel,
    cameraActive,
    poseDetected,
    errorMessage,
    currentVelocity,
    totalDisplacement,
    repsCount,
    startCamera,
    stopCamera,
    resetMetrics,
  };
}
