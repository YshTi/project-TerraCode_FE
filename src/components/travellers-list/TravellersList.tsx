"use client"

import { useState } from "react";
import axios from "axios"; 
import TravellerCard from "@/components/traveller-card/traveller-card"; 
import css from "./TravellersList.module.css";
import { toast } from "react-hot-toast"; //яку саме бібліотеку вик-мо для пуш



interface Traveller {
    _id: string;
    name: string;
    avatarUrl: string;
    articlesAmount: number;
}

interface TravellersListProps {
    initialTravellers: Traveller[];
}

export default function TravellersList ({ initialTravellers }: TravellersListProps) {

const [travellers, setTravellers] = useState<Traveller[]>(initialTravellers)
const [page, perPage] = useState(1);
const [loading, setLoading] = useState(false);

const [hasMore, setHasMore] = useState(initialTravellers.length === 12);

// Pagination
const loadMore = async () => {
    setLoading(true);
    const nextPage = page + 1;


    try {
        const res = await axios.get("/api/travellers",
            {
                params: {
                    page: nextPage,
                    limit: 12,
                },
            });

            const newTravellers = res.data?.data || [];

            setTravellers((prev) => [...prev, newTravellers]);
            setPage(nextPage);

            if (newTravellers.length < 12 || newTravellers.length ===0){
                setHasMore(false);
            }
    } catch (err) {
        //push-message

        toast.error("Щось пішло не так");
    } finally {
        setLoading(false);
    }
};
return (
<div className={css.container}>
{travellers.length === 0 ? (
    <p>Мандрівників не знайдено...</p>
) : (
    <div className={css.container}>

        <ul className={css.travellersList}>
            {travellers.map((traveller) => (
                <li>
                    //TravellerCard
                    <TravellerCard traveller={traveller}/>
                </li>
            ))}
        </ul>
{hasMore && (
            <button 
              type="button" 
              className={css.button} 
              onClick={handleLoadMore}
              disabled={loading}
            >
              {loading ? "Завантаження..." : "Показати ще"}
            </button>
    </div>
)}

</div>

);
}
