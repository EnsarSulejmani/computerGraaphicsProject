type Props = {
  visibility: string;
  modelToRender: string;
};

export default function SimulatedGame({ visibility, modelToRender }: Props) {
  return (
    <div>
      <div className={`text-lg${visibility}`}>{modelToRender}</div>
    </div>
  );
}
