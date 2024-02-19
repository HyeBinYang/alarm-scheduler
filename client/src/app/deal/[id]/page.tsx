"use client";
import React, { useEffect, useState } from "react";

type Deal = {
  dealId: string;
  dealTitle: string;
  dday: number;
};

const DealDetailPage = ({ params }: { params: { id: string } }) => {
  const [deal, setDeal] = useState<Deal>();
  const { id: dealId } = params;

  const pushDataLayer = (deal: Deal) => {
    const { dealId, dealTitle, dday } = deal;

    window.dataLayer?.push({
      event: "deal_view",
      userId: "robin",
      deal: {
        userId: "robin",
        userEmail: "skdisk7368@gmail.com",
        dealId,
        dealTitle,
        dday,
      },
      fetch: (input: RequestInfo | URL, init?: RequestInit) => {
        fetch(input, init);
      },
    });
  };

  const fetchDeal = async () => {
    const res = await fetch(`http://localhost:8080/deal/${dealId}`);
    if (res.status === 200) {
      const { data } = await res.json();
      setDeal(data);
      pushDataLayer(data);
    }
  };

  useEffect(() => {
    fetchDeal();
  }, []);

  if (!deal) return null;

  return (
    <div>
      <h1>{deal?.dealTitle}</h1>
    </div>
  );
};

export default DealDetailPage;
