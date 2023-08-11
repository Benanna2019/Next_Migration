export default function Customer({
  params,
}: {
  params: { customerName: string };
}) {
  return <h1>{params.customerName}</h1>;
}
