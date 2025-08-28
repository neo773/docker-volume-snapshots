import prompts from "prompts";

type Choice = {
  title: string;
  value: string;
};

export class Prompts {
  static async select<T extends string>(
    message: string,
    choices: Choice[],
  ): Promise<T> {
    const response = await prompts({
      type: "select",
      name: "value",
      message,
      choices,
    });

    if (!response.value) {
      throw new Error("No selection made");
    }

    return response.value;
  }

  static async confirm(message: string, initial = false): Promise<boolean> {
    const response = await prompts({
      type: "confirm",
      name: "value",
      message,
      initial,
    });

    return response.value ?? false;
  }

  static async text(message: string, initial = ""): Promise<string> {
    const response = await prompts({
      type: "text",
      name: "value",
      message,
      initial,
    });

    return response.value ?? "";
  }
}
