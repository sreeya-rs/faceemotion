import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { Camera, RefreshCw, Music, Sparkles, Play, Info } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/lib/utils";

// --- USER INTEGRATION POINT: Define your MoodAnalysis interface here ---
export interface MoodAnalysis {
  mood: string;
  confidence: number;
  recommendations: {
    title: string;
    artist: string;
    genre: string;
    reason: string;
  }[];
}

export default function Home() {
  const webcamRef = useRef<Webcam>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<MoodAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const capture = useCallback(async () => {
    if (!webcamRef.current) return;
    
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      // --- USER INTEGRATION POINT: Call your ML model here ---
      // Example: 
      // const response = await fetch('YOUR_ML_API_ENDPOINT', { 
      //   method: 'POST', 
      //   body: JSON.stringify({ image: imageSrc }) 
      // });
      // const analysis = await response.json();
      
      // Placeholder simulation:
      await new Promise(resolve => setTimeout(resolve, 1500));
      const mockAnalysis: MoodAnalysis = {
        mood: "Happy",
        confidence: 0.92,
        recommendations: [
          { title: "Walking on Sunshine", artist: "Katrina & The Waves", genre: "Pop", reason: "Perfect for your bright expression!" },
          { title: "Happy", artist: "Pharrell Williams", genre: "Pop", reason: "Matches your positive energy." },
          { title: "Good Vibrations", artist: "The Beach Boys", genre: "Rock", reason: "A classic feel-good track." },
          { title: "Don't Stop Me Now", artist: "Queen", genre: "Rock", reason: "For that unstoppable feeling." },
          { title: "September", artist: "Earth, Wind & Fire", genre: "Disco", reason: "Keep the groove going!" }
        ]
      };
      
      setResult(mockAnalysis);
    } catch (err) {
      console.error(err);
      setError("Failed to analyze mood. Please check your ML model integration.");
    } finally {
      setIsAnalyzing(false);
    }
  }, [webcamRef]);

  const reset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left Column: Camera */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold tracking-tight">
              How are you <span className="text-purple-400">feeling</span> today?
            </h2>
            <p className="text-white/60 text-lg max-w-md">
              Let our AI analyze your expression and curate the perfect soundtrack for your current mood.
            </p>
          </div>

          <div className="relative aspect-video rounded-3xl overflow-hidden bg-white/5 border border-white/10 shadow-2xl group">
            <AnimatePresence mode="wait">
              {!result ? (
                <motion.div
                  key="webcam"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full"
                >
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className="w-full h-full object-cover"
                    videoConstraints={{
                      facingMode: "user",
                      width: 1280,
                      height: 720,
                    }}
                    onUserMedia={() => {}}
                    onUserMediaError={() => {}}
                    mirrored={false}
                    imageSmoothing={true}
                    forceScreenshotSourceSize={false}
                    disablePictureInPicture={true}
                    screenshotQuality={1}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full px-6 flex justify-center">
                    <button
                      onClick={capture}
                      disabled={isAnalyzing}
                      className="group relative flex items-center gap-3 bg-white text-black font-bold px-8 py-4 rounded-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                    >
                      {isAnalyzing ? (
                        <>
                          <RefreshCw className="w-5 h-5 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Camera className="w-5 h-5" />
                          Capture Mood
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="result-preview"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full h-full relative"
                >
                  <img
                    src={webcamRef.current?.getScreenshot() || ""}
                    alt="Captured"
                    className="w-full h-full object-cover blur-sm opacity-40"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                    <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mb-6 border border-purple-500/30">
                      <Sparkles className="w-10 h-10 text-purple-400" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2 uppercase tracking-widest text-purple-400">
                      Mood Detected
                    </h3>
                    <p className="text-5xl font-black mb-4 capitalize">{result.mood}</p>
                    <div className="flex items-center gap-2 text-white/60 mb-8">
                      <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${result.confidence * 100}%` }}
                          className="h-full bg-purple-500"
                        />
                      </div>
                      <span className="text-sm font-mono">
                        {Math.round(result.confidence * 100)}% Confidence
                      </span>
                    </div>
                    <button
                      onClick={reset}
                      className="text-sm font-medium text-white/40 hover:text-white transition-colors flex items-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Try Again
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm flex items-center gap-3">
              <Info className="w-5 h-5 shrink-0" />
              {error}
            </div>
          )}
        </div>

        {/* Right Column: Recommendations */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold flex items-center gap-3">
              <Music className="w-6 h-6 text-purple-400" />
              Recommended Tracks
            </h3>
            {result && (
              <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-xs font-bold text-purple-400">
                AI CURATED
              </span>
            )}
          </div>

          <div className="space-y-4">
            {!result ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="h-24 bg-white/5 border border-white/10 rounded-2xl animate-pulse"
                  />
                ))}
                <div className="text-center py-12">
                  <p className="text-white/20 italic">Capture your mood to see recommendations</p>
                </div>
              </div>
            ) : (
              result.recommendations.map((song, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-4 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-xl flex items-center justify-center border border-white/10 group-hover:from-purple-600/40 transition-colors">
                      <Play className="w-6 h-6 text-purple-400 fill-purple-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-lg truncate">{song.title}</h4>
                      <p className="text-white/60 text-sm truncate">
                        {song.artist} • <span className="text-purple-400/80">{song.genre}</span>
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/5">
                    <p className="text-xs text-white/40 italic leading-relaxed">
                      "{song.reason}"
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
