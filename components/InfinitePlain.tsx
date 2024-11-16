type Props = {
  visibility: string;
};

export default function InfinitePlain(props: Props) {
  return (
    <div>
      <div className={`text-lg py-2 ${props.visibility}`}>Infinite Plain</div>
    </div>
  );
}
