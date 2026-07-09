import { Metadata } from "next";
import { api } from "@/lib/api/backend.ts";
import TravellersList from "@/components/travellers-list/TravellersList";
import css from "@/components/travellers-list";

export const metadata: Metadata = {
  title: "Мандрівники | Природні мандри",
  description: "Список наших мандрівників та їхні дивовижні історії.",
  openGraph: {
    title: "Мандрівники | Природні мандри",
    description: "Приєднуйся до спільноти мандрівників та читай цікаві статті.",
    url: "____", // Змінити
    siteName: "Природні мандри",
    images: [
      {
        url: "__", // Змінити
        width: 1200,
        height: 630,
        alt: "Природні мандри банер",
      },
    ],
    type: "website",
  },
};

async function getFirstTravellers() {
    try {
        const res = await api('/users', {
      params: {
        page: 1,
        limit: 12,
    },
  });
  return res.data?.data || [];
}
catch(error){
console.error("Помилка при отриманні мандрівників на сервері:", error);
return [];
}
}

export default async function TravellersPage() {
    const initialTravellers = await getFirstTravellers();
    return(
        <main>
            <h1 className={css.travellersTitle}>Мандрівники</h1>
            <TravellersList initialTravellers={initialTravellers}/>
        </main>
    );
}