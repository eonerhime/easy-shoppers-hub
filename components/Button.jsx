"use client";

import { useRouter } from "next/navigation";

function Button({ targetPath, style, children }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(targetPath);
  };

  return (
    <button onClick={handleClick} className={style}>
      {children}
    </button>
  );
}

export default Button;
