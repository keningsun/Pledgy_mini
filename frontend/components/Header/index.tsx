'use client';

export const Header = ({
  onClick,
  title,
}: {
  onClick: () => void;
  title: string;
}) => {
  return (
    <div className="h-14 flex items-center py-2 px-3 border-b border-[#E6E6E6]">
      <img src="/assets/back.svg" alt="back" onClick={onClick} />
      <p className="font-bold text-xl text-center w-full">{title}</p>
    </div>
  );
};
