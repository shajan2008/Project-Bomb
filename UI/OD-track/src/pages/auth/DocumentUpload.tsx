import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import {
  ClipboardList, Check, Camera, UserRound, Paperclip, FileCheck2,
  Video, RotateCcw, X, ShieldAlert,
} from 'lucide-react';

const docTypes = ['Aadhaar Card', 'Passport', 'Voter ID', 'Driving License', 'College ID'];

type CaptureSource = 'file' | 'camera' | null;

export default function DocumentUpload() {
  const { role, completeDocumentUpload, skipDocumentUpload } = useAuth();
  const navigate = useNavigate();

  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [photoSource, setPhotoSource] = useState<CaptureSource>(null);
  const [docUploaded, setDocUploaded] = useState(false);
  const [docType, setDocType] = useState('');
  const [isDragOver, setIsDragOver] = useState<'photo' | 'doc' | null>(null);

  // Live camera viewfinder state
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [pendingSnapshot, setPendingSnapshot] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const mandatory = role === 'student';
  const photoUploaded = photoDataUrl !== null;
  const complete = photoUploaded && docUploaded && !!docType;

  const stopStream = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };

  useEffect(() => stopStream, []); // always release the camera on unmount

  const openCamera = async () => {
    setCameraError(null);
    setPendingSnapshot(null);
    setCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch {
      setCameraError('Could not access the camera. Check browser permissions, or upload a photo file instead.');
    }
  };

  const closeCamera = () => {
    stopStream();
    setCameraOpen(false);
    setPendingSnapshot(null);
  };

  const takeSnapshot = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    setPendingSnapshot(canvas.toDataURL('image/jpeg', 0.9));
  };

  const retakeSnapshot = () => setPendingSnapshot(null);

  const confirmSnapshot = () => {
    if (!pendingSnapshot) return;
    setPhotoDataUrl(pendingSnapshot);
    setPhotoSource('camera');
    stopStream();
    setCameraOpen(false);
    setPendingSnapshot(null);
  };

  const handleFilePhoto = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPhotoDataUrl(typeof reader.result === 'string' ? reader.result : null);
      setPhotoSource('file');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complete) return;
    completeDocumentUpload();
    navigate(role ? `/${role}` : '/', { replace: true });
  };

  const handleSkip = () => {
    skipDocumentUpload();
    navigate(role ? `/${role}` : '/', { replace: true });
  };

  return (
    <div className="page-bg min-h-screen flex items-center justify-center p-4 sm:p-6">
      <div className="glass-card w-full max-w-2xl p-6 sm:p-10">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-blue-400 to-teal-400 flex items-center justify-center text-white mx-auto mb-4 shadow-lg">
            <ClipboardList size={26} />
          </div>
          <h2 className="font-display font-bold text-[22px] sm:text-[26px] text-text">Complete your Profile</h2>
          <p className="text-[14px] text-text-muted mt-1">Upload your photo and identity document to get started</p>
          {mandatory && (
            <div className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-semibold text-amber-700 bg-amber-100/60 px-3 py-1.5 rounded-full">
              <ShieldAlert size={13} />
              Required before you can access your dashboard
            </div>
          )}
        </div>

        {/* Steps */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mb-8 flex-wrap">
          {['Photo', 'Document', 'Submit'].map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0 ${
                (i === 0 && photoUploaded) || (i === 1 && docUploaded) || i === 2
                  ? 'bg-linear-to-br from-blue-400 to-blue-500 text-white'
                  : 'bg-white/50 text-text-muted'
              }`}>
                {(i === 0 && photoUploaded) || (i === 1 && docUploaded) ? <Check size={14} /> : i + 1}
              </div>
              <span className="text-[13px] font-medium text-[#5A6170]">{step}</span>
              {i < 2 && <div className="w-6 sm:w-8 h-px bg-white/50"></div>}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photo capture */}
          <div>
            <label className="block text-[12px] font-semibold text-text-muted mb-2 uppercase tracking-wide">
              Passport-size Photo
            </label>

            {photoUploaded ? (
              <div className="border-2 border-green-300 bg-green-50/20 rounded-2xl p-6 sm:p-8 text-center">
                <div className="flex flex-col items-center gap-2">
                  <img
                    src={photoDataUrl!}
                    alt="Uploaded profile"
                    className="w-16 h-16 rounded-full object-cover border-2 border-white shadow"
                  />
                  <span className="flex items-center gap-1.5 text-[13px] font-semibold text-green-600">
                    <Check size={14} /> Photo {photoSource === 'camera' ? 'captured' : 'uploaded'}
                  </span>
                  <div className="flex gap-3 mt-1">
                    <button type="button" onClick={() => { setPhotoDataUrl(null); setPhotoSource(null); }} className="text-[11px] text-text-muted hover:text-text underline">
                      Remove
                    </button>
                    <button type="button" onClick={openCamera} className="text-[11px] text-text-muted hover:text-text underline">
                      Retake with camera
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragOver('photo'); }}
                  onDragLeave={() => setIsDragOver(null)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragOver(null);
                    handleFilePhoto(e.dataTransfer.files?.[0]);
                  }}
                  className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all ${
                    isDragOver === 'photo' ? 'border-blue-400 bg-blue-50/30' : 'border-white/60 hover:border-blue-300 hover:bg-white/20'
                  }`}
                >
                  <label className="flex flex-col items-center gap-2 cursor-pointer">
                    <Camera size={36} className="text-text-muted opacity-50" />
                    <span className="text-[14px] font-medium text-[#5A6170]">Drop your photo here or click to browse</span>
                    <span className="text-[12px] text-text-muted text-center">JPG, PNG — max 2MB · recommended 200×200px</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(e) => handleFilePhoto(e.target.files?.[0])}
                    />
                  </label>
                </div>
                <button
                  type="button"
                  onClick={openCamera}
                  className="btn-secondary w-full py-2.5 text-[13px] flex items-center justify-center gap-2"
                >
                  <Video size={15} /> Use camera instead
                </button>
              </div>
            )}
          </div>

          {/* KYC document */}
          <div>
            <label className="block text-[12px] font-semibold text-text-muted mb-2 uppercase tracking-wide">
              Identity Document
            </label>
            <select
              className="glass-input mb-3"
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              required
            >
              <option value="">Select document type…</option>
              {docTypes.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragOver('doc'); }}
              onDragLeave={() => setIsDragOver(null)}
              onDrop={(e) => { e.preventDefault(); setIsDragOver(null); setDocUploaded(true); }}
              onClick={() => setDocUploaded(true)}
              className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
                isDragOver === 'doc' ? 'border-blue-400 bg-blue-50/30' : 'border-white/60 hover:border-blue-300 hover:bg-white/20'
              } ${docUploaded ? 'bg-green-50/20 border-green-300' : ''}`}
            >
              {docUploaded ? (
                <div className="flex flex-col items-center gap-2">
                  <FileCheck2 size={30} className="text-green-500" />
                  <span className="flex items-center gap-1.5 text-[13px] font-semibold text-green-600">
                    <Check size={14} /> Document uploaded
                  </span>
                  <span className="text-[11px] text-text-muted">Click to replace</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Paperclip size={36} className="text-text-muted opacity-50" />
                  <span className="text-[14px] font-medium text-[#5A6170]">Drop your document or click to browse</span>
                  <span className="text-[12px] text-text-muted">PDF, JPG, PNG — max 5MB</span>
                </div>
              )}
            </div>
          </div>

          {/* Progress */}
          <div>
            <div className="flex justify-between text-[12px] text-text-muted mb-1">
              <span>Upload progress</span>
              <span>{photoUploaded && docUploaded ? '100%' : photoUploaded || docUploaded ? '50%' : '0%'}</span>
            </div>
            <div className="h-2 bg-white/40 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${photoUploaded && docUploaded ? 100 : photoUploaded || docUploaded ? 50 : 0}%`,
                  background: 'linear-gradient(90deg, #A8C8EC, #6FCF97)',
                }}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary w-full py-3 text-[15px]" disabled={!complete}>
            Continue to Dashboard →
          </button>

          {/* Skip: only ever rendered for mentor/HOD. No "Skip"/"Close"/"Later"
              affordance exists in this component's student render path at all —
              it isn't just hidden by CSS, the JSX itself is never emitted for
              role === 'student', so there's nothing a student could re-enable
              via devtools either. */}
          {!mandatory && (
            <button type="button" onClick={handleSkip} className="w-full text-center text-[13px] text-text-muted hover:text-text">
              Skip for now — Continue to Dashboard
            </button>
          )}
        </form>
      </div>

      {/* Camera modal */}
      {cameraOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.55)' }}>
          <div className="glass-card w-full max-w-md p-5 sm:p-6" style={{ background: 'rgba(255,255,255,0.9)' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-[16px] text-text">Take a photo</h3>
              <button onClick={closeCamera} className="text-text-muted hover:text-text" aria-label="Close camera">
                <X size={18} />
              </button>
            </div>

            {cameraError ? (
              <p className="text-[13px] text-red-500 py-8 text-center">{cameraError}</p>
            ) : (
              <div className="rounded-xl overflow-hidden bg-black aspect-square relative">
                {pendingSnapshot ? (
                  <img src={pendingSnapshot} alt="Snapshot preview" className="w-full h-full object-cover" />
                ) : (
                  <video ref={videoRef} muted playsInline className="w-full h-full object-cover scale-x-[-1]" />
                )}
              </div>
            )}
            <canvas ref={canvasRef} className="hidden" />

            <div className="flex gap-3 mt-5">
              {pendingSnapshot ? (
                <>
                  <button type="button" onClick={retakeSnapshot} className="btn-secondary flex-1 flex items-center justify-center gap-1.5 text-[13px]">
                    <RotateCcw size={14} /> Retake
                  </button>
                  <button type="button" onClick={confirmSnapshot} className="btn-primary flex-1 flex items-center justify-center gap-1.5 text-[13px]">
                    <UserRound size={14} /> Confirm
                  </button>
                </>
              ) : (
                <button type="button" onClick={takeSnapshot} disabled={!!cameraError} className="btn-primary w-full text-[13px]">
                  Capture
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
