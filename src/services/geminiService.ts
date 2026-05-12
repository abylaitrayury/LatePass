import { ExcuseResponse } from "../types";

export async function generateExcuses(
  situation: string,
  teacherName?: string,
  className?: string
): Promise<ExcuseResponse> {
  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        situation,
        teacherName,
        className,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to generate excuses");
    }

    return await response.json();
  } catch (error) {
    console.error("Error calling backend:", error);
    throw error;
  }
}
