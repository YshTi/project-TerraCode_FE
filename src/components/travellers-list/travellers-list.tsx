"use client"

import { useState, useEffect } from "react";
import axios from "axios"; 
import { TravellerCard } from "@/components/traveller-card/traveller-card"; 
import css from "./travellers-list.module.css";
import { Pagination } from "@/components/pagination/pagination";
import { toast } from "react-hot-toast";


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
const [page, setPage] = useState(1);
const [loading, setLoading] = useState(false);
const [hasMore, setHasMore] = useState(initialTravellers.length === 12);

useEffect(() => {
    if (initialTravellers.length === 0) {
      toast.error("Не вдалося завантажити мандрівників з сервера. Спробуйте оновити сторінку!");
    }
  }, [initialTravellers]);


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

            setTravellers((prev) => [...prev, ...newTravellers]);
            setPage(nextPage);

            if (newTravellers.length < 12 || newTravellers.length ===0){
                setHasMore(false);
            }
    } catch (err) {
        toast.error("Не вдалося завантажити мандрівників. Спробуйте ще!");
        console.error(err);
       
    } finally {
        setLoading(false);
    }
};

return (
<div className={css.container}>
{travellers.length === 0 ? (
    <p>Мандрівників не знайдено...</p>
) : (
    <> 
        <ul className={css.travellersList}>
            {travellers.map((traveller) => (
                <li key={traveller._id} className={css.item}>

                    {/* Перевірити    карткуууууууууу */}

                     <TravellerCard traveller={traveller}/>
                </li>
            ))}
        </ul>

       <Pagination 
            onLoadMore={loadMore} 
            isLoading={loading} 
            hasMore={hasMore} 
            
          />
    </>
)}
</div>

);
}


