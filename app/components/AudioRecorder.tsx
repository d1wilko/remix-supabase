import { FC, useState, useEffect } from "react";

interface AudioRecorderProps {
  setUploadBlob: React.Dispatch<React.SetStateAction<File | null>>;
}

const AudioRecorder: FC<AudioRecorderProps> = ({ setUploadBlob }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasAccess, setHasAccess] = useState(false); // Track if access is granted

  useEffect(() => {
    if (mediaRecorder) {
      let audioChunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        setUploadBlob(new File([audioBlob], "foobar.wav"));
        audioChunks = [];
      };
    }

    return () => {
      // Ensure all tracks are stopped when component unmounts to release resources
      mediaRecorder?.stream.getTracks().forEach((track) => track.stop());
    };
  }, [mediaRecorder, setAudioUrl, setUploadBlob]);

  const requestMicrophoneAccess = async () => {
    setError(null); // Reset any previous errors
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasAccess(true); // Set access to true if permission is granted
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
    } catch (error) {
      setError("Error accessing the microphone: " + error.message);
      setHasAccess(false); // Access denied
    }
  };

  const startRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "inactive") {
      setAudioUrl(null); // Clear previous recording URL when starting new recording
      mediaRecorder.start();
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {!hasAccess && (
        <button
          className="btn btn-secondary text-white"
          onClick={requestMicrophoneAccess}
        >
          Request Recording Permission
        </button>
      )}
      {error && <p className="text-red-500">{error}</p>}
      {hasAccess && (
        <button
          className="btn btn-primary text-white"
          onClick={isRecording ? stopRecording : startRecording}
          disabled={!mediaRecorder}
        >
          {isRecording ? "Stop Recording" : "Start Recording"}
        </button>
      )}
      {audioUrl && (
        <audio src={audioUrl} controls>
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
};

export default AudioRecorder;
