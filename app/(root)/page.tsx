import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import React from "react";

const HomePage = () => {
  return (
    <div>
      <Button>Click me</Button>
    </div>
  );
};

export default HomePage;

export const metadata: Metadata = {
  title: "Home",
};
