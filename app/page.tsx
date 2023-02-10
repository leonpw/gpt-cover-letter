'use client'

import React, { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'


export default function Home() {
  const [request, setRequest] = useState<{description?: string, position?: string, company?: string}>({})
  let [coverletter, setCoverletter] = useState<string>('')

  useEffect(() => {
    checkRedirect()
  }, [])

  function checkRedirect() {
    if (window.location.hostname === 'gpt-cover-letter.vercel.app') {
      window.location.replace('https://cover-letter.wieisleon.nl/')
    }
  }

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [showError, setShowError] = useState(false)
  const [errorText, setErrorText] = useState('')

  async function log() {
    console.log(`Someone clicked`)
    const response = await fetch('/api/log', {
      method: 'POST',
      body: JSON.stringify({
        company: request.company,
        position: request.position,
        description: request.description,
      })
    })
    const json = await response.json()
  }

  async function hitAPI() {
    try {
      if (!request.description || !request.position || !request.company) return
      
      setMessage('Building cover letter...')
      setShowError(false)
      setLoading(true)
      setCoverletter('')

      setTimeout(() => {
        if (!loading) return
        setMessage('Writing last sentences ...')
      }, 7000)

      setTimeout(() => {
        if (!loading) return
        setMessage('Almost there ...')
      }, 15000)

      const response = await fetch('/api/get-cover-letter', {
        method: 'POST',
        body: JSON.stringify({
          company: request.company,
          position: request.position,
          description: request.description,
        })
      })
      .then(function(response) {                      // first then()
        if(response.ok)
        {
          return response.json();         
        }
        throw new Error('Something went wrong.');
      })  
      .then((data) => {

        if(data.coverletter != undefined){

          let coverletter = data.coverletter
          setCoverletter(coverletter)
          setShowError(false)
          setLoading(false)
        }
        if(data.message != undefined) {
          setCoverletter('')
          setErrorText(data.message)
          setShowError(true)
          setLoading(false)
        }
      })


    } catch (err) {
      
      setLoading(false)
      setShowError(true)
      setCoverletter('')
      setErrorText('An error occured')
    }
  }
  
  const dev = process.env.NODE_ENV == "development"

  return (
    <main>
      <div className="app-container">
        <h1 style={styles.header} className="hero-header">Cover Letter AI</h1>

  
        <div style={styles.formContainer} className="form-container">
          
        <p>
    So you decided to apply for a job? 
    And you need a cover letter? Wait no more! We got you covered! Fill in the 3 boxes below and we write one for you!
    
        </p>      

          <input style={styles.input}  placeholder="Position" onChange={e => 
          setRequest(request => ({
            ...request, position: e.target.value
          }))} />
          <input style={styles.input} placeholder="Company" onChange={e => setRequest(request => ({
            ...request, company: e.target.value
          }))} />
          <textarea style={styles.inputtextarea} placeholder="Job description (Copy from job board)" onChange={e => setRequest(request => ({
            ...request, description: e.target.value
          }))} />
          <button className="input-button"  onClick={hitAPI}>Let AI write my Cover Letter!</button>
          
          {
        dev && (
          <button className='input-button' onClick={log} > log </button>
        )
        }
        </div>
        <div className="results-container">
        {
          loading && (
            <p>{message}</p>
          )
          }
           
        { 
          showError&& (
            <p>{errorText}</p>
          )
        }
      {
        <ReactMarkdown className='foo'
        remarkPlugins={[remarkGfm]}
        >
          {`${coverletter?.replace(/\n/g, "  \n&nbsp;  ")}`}
          </ReactMarkdown>
        
      }
        </div>
      </div>
    </main>
  )
}

const styles = {
  header: {
    textAlign: 'center' as 'center',
    marginTop: '60px',
    color: 'black',
    fontWeight: '900',
    fontFamily: 'Lora',
    fontSize: '68px'
  },
  input: {
    padding: '10px 14px',
    marginBottom: '4px',
    outline: 'none',
    fontSize: '16px',
    width: '100%',
    borderRadius: '8px',
  },
  inputtextarea: {
    padding: '10px 14px',
    marginBottom: '4px',
    outline: 'none',
    fontSize: '16px',
    width: '100%',
    borderRadius: '8px',
    height: '200px'
  },
  formContainer: {
    textAlign: 'center' as 'center',
    display: 'flex',
    flexDirection: 'column' as 'column',
    margin: '20px auto 0px',
    padding: '20px',
    boxShadow: '0px 0px 12px rgba(198, 131, 255, .2)',
    borderRadius: '10px',
    backgroundColor: '#99A799'
  },
  result: {
    color: 'white'
  }
}
