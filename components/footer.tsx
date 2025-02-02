import { APP_NAME } from "@/lib/constants";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t text-sm">
      <div className="p-4 flex-center">
        {currentYear} {APP_NAME} &copy; All Rights Reserved
      </div>
    </footer>
  );
};

export default Footer;
