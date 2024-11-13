type PageHeaderProps = {
  title: string;
};

const PageHeader: React.FC<PageHeaderProps> = ({ title }) => {
  return <h1 className="text-4xl font-bold pb-10">{title}</h1>;
};

export default PageHeader;
