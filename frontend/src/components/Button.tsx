import { SiLichess } from "react-icons/si";

export const Button = ({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) => {
  return (
    <button
      onClick={onClick}
      className="bg-green-700 text-white font-bold hover:bg-green-800 hover:px-12 transition-all duration-300 text-3xl px-10 py-4 rounded flex justify-center items-center gap-3"
    >
      <SiLichess />
      {children}
    </button>
  );
};
