import { Badge } from "../ui";

export const cultivoEstadoBadge = (estado: string) => {
  switch (estado) {
    case "Activo":
      return <Badge variant="forest">Activo</Badge>;
    case "En Desarrollo":
      return <Badge variant="yellow">En Desarrollo</Badge>;
    case "Cosechado":
      return <Badge variant="green">Cosechado</Badge>;
    default:
      return <Badge variant="gray">Finalizado</Badge>;
  }
};
