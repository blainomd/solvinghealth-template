import { NextRequest, NextResponse } from "next/server";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

export async function POST(req: NextRequest) {
  if (!ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "API key not configured" },
      { status: 500 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const text = formData.get("text") as string | null;

    if (!file && !text) {
      return NextResponse.json(
        { error: "Please provide a file or text to interpret" },
        { status: 400 }
      );
    }

    const messages: Array<{
      role: string;
      content: Array<Record<string, unknown>>;
    }> = [];

    const userContent: Array<Record<string, unknown>> = [];

    // Handle file upload
    if (file) {
      const bytes = await file.arrayBuffer();
      const base64 = Buffer.from(bytes).toString("base64");
      const mimeType = file.type;

      if (mimeType.startsWith("image/")) {
        userContent.push({
          type: "image",
          source: {
            type: "base64",
            media_type: mimeType,
            data: base64,
          },
        });
      } else if (mimeType === "application/pdf") {
        userContent.push({
          type: "document",
          source: {
            type: "base64",
            media_type: "application/pdf",
            data: base64,
          },
        });
      } else {
        // Try to read as text
        const decoder = new TextDecoder();
        const textContent = decoder.decode(bytes);
        userContent.push({
          type: "text",
          text: `Document content:\n\n${textContent}`,
        });
      }
    }

    // Handle pasted text
    if (text) {
      userContent.push({
        type: "text",
        text: `Medical document text:\n\n${text}`,
      });
    }

    userContent.push({
      type: "text",
      text: "Please interpret this medical document. Provide a clear, plain-language explanation organized as follows:\n\n1. **Document Type** — What kind of document is this (radiology report, lab results, pathology report, discharge summary, etc.)?\n\n2. **Key Findings** — What are the most important findings? Explain each in plain language a non-medical person can understand.\n\n3. **What This Means** — Summarize what these findings suggest about the patient's condition. Be specific but accessible.\n\n4. **Questions to Ask Your Doctor** — Based on these findings, what are 3-5 specific questions the patient should ask at their next appointment?\n\n5. **Next Steps** — What typically happens next based on findings like these?\n\nIMPORTANT: This is for educational purposes. Always recommend consulting with their healthcare provider for medical decisions. Do not diagnose or prescribe. Be honest about any findings you cannot read clearly.",
    });

    messages.push({ role: "user", content: userContent });

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 4096,
        messages,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Anthropic API error:", err);
      return NextResponse.json(
        { error: "Failed to interpret document" },
        { status: 500 }
      );
    }

    const data = await response.json();
    const interpretation =
      data.content?.[0]?.type === "text" ? data.content[0].text : "";

    return NextResponse.json({ interpretation });
  } catch (error) {
    console.error("Interpret error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
