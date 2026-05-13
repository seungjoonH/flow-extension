type Props = { name: string };

function Icon({ name }: Props) {
  const path = `/icons/${name}.svg`;
  return <img src={path} alt={name} width={14} height={14} />;
}

export default Icon;