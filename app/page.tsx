"use client";
import CreatePoll from "@/components/CreatePoll";
import PollList from "@/components/PollList";
import useFetchPolls from "@/hooks/useFetchPolls";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";

export default function Home() {
  const { fetchPolls } = useFetchPolls();

  useEffect(() => {
    fetchPolls();
  }, []);
  // =============================
  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <ToastContainer />
      <h1 className="text-4xl font-bold my-8 text-center">
        Real-time Polling App
      </h1>
      {/* <CreatePoll onPollCreated={() => {}} /> */}
      <CreatePoll />
      <PollList />
    </div>
  );
}
