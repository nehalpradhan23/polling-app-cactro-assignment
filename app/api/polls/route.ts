import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import poll from "@/lib/models/poll";
import connectToDB from "@/lib/mongodb";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const client = new MongoClient(uri);

interface PollRequestBody {
  question: string;
  options: string[];
}

export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const { question, options }: PollRequestBody = await req.json();

    if (!question || !options || options.length < 2) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid poll data. Provide a question and at least 2 options.",
        },
        { status: 400 }
      );
    }

    const newPoll = await poll.create({
      question,
      options: options.map((option) => ({ text: option, votes: 0 })),
    });

    return NextResponse.json({ success: true, poll: newPoll }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create poll",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectToDB(); // Ensure database connection

    const polls = await poll.find();
    return NextResponse.json({ success: true, polls }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch polls",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    await connectToDB(); // Ensure database connection

    const { pollId, optionIndex } = await req.json();

    if (!pollId || optionIndex === undefined) {
      return NextResponse.json(
        { success: false, error: "Poll ID and option index are required." },
        { status: 400 }
      );
    }

    const updatedPoll = await poll.findByIdAndUpdate(
      pollId,
      { $inc: { [`options.${optionIndex}.votes`]: 1 } }, // Increment votes for the selected option
      { new: true }
    );

    if (!updatedPoll) {
      return NextResponse.json(
        { success: false, error: "Poll not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, poll: updatedPoll },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update vote",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// export async function PATCH(req: Request) {
//   try {
//     await connectToDB(); // Ensure database connection

//     const { pollId, optionIndex } = await req.json();

//     if (!pollId || !optionIndex) {
//       return NextResponse.json(
//         { success: false, error: "Poll ID and option text are required." },
//         { status: 400 }
//       );
//     }

//     const updatedPoll = await poll.findOneAndUpdate(
//       { _id: pollId, "options.text": optionIndex },
//       { $inc: { "options.$.votes": 1 } }, // Increment vote count
//       { new: true }
//     );

//     if (!updatedPoll) {
//       return NextResponse.json(
//         { success: false, error: "Poll or option not found." },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(
//       { success: true, poll: updatedPoll },
//       { status: 200 }
//     );
//   } catch (error: any) {
//     return NextResponse.json(
//       {
//         success: false,
//         error: "Failed to update vote",
//         details: error.message,
//       },
//       { status: 500 }
//     );
//   }
// }
//
