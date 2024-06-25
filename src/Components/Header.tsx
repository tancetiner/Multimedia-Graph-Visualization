const Header = (props: { title: string }) => {
  return (
    <div className="h-[calc(6rem)] bg-blue-200 w-full flex items-center">
      <span className="text-black text-3xl font-light mx-auto select-none">
        {props.title}
      </span>
    </div>
  );
};

export default Header;
