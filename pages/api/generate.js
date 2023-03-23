import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const animal = req.body.animal || '';
  if (animal.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid animal",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(animal),
      temperature: 0.5,
      max_tokens: 500,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}


function generatePrompt(animal) {
  const capitalizedAnimal =
    animal[0].toUpperCase() + animal.slice(1).toLowerCase();
  return `Напиши максимум 5 настоящих блюд которые можно приготовить имея только данные ингридиенты и ничего больше, поставь знак * в конце каждого блюда.

  Animal: Мясо Картошка Лук
  Names: Пюре с жареным мясом * Котлеты с луком и варенной картошкой * Мясное рагу с картошкой и луком
  Animal: Яйцо Колбаса Сыр Хлеб
  Names: Яичница с колбасой и сыром * Бутерброды с колбасой и сыром
Animal: ${animal}
Names:`;
}