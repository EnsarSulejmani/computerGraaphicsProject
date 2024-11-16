type Props = {
  visibility: String;
};

export default function PortfolioList(props: Props) {
  return (
    <div>
      <div className={`text-lg py-2 ${props.visibility}`}>Portfolio List</div>
    </div>
  );
}
