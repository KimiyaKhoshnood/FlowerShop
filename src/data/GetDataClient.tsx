"use client";

import { useEffect, useState } from "react";
import axios from "axios";

const useDataClient = (url: string) => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(url);
        if (isMounted) {
          setData(response.data);
          setLoading(false);
        }
      } catch (err: unknown) {
        if (isMounted) {
          console.log(err);
          setError("مشکلی پیش آمد!");
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [url]);

  return { data, loading, error };
};

export default useDataClient;
