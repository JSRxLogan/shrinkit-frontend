

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-gray-300">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center">
          <p className="text-center text-sm md:text-base">
            © {currentYear} ShrinkIt. Forged in code, caffeine & chaos by Logan ⚔️💻
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;