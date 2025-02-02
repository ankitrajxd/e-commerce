import { cn } from "@/lib/utils";

interface Props {
  value: number;
  className?: string;
}

const ProductPrice = ({ value, className }: Props) => {
  const [integer, decimal] = value.toFixed(2).split(".");

  return (
    <p className={cn("text-2xl", className)}>
      <span className="text-xs align-super">$</span>
      {integer}
      <span className="text-xs align-super">.{decimal}</span>
    </p>
  );
};

export default ProductPrice;
