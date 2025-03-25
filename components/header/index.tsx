import NextLogo from "../next-logo";
import Menu from './menu';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-transparent">
      {/* Transparent background with subtle blur */}
      <div className="absolute inset-0 backdrop-blur-lg" />

      {/* Content container */}
      <div className="relative flex justify-between items-center">
        <div className="p-5">
          <NextLogo />
        </div>
        <div className="pr-5">
          <Menu />
        </div>
      </div>
    </header>
  );
};

export default Header;