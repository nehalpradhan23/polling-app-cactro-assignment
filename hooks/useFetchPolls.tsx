"use client";

import { Option } from "@/types/types";
// import { Poll } from "@/types/types";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Poll {
  _id: string;
  question: string;
  options: Option[];
}

const useFetchPolls = () => {
  const [polls, setPolls] = useState<Poll[]>([]);

  const fetchPolls = async () => {
    try {
      const response = await fetch("/api/polls");
      const data = await response.json();

      console.log("asdfasf ", data);

      if (data.success) {
        setPolls(data.polls);
      } else {
        console.log("error fetching polls");
        toast.error("Error fetching polls");
      }
    } catch (error) {
      console.log("error fetching polls", error);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  return { fetchPolls, polls };
};

export default useFetchPolls;
