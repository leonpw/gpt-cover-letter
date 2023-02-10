// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import logInfo, { logError } from '@/app/services/logger'
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

    logInfo(`${req.body}`)
    logInfo(`${req.rawHeaders}`)

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

    const json = await response.json()

    if (json.error) {
      logError(json.error.message)
      res.status(200).json({
        message: 'Something went wrong!',
      })
    }
    else {
      logInfo(json.choices[0].text)
      
      res.status(200).json({
        coverletter: json.choices[0].text
      })
    }
    
  } catch (err) {
    logError(`${err}`)
  }
}
