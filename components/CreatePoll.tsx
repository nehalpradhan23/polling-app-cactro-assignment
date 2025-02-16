"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import useFetchPolls from "@/hooks/useFetchPolls";

export default function CreatePoll() {
  const [newQuestion, setNewQuestion] = useState("");
  const [newOptions, setNewOptions] = useState(["", ""]); // options initially 2

  const { fetchPolls } = useFetchPolls();

  // ================================================================
  const handleCreatePoll = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const filteredOptions = newOptions.filter(
        (option) => option.trim() !== ""
      ); // filter empty option

      // if no question
      if (newQuestion.trim() === "") {
        toast.error("Enter poll question.");
        return;
      }
      if (filteredOptions.length < 2) {
        toast.error("Options cannot be less than 2");
        return;
      }

      const response = await fetch("/api/polls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: newQuestion,
          options: filteredOptions,
        }),
      });

      const data = await response.json();
      console.log(data);

      if (!data.success) {
        toast.error("Error creating poll.");
        return;
      }

      toast.success("Poll created successfully");
      setNewQuestion("");
      setNewOptions(["", ""]);
      fetchPolls();
      // onPollCreated();
    } catch (error: any) {
      console.log(error);
      toast.error(error.message || "Error while creting the poll.");
    }
  };

  // add new option =====================
  const addOption = () => {
    setNewOptions([...newOptions, ""]);
  };

  // =================================================================
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Create New Poll</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCreatePoll} className="space-y-4">
          {/* question input ------------------------------------- */}
          <Input
            placeholder="Enter your question"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            className="mb-4"
          />
          {/* options ============================================== */}
          {newOptions.map((option, index) => (
            <Input
              key={index}
              placeholder={`Option ${index + 1}`}
              value={option}
              onChange={(e) => {
                const updatedOptions = [...newOptions];
                updatedOptions[index] = e.target.value;
                setNewOptions(updatedOptions);
              }}
              className="mb-2"
            />
          ))}

          <div className="space-x-2">
            <Button type="button" onClick={addOption} variant="outline">
              Add Option
            </Button>
            <Button type="submit">Create Poll</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
