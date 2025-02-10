import { Loader2 } from "lucide-react";

const LoadingPage = () => {
  return (
    <div className="h-screen grid place-content-center">
      <Loader2 className="animate-spin size-5" />
    </div>
  );
};

export default LoadingPage;
