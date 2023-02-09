// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import logInfo from '@/app/services/logger'
import type { NextApiRequest, NextApiResponse } from 'next'


type Data = {
  coverletter: string,
}

type Error = {
  message: string,
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
    logInfo(`${req.connection.remoteAddress}`)

  }

  try {

    res.status(200).json({
      message: 'success',
      coverletter: 'logged'
    })
    

  } catch (err) {
    console.log('error: ', err)
  }
}
