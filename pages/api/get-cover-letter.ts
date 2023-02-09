// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  coverletter: string,
}

type Error = {
  message: string,
}

const GPT_KEY = process.env.GPT_API_KEY

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${GPT_KEY}`
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | Error>
) {

  let position = 'CEO', company = 'company', description = ''
  if (req.body) {

    let body = JSON.parse(req.body)
    position = body.position
    company = body.company
    description = body.description

    console.log(`position: ${position}`)
    console.log(`company: ${company}`)
    console.log(`description: ${description}`)
  }

  let basePrompt = `Write me a cover letter for the position of ${position} at ${company} with the following job description: ${description}`
  try {

    const response = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: 'text-davinci-003',
        prompt: basePrompt,
        temperature: 0,
        max_tokens: 550
      })
    })

    const coverletter = await response.json()

    if (coverletter.error) {
      console.log(`an error occured: ${coverletter.error}`)
    }
    else {
      console.log(`coverletter: ${coverletter.choices[0].text}`)

    }

    res.status(200).json({
      message: 'success',
      coverletter: coverletter.choices[0].text
    })
    

  } catch (err) {
    console.log('error: ', err)
  }
}
