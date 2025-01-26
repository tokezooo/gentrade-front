import { Strategy } from "@/shared/components/custom/strategy";
import { API } from "@/shared/services/api-client";
import { redirect } from "next/navigation";

export default async function Page(props: { params: Promise<any> }) {
  const params = await props.params;
  const { id } = params;
  const strategyFromDb = await API.strategies.getStrategy(id);

  if (!strategyFromDb) {
    return redirect("/strategies");
  }

  return <Strategy strategy={strategyFromDb} />;
}
