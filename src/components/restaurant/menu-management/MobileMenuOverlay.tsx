import { MobileMenuOverlayProps } from "../../../interfaces/restaurant/menu/mobile-menu-overlay.types";

const MobileMenuOverlay: React.FC<MobileMenuOverlayProps> = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  if (!isMobileMenuOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-40 md:hidden"
      onClick={() => setIsMobileMenuOpen(false)}
    />
  );
};

export default MobileMenuOverlay;