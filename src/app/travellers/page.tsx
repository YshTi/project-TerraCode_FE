import { Metadata } from "next";
import TravellersList from "@/components/travellers-list/TravellersList";
import { backendFetch } from "@/lib/api/backend";
import css from "@/components/travellers-list/TravellersList.module.css"

export const metadata: Metadata = {
  title: "Мандрівники | Природні мандри",
  description: "Список наших мандрівників та їхні дивовижні історії.",
  openGraph: {
    title: "Мандрівники | Природні мандри",
    description: "Приєднуйся до спільноти мандрівників та читай цікаві статті.",
    url: "", //додати
    siteName: "Природні мандри",
    type: "website",
  },
};

async function getFirstTravellers() {
  try {
  
    const response = await backendFetch("/users?page=1&limit=12");
    
    if (!response.ok) {
      throw new Error("Failed to fetch travellers from backend");
    }

    const resData = await response.json();
    return resData?.data || []; 
  } catch (error) {
    console.error("Помилка при отриманні мандрівників на сервері:", error);
    return [];
  }
}

export default async function TravellersPage() {
  const initialTravellers = await getFirstTravellers();

  return (
    <main className={css.main}>
        <div className={css.container}>
      <h1 className={css.title}>
        Мандрівники
      </h1>
      <TravellersList initialTravellers={initialTravellers} />
   </div> 
   </main>
  );
}