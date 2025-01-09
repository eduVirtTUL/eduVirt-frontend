type PageHeaderProps = {
  title: string;
  type?: string;
};

const PageHeader: React.FC<PageHeaderProps> = ({ title, type }) => {
  return (
    <div className="pb-10 flex flex-col gap-2">
      <h1 className="text-4xl font-bold">{title}</h1>
      {type && <span className="text-xl text-gray-600">{type}</span>}
    </div>
  );
};

export default PageHeader;
