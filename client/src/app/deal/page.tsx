"use client";
import React, { useEffect, useState } from "react";
import style from "./deal.module.css";
import Link from "next/link";

type Deal = {
  dealId: string;
  dealTitle: string;
  dday: number;
};

const DealListPage = () => {
  const [deals, setDeals] = useState<Deal[]>([]);

  const fetchDeals = async () => {
    const res = await fetch("http://localhost:8080/deal");
    if (res.status === 200) {
      const { data } = await res.json();
      setDeals(data);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  return (
    <div className={style.container}>
      {deals.map((deal) => (
        <div key={deal.dealId} className={style.item}>
          <Link href={`deal/${deal.dealId}`}>
            <h1>{deal.dealTitle}</h1>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default DealListPage;
