import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  Video, 
  FileText, 
  Download, 
  ExternalLink, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  RotateCcw, 
  RotateCw
} from "lucide-react";
import { Unit } from "../types";

interface UnitMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  unit: Unit;
  initialMode?: "video" | "pdf";
}

function getYouTubeEmbedUrl(url?: string): string | null {
  if (!url) return null;
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regExp);
  return match ? `https://www.youtube-nocookie.com/embed/${match[1]}?rel=0&modestbranding=1` : null;
}

export const UnitMediaModal: React.FC<UnitMediaModalProps> = ({
  isOpen,
  onClose,
  unit,
  initialMode = "video"
}) => {
  const [activeMode, setActiveMode] = useState<"video" | "pdf">(initialMode);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  // Sync mode when modal opens or initialMode changes
  useEffect(() => {
    if (isOpen) {
      setActiveMode(initialMode);
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, [isOpen, initialMode]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !unit.media) return null;

  const { media } = unit;
  const youtubeEmbedUrl = getYouTubeEmbedUrl(media.videoUrl);

  // Video playback controls
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const skipTime = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(videoRef.current.currentTime + seconds, duration));
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const changePlaybackRate = (rate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      setPlaybackRate(rate);
    }
  };

  const toggleFullscreen = () => {
    if (!videoContainerRef.current) return;
    if (!document.fullscreenElement) {
      videoContainerRef.current.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return "00:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/80 backdrop-blur-sm" dir="rtl">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          className="relative w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* 🏷️ Top Header & Tabs Bar */}
          <div className="p-3.5 sm:p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/70 dark:bg-slate-800/40">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-[#047857] dark:text-emerald-400 flex items-center justify-center text-lg shrink-0">
                {activeMode === "video" ? "🎥" : "📄"}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#047857]/10 text-[#047857] dark:text-emerald-300 border border-[#047857]/20">
                    الوحدة {unit.number}
                  </span>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 font-sans">
                    {unit.title}
                  </h3>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-sans">
                  {activeMode === "video" ? "شرح فيديو شامل للوحدة" : "المذكرة الرسمية الشاملة (PDF)"}
                </p>
              </div>
            </div>

            {/* Switch Mode Tabs & Close Button */}
            <div className="flex items-center gap-2">
              <div className="bg-slate-200/80 dark:bg-slate-800 p-1 rounded-xl flex items-center gap-1">
                <button
                  onClick={() => setActiveMode("video")}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeMode === "video"
                      ? "bg-white dark:bg-slate-700 text-[#047857] dark:text-emerald-300 shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">فيديو الشرح</span>
                </button>

                <button
                  onClick={() => setActiveMode("pdf")}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeMode === "pdf"
                      ? "bg-white dark:bg-slate-700 text-[#047857] dark:text-emerald-300 shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">مذكرة PDF</span>
                </button>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 flex items-center justify-center transition-colors cursor-pointer"
                title="إغلاق"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 🎬 Modal Body */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-5">
            {activeMode === "video" ? (
              <div className="space-y-4">
                {/* Custom Video Player Container */}
                <div 
                  ref={videoContainerRef}
                  className="relative rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-lg group aspect-video flex items-center justify-center"
                >
                  {youtubeEmbedUrl ? (
                    <iframe
                      src={youtubeEmbedUrl}
                      title={media.videoTitle || unit.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  ) : (
                    <>
                      <video
                        ref={videoRef}
                        src={media.videoUrl}
                        className="w-full h-full object-contain cursor-pointer"
                        onClick={togglePlay}
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={handleLoadedMetadata}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                        playsInline
                      />

                      {/* Big Central Play Button when paused */}
                      {!isPlaying && (
                        <button
                          onClick={togglePlay}
                          className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-[#047857]/90 text-white flex items-center justify-center shadow-xl hover:scale-110 hover:bg-[#047857] transition-all cursor-pointer backdrop-blur-xs"
                        >
                          <Play className="w-8 h-8 translate-x-[-1px] fill-current" />
                        </button>
                      )}

                      {/* Bottom Video Controls Overlay */}
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 pt-6 flex flex-col gap-2 transition-opacity">
                        {/* Progress Bar */}
                        <div className="flex items-center gap-2 text-white text-[11px] font-mono">
                          <span>{formatTime(currentTime)}</span>
                          <input
                            type="range"
                            min={0}
                            max={duration || 100}
                            step={0.1}
                            value={currentTime}
                            onChange={handleSeek}
                            className="flex-1 h-1.5 bg-white/30 rounded-lg appearance-none cursor-pointer accent-[#10B981]"
                          />
                          <span>{formatTime(duration)}</span>
                        </div>

                        {/* Toolbar buttons */}
                        <div className="flex items-center justify-between text-white text-xs">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={togglePlay}
                              className="p-1.5 rounded-lg hover:bg-white/20 transition-colors cursor-pointer"
                              title={isPlaying ? "إيقاف مؤقت" : "تشغيل"}
                            >
                              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                            </button>

                            <button
                              onClick={() => skipTime(-10)}
                              className="p-1.5 rounded-lg hover:bg-white/20 transition-colors cursor-pointer"
                              title="رجوع 10 ثوانٍ"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => skipTime(10)}
                              className="p-1.5 rounded-lg hover:bg-white/20 transition-colors cursor-pointer"
                              title="تقديم 10 ثوانٍ"
                            >
                              <RotateCw className="w-4 h-4" />
                            </button>

                            <button
                              onClick={toggleMute}
                              className="p-1.5 rounded-lg hover:bg-white/20 transition-colors cursor-pointer"
                              title={isMuted ? "إلغاء الكتم" : "كتم الصوت"}
                            >
                              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Speed Selector */}
                            <div className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-lg">
                              <span className="text-[10px] text-white/70">السرعة:</span>
                              {[1, 1.25, 1.5, 2].map((rate) => (
                                <button
                                  key={rate}
                                  onClick={() => changePlaybackRate(rate)}
                                  className={`text-[10px] px-1 py-0.5 rounded ${
                                    playbackRate === rate
                                      ? "bg-[#10B981] font-bold text-white"
                                      : "text-white/80 hover:text-white"
                                  } cursor-pointer`}
                                >
                                  {rate}x
                                </button>
                              ))}
                            </div>

                            {/* Fullscreen */}
                            <button
                              onClick={toggleFullscreen}
                              className="p-1.5 rounded-lg hover:bg-white/20 transition-colors cursor-pointer"
                              title="ملء الشاشة"
                            >
                              <Maximize className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Video Info & Download Bar */}
                <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="space-y-1 text-right w-full sm:w-auto">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100 font-sans">
                        {media.videoTitle}
                      </span>
                      {media.videoSize && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          {media.videoSize}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-sans">
                      يمكنك مشاهدة الشرح مباشرة عبر المتصفح أو تحميله للمشاهدة بدون إنترنت في أي وقت.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    {youtubeEmbedUrl ? (
                      <a
                        href={media.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 bg-[#047857] hover:bg-[#064E3B] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer w-full sm:w-auto justify-center"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>فتح الشرح في يوتيوب</span>
                      </a>
                    ) : (
                      <a
                        href={media.videoUrl}
                        download={`فيديو_شرح_الوحدة_${unit.number}_كيمياء_الثاني_ثانوي.mp4`}
                        className="px-3.5 py-2 bg-[#047857] hover:bg-[#064E3B] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer w-full sm:w-auto justify-center"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>تحميل الفيديو للمشاهدة أوفلاين</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* PDF Toolbar & Actions */}
                <div className="bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800/60 rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="space-y-1 text-right w-full sm:w-auto">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#047857] dark:text-emerald-400" />
                      <span className="font-bold text-xs sm:text-sm text-emerald-950 dark:text-emerald-100 font-sans">
                        {media.pdfTitle}
                      </span>
                      {media.pdfSize && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-200/60 dark:bg-emerald-800/60 text-emerald-900 dark:text-emerald-200">
                          {media.pdfSize}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-emerald-800/80 dark:text-emerald-300 font-sans">
                      مذكرة المنهج الرسمية المعتمدة لطلاب ومعلمي الصف الثاني ثانوي بالسودان.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
                    <a
                      href={media.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-[#047857] dark:text-emerald-400" />
                      <span>فتح في صفحة مستقلة</span>
                    </a>

                    <a
                      href={media.pdfUrl}
                      download={`مذكرة_الوحدة_${unit.number}_كيمياء_الصف_الثاني_ثانوي.pdf`}
                      className="px-3.5 py-2 bg-[#047857] hover:bg-[#064E3B] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>تحميل المذكرة (PDF)</span>
                    </a>
                  </div>
                </div>

                {/* PDF Embed / Preview */}
                <div className="w-full h-[58vh] sm:h-[62vh] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 shadow-inner">
                  <iframe
                    src={`${media.pdfUrl}#toolbar=1&navpanes=0`}
                    title={media.pdfTitle}
                    className="w-full h-full border-0"
                  />
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
