/*
  * Isso é um poc - então leia o comentário abaixo.
  * Observação: fiz isso rapído então n venha falar sobre qualidade de código...
  *
*/
const initObject = {
  campaign: null,
  stage: null
}

/**
 * @funtion
 * @param  {Array} data
 * @return {String}
 */
const makeElemets = (data) => data.reduce((acc, el) => {
  acc += `${generateFormBaseElement(el)}\n`
  return acc
}, '')

/**
 * @function
 * @param  {any} body
 * @return {Array}
 */
const bodyLoader = (body) => body.filter(val => {
  if (val.loader) return val.name.toLowerCase()
})

/**
 * @param  {any} object
 * @param  {Array} body
 * @param  {any}
 * @return {void}
 */
const validateLocalStorage = (object, ...body) => returnObject => {
  body.map(key => {
    if (object[key] !== undefined) returnObject[key] = object[key]
    return returnObject
  })
}

/**
 * @function
 * @param  {any} data
 * @return {string}
 */
const getTemplate = (data, button) => `
<div class="container">
  <div class="card" style="margin-top: 50px">
    <div class="card-body">
        <form id=${initObject.campaign}>\n
            ${makeElemets(data)}
          <div class="d-flex flex-row-reverse">
            <input type="submit" class="btn btn-primary" value="${button || 'enviar'}" ></input>
          </div>
      </form>
    </div>
  </div>
</div>`

/**
 * @function
 * @param  {Array} keysForm
 * @return {Object}
 */
const getFormsValue = (keysForm) => {
  return keysForm.reduce((acc, value) => {
    acc = { ...acc, ...{ [value]: window.document.getElementById(`${initObject.campaign}`).elements[`${value}`].value } }
    return acc
  }, {})
}

/**
 * @function
 * @param  {any} data
 * @return {void}
 */
const persistenceLocalStorageSave = (data) => window.localStorage.setItem('clin-campaign', JSON.stringify(data))


const persistenceLocalStorageGet = () => JSON.parse(window.localStorage.getItem('clin-campaign'))

/**
 * @function
 * @param {null}
 * @return {void}
 */
const formSubmit = async (e) => {
  try {
    e.preventDefault()
    const obj = getFormsValue(initObject.keysForms)
    obj.campaign = initObject.campaign
    obj.stage = initObject.stage
    const response = await requestApi(`${initObject.url}/api/form`, 'POST', obj)

    document.getElementById(initObject.campaign).reset()
    persistenceLocalStorageSave({ ...response, ...obj })
    if (response && response.message) window.alert(response.message)
    if (response && response.redirect) window.location.href = response.redirect
  } catch (error) {
    throw new Error(error.message)
  }
}

/**
 * @function
 * @param {null}
 * @return {void}
 */
const addStyle = () => {
  const headID = document.getElementsByTagName('head')[0]
  const link = document.createElement('link')
  link.type = 'text/css'
  link.rel = 'stylesheet'
  headID.appendChild(link)
  link.href = 'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css'
}

/**
 * @function
 * @param  {any} body
 * @return {Array}
 */
const getKeyForms = (body) => body.map(val => val.name.toLowerCase())

/**
 * @function
 * @param  {object} campaign
 * @return {any}
 */
const validateDependency = (campaign) => {
  const applicationStorage = persistenceLocalStorageGet()

  if (!campaign.dependency) return null
  if (!applicationStorage) window.location.href = 'https://planoclin.com.br'

  if (
    applicationStorage &&
    applicationStorage.stage &&
    applicationStorage.campaign
  ) {
    if (applicationStorage.stage !== campaign.stage) return null
    if (campaign.campaign !== applicationStorage.campaign) return null

    const loader = bodyLoader(campaign)

    const loaderData = validateLocalStorage(applicationStorage, loader)

    if (loaderData.length === loader) return loaderData

    window.location.href = 'https://planoclin.com.br'
  }
}

/**
 * @function
 * @param {null}
 * @return {void}
 */
function watchFormSubmit() {
  const element = window.document.querySelector('form')

  element.addEventListener('submit', formSubmit, false)

}

/**
 * @function
 * @description Não quiseram fazer da forma correta, por isso fiz essa gambiarra.
 * @param  {Array} body
 * @return {void}
 */
const watchErrorCustom = (body) => {
  const elements = window.document.getElementsByTagName('input')
  for (const iterator of elements) {
    const idName = iterator.getAttribute('#form')
    if (idName) {
      const elementBody = body.find(val => val.name.toLowerCase() === idName.toLocaleLowerCase())

      if (elementBody) iterator.setCustomValidity(elementBody.error)
    }
  }
}

/**
 * @function
 * @param  {number} campaign
 * @param  {number} stage
 * @return {void}
 */
const formGenerate = async ({ url, campaign, stage }) => {
  try {
    addStyle()
    if (!campaign || typeof campaign !== 'string') throw new Error('Parâmetro campanha inválido!')
    if (!stage || typeof stage !== 'number') throw new Error('Parâmetro etapa inválido!')
    const response = await searchFormApi(url, campaign, stage)

    initObject.url = url
    initObject.campaign = campaign
    initObject.stage = stage

    if (response.body) {
      initObject.keysForms = getKeyForms(response.body)
      validateDependency(response)
      const template = getTemplate(response.body, response.button)


      window.document.getElementById('form_generate').innerHTML = template
      if (template) {
        watchFormSubmit()
        // gambiarra linda para custom error no javascript
        watchErrorCustom(response.body)
      }
    } else window.document.getElementById('form_generate').innerHTML = '<h1> Erro de comunicação tente, novamente mais tarde!</h1>'
  } catch (error) {
    window.document.getElementById('form_generate').innerHTML = '<h1> Erro de comunicação tente, novamente mais tarde!</h1>'
  }
}

/**
 * @function
 * @param  {string} url
 * @param  {string} method
 * @param  {any} body
 * @return {Promise | throw}
 */
const requestApi = (url, method, data) => {
  return window.fetch(url, {
    method,
    headers: new window.Headers({
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify(data)
  }).then(response => response.json())
}

/**
 * @function
 * @param  {string} url
 * @return {Promise | throw}
*/
const searchFormApi = async (url, campaign, stage) => {
  const urlFetchRequest = `${url}/api/campaign?campaign=${campaign}&stage=${stage}`
  return requestApi(urlFetchRequest, 'GET')
}

/**
 * @function
 * @param  {Array} data
 * @param  {Object} map
 * @return {String}
 */
const comboPopulate = (data, map) => {
  return data.reduce((acc, el) => {
    acc += `<option value="${el[map.value]}">${el[map.name]}</option>`
    return acc
  }, '<option value="">Selecione uma Opção</option>')
}

/**
 * @function
 * @param  {Object} element
 * @return {{text: string, password: string, email: string, textarea: string, select: string, number}}
 */

const generateFormBaseElement = (element) => {
  const input = () => `<div class="form-group" >
                                <label for="exampleInputEmail1">${element.name}</label>
                                <input type="${element.type}"  #form='${element.name.toLowerCase()}' class="${element.class || 'form-control'}"  pattern='${element.pattern || ''}' placeholder="${element.placeholder}" ${element.required ? 'required' : ''}>
                            </div>`

  const number = () => `<div class="form-group">
                                <label for="exampleInputEmail1">${element.name}</label>
                                <input type="${element.type}" #form-${element.name.toLowerCase()} class="${element.class || 'form-control'}" pattern='${element.pattern || ''}'  placeholder="${element.placeholder}" min="${element.min || 0}" max="${element.max || 0}" ${element.required ? 'required' : ''}>
                            </div>`

  const textarea = () => `<div class="form-group" >
                              <label for="exampleFormControlTextarea1">${element.name}</label>
                              <textarea class="${element.class || 'form-control'}" id="${element.name.toLowerCase()}" placeholder="${element.placeholder}" rows="3" ${element.required ? 'required' : ''}></textarea>
                            </div > `

  const select = () => `<div class="form-group" >
            <label for="exampleFormControlSelect1">${element.name}</label>
              <select class="${element.class || 'form-control'}" id="${element.name.toLowerCase()}" ${element.required ? 'required' : ''}>
                ${comboPopulate(element.source, { value: 'id', name: 'name' })}
              </select>
</div > `

  const types = {
    text: input,
    password: input,
    email: input,
    textarea: textarea,
    select: select,
    number: number
  }

  return (types[element.type])()
}
