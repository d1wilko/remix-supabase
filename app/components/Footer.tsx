import AudioPlayer from "./AudioPlayer";

const Footer = () => {
  return (
    <footer className="flex p-5 border-t-2 border-primary text-white justify-between items-center">
      <AudioPlayer />
      <p className="text-sm">Made in Belfast ☘️ by Dan Wilson</p>
    </footer>
  );
};
export default Footer;
