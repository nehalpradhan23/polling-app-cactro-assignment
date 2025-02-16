"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useFetchPolls from "@/hooks/useFetchPolls";

export default function PollList() {
  const { fetchPolls, polls } = useFetchPolls();

  // update polls every 5 seconds
  useEffect(() => {
    fetchPolls();
    const interval = setInterval(fetchPolls, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleVote = async (pollId: string, optionIndex: number) => {
    await fetch("/api/polls", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pollId, optionIndex }),
    });
    fetchPolls();
  };

  return (
    <div className="space-y-4">
      {polls.map((poll) => (
        <Card key={poll._id}>
          <CardHeader>
            <CardTitle>{poll.question}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {poll.options.map((option, index) => {
                const totalVotes = poll.options.reduce(
                  (sum, opt) => sum + opt.votes,
                  0
                );
                const percentage =
                  totalVotes > 0
                    ? Math.round((option.votes / totalVotes) * 100)
                    : 0;

                return (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <Button
                        onClick={() => handleVote(poll?._id, index)}
                        variant="outline"
                        className="w-full text-left justify-start"
                      >
                        {option.text}
                      </Button>
                      {/* <span className="ml-2 text-sm text-gray-500">
                        {option.votes} votes ({percentage}%)
                      </span> */}
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded">
                      <div
                        className="h-full bg-blue-500 rounded"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
