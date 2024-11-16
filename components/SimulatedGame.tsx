type Props = {
  visibility: string;
};

export default function SimulatedGame(props: Props) {
  return (
    <div>
      <div className={`text-lg${props.visibility}`}>Simulated Game</div>
    </div>
  );
}
