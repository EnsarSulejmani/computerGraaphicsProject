type Props = {
  visibility: string;
};

export default function CompanyInfo(props: Props) {
  return (
    <div>
      <div className={`text-lg py-2 ${props.visibility}`}>Company Info</div>
    </div>
  );
}
