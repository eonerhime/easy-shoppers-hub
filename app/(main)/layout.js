import Navbar from "@/components/Navbar";

const layout = ({ children }) => {
  return (
    <div className="">
      <Navbar />
      {children}
    </div>
  );
};

export default layout;
